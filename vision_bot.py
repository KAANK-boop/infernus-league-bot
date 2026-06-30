import os
import io
import asyncio
import logging

import discord
from discord import app_commands
from discord.ext import commands
import aiohttp
import cv2
import numpy as np
from dotenv import load_dotenv

# =============================================================================
# LOGLAMA AYARLARI
# =============================================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger("vision_bot")

# =============================================================================
# .env DOSYASINDAN TOKEN OKUMA
# =============================================================================
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
if not TOKEN:
    msg = "DISCORD_TOKEN .env dosyasında bulunamadı!"
    log.critical(msg)
    raise ValueError(msg)

# =============================================================================
# DISCORD INTENTS VE BOT BAŞLATMA
# =============================================================================
PREFIX = "."

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix=PREFIX, intents=intents)
tree = bot.tree

# =============================================================================
# ASENKRON GÖRSEL İNDİRME (aiohttp)
# =============================================================================
async def _indir_gorsel(url: str) -> np.ndarray:
    """
    Verilen URL'den görseli aiohttp ile asenkron indirir,
    numpy dizisine (OpenCV formatı) çevirip döndürür.
    Geçersiz URL / dosya durumunda hata fırlatır.
    """
    async with aiohttp.ClientSession() as session:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
            if resp.status != 200:
                raise ValueError(
                    f"Görsel indirilemedi (HTTP {resp.status}). Lütfen geçerli bir "
                    f"görsel linki kontrol edin."
                )
            ham_veri = await resp.read()

    # io.BytesIO + numpy -> OpenCV (BGR)
    np_arr = np.frombuffer(ham_veri, dtype=np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(
            "Dosya geçerli bir görsel formatında değil. Lütfen JPEG/PNG gibi "
            "desteklenen bir format gönderin."
        )
    return img


async def _cv2_isle(func, *args, **kwargs):
    """
    OpenCV'nin senkron fonksiyonlarını asenkron executor havuzunda çalıştırır.
    Bot ana event loop'unu bloklamamak için kullanılır.
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, lambda: func(*args, **kwargs))


async def _isle_ve_gonder(
    interaction: discord.Interaction,
    url: str,
    isleme_adi: str,
    cv2_islevi,
    ek_params: tuple = (),
):
    await interaction.response.defer()

    try:
        img = await _indir_gorsel(url)
    except Exception as e:
        await interaction.followup.send(f"❌ **Görsel alınamadı:** {e}")
        return

    try:
        sonuc = await _cv2_isle(cv2_islevi, img, *ek_params)
    except Exception as e:
        await interaction.followup.send(
            f"❌ **{isleme_adi} işlemi sırasında hata oluştu:** {e}"
        )
        return

    basarili, buffer = await _cv2_isle(cv2.imencode, ".jpg", sonuc)
    if not basarili:
        await interaction.followup.send("❌ Görsel encode edilemedi.")
        return

    disk_nesnesi = discord.File(
        io.BytesIO(buffer.tobytes()), filename=f"{isleme_adi}.jpg"
    )
    await interaction.followup.send(file=disk_nesnesi)


async def _prefix_isle_ve_gonder(
    ctx: commands.Context,
    url: str,
    isleme_adi: str,
    cv2_islevi,
    ek_params: tuple = (),
):
    """Prefix komutları için _isle_ve_gonder benzeri, commands.Context kullanır."""
    async with ctx.typing():
        try:
            img = await _indir_gorsel(url)
        except Exception as e:
            await ctx.send(f"❌ **Görsel alınamadı:** {e}")
            return

        try:
            sonuc = await _cv2_isle(cv2_islevi, img, *ek_params)
        except Exception as e:
            await ctx.send(f"❌ **{isleme_adi} işlemi sırasında hata oluştu:** {e}")
            return

        basarili, buffer = await _cv2_isle(cv2.imencode, ".jpg", sonuc)
        if not basarili:
            await ctx.send("❌ Görsel encode edilemedi.")
            return

        disk_nesnesi = discord.File(
            io.BytesIO(buffer.tobytes()), filename=f"{isleme_adi}.jpg"
        )
        await ctx.send(file=disk_nesnesi)


def _gorsel_url_al(ctx: commands.Context) -> str | None:
    """Mesajdaki eki veya mesaj metnindeki son URL'yi döndürür."""
    if ctx.message.attachments:
        return ctx.message.attachments[0].url
    # Komut satırındaki son kelimeyi URL olarak dene
    kelimeler = ctx.message.content.split()
    if len(kelimeler) > 1:
        son_kelime = kelimeler[-1]
        if son_kelime.startswith("http://") or son_kelime.startswith("https://"):
            return son_kelime
    return None


# =============================================================================
# KOMUTLAR (Slash Commands)
# =============================================================================

@tree.command(name="gri", description="Gönderilen görseli siyah-beyaz (grayscale) yapar.")
@app_commands.describe(
    gorsel="Görselin direkt linki (https://...jpg/png) veya bir dosya",
)
async def gri(interaction: discord.Interaction, gorsel: str):
    await _isle_ve_gonder(
        interaction,
        url=gorsel,
        isleme_adi="gray",
        cv2_islevi=cv2.cvtColor,
        ek_params=(cv2.COLOR_BGR2GRAY,),
    )


@tree.command(name="bulanik", description="Görsele Gaussian Blur uygular.")
@app_commands.describe(
    gorsel="Görselin direkt linki (https://...jpg/png)",
    miktar="Bulanıklık miktarı (tek sayı, örn: 3, 5, 9, 15, 25, 51)",
)
async def bulanik(interaction: discord.Interaction, gorsel: str, miktar: int):
    # GaussianBlur çekirdek boyutu tek sayı olmalı
    if miktar < 3 or miktar % 2 == 0:
        await interaction.response.send_message(
            "⚠️ Bulanıklık miktarı **3 veya daha büyük tek bir sayı** olmalıdır. "
            "Örnek: 5, 9, 15, 25",
            ephemeral=True,
        )
        return
    ksize = (miktar, miktar)
    await _isle_ve_gonder(
        interaction,
        url=gorsel,
        isleme_adi="blurred",
        cv2_islevi=cv2.GaussianBlur,
        ek_params=(ksize, 0),
    )


@tree.command(name="kenar", description="Canny Edge Detection ile görseldeki kenarları tespit eder.")
@app_commands.describe(
    gorsel="Görselin direkt linki (https://...jpg/png)",
)
async def kenar(interaction: discord.Interaction, gorsel: str):
    async def _canny_pipeline(img):
        # Gri tonlamaya çevir, ardından Gaussian Blur + Canny
        gri_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur_img = cv2.GaussianBlur(gri_img, (5, 5), 0)
        return cv2.Canny(blur_img, 50, 150)

    await _isle_ve_gonder(
        interaction,
        url=gorsel,
        isleme_adi="edges",
        cv2_islevi=_canny_pipeline,
    )


# =============================================================================
# PREFIX KOMUTLAR (.gri, .bulanik, .kenar)
# =============================================================================

@bot.command(name="gri")
async def prefix_gri(ctx: commands.Context):
    url = _gorsel_url_al(ctx)
    if not url:
        await ctx.send("⚠️ Bir görsel **ekle** veya görsel linki **yaz** (örn: `.gri https://...`)")
        return
    await _prefix_isle_ve_gonder(ctx, url, "gray", cv2.cvtColor, (cv2.COLOR_BGR2GRAY,))


@bot.command(name="bulanik")
async def prefix_bulanik(ctx: commands.Context):
    # Miktarı ve URL'yi mesaj metninden elle ayıkla
    kelimeler = ctx.message.content.split()
    if len(kelimeler) < 2:
        await ctx.send("⚠️ Kullanım: `.bulanik <miktar> [görsel]` (örn: `.bulanik 15`)")
        return
    try:
        miktar = int(kelimeler[1])
    except ValueError:
        await ctx.send("⚠️ İkinci argüman **tek bir sayı** olmalı (örn: `.bulanik 15`).")
        return
    if miktar < 3 or miktar % 2 == 0:
        await ctx.send("⚠️ Bulanıklık miktarı **3 veya daha büyük tek bir sayı** olmalıdır. Örnek: 5, 9, 15")
        return
    url = _gorsel_url_al(ctx)
    if not url:
        await ctx.send("⚠️ Bir görsel **ekle** veya görsel linki **yaz** (örn: `.bulanik 5 https://...)`")
        return
    await _prefix_isle_ve_gonder(ctx, url, "blurred", cv2.GaussianBlur, ((miktar, miktar), 0))


@bot.command(name="kenar")
async def prefix_kenar(ctx: commands.Context):
    url = _gorsel_url_al(ctx)
    if not url:
        await ctx.send("⚠️ Bir görsel **ekle** veya görsel linki **yaz** (örn: `.kenar https://...`)")
        return

    async def _canny_pipeline(img):
        gri_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur_img = cv2.GaussianBlur(gri_img, (5, 5), 0)
        return cv2.Canny(blur_img, 50, 150)

    await _prefix_isle_ve_gonder(ctx, url, "edges", _canny_pipeline)


# =============================================================================
# BOT OLAY YAKALAYICILARI
# =============================================================================
@bot.event
async def on_ready():
    log.info("Bot giriş yaptı: %s (ID: %s)", bot.user, bot.user.id)
    guilds = [g.name for g in bot.guilds]
    log.info("Bağlı olduğu sunucular (%d): %s", len(guilds), guilds)
    try:
        synced = await tree.sync()
        log.info("%d adet slash komut senkronize edildi.", len(synced))
    except Exception as e:
        log.error("Komut senkronizasyon hatası: %s", e)


# =============================================================================
# BAŞLATMA
# =============================================================================
if __name__ == "__main__":
    bot.run(TOKEN)
