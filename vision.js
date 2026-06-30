// =============================================================================
// DISK YONETIMI – opencv4nodejs buffer encoding sorunu nedeniyle gerekli
// =============================================================================
const fs = require("fs");
const path = require("path");

const GECICI_KLASOR = path.join(__dirname, ".vision_tmp");

function tmpKlasoruHazirla() {
    if (!fs.existsSync(GECICI_KLASOR)) {
        fs.mkdirSync(GECICI_KLASOR, { recursive: true });
    }
}

function geciciDosyaAdi(uzanti = ".jpg") {
    return path.join(GECICI_KLASOR, `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${uzanti}`);
}

function temizle() {
    if (fs.existsSync(GECICI_KLASOR)) {
        fs.rmSync(GECICI_KLASOR, { recursive: true, force: true });
    }
}
process.on("exit", temizle);
process.on("SIGINT", () => { temizle(); process.exit(); });
process.on("SIGTERM", () => { temizle(); process.exit(); });

// =============================================================================
// OPENCV KUTUPHANESI – varsa yukle, yoksa Jimp yedek modu
// =============================================================================
let cv;
try {
    cv = require("@u4/opencv4nodejs");
    console.log("[CV] @u4/opencv4nodejs yuklendi.");
} catch (_) {
    try {
        cv = require("opencv4nodejs");
        console.log("[CV] opencv4nodejs yuklendi.");
    } catch (_) {
        console.warn("[CV] opencv4nodejs bulunamadi. Jimp yedek modu kullanilacak.");
        cv = null;
    }
}

// =============================================================================
// DISCORD.JS v14 SLASH COMMANDS
// =============================================================================
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder,
        AttachmentBuilder, Events } = require("discord.js");
const axios = require("axios");
const Jimp = require("jimp");

require("dotenv").config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
    console.error("HATA: DISCORD_TOKEN ve CLIENT_ID .env dosyasinda tanimli olmalidir!");
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// =============================================================================
// SLASH KOMUT TANIMLARI
// =============================================================================
const komutTanimi = [
    new SlashCommandBuilder()
        .setName("gri-yap")
        .setDescription("Yuklenen resmi siyah-beyaz (grayscale) yapar.")
        .addAttachmentOption(o =>
            o.setName("gorsel").setDescription("Islenecek gorsel").setRequired(true)),

    new SlashCommandBuilder()
        .setName("bulaniklastir")
        .setDescription("Gorsele Gaussian Blur uygular.")
        .addAttachmentOption(o =>
            o.setName("gorsel").setDescription("Islenecek gorsel").setRequired(true))
        .addIntegerOption(o =>
            o.setName("seviye")
             .setDescription("Bulaniklik seviyesi (tek sayi, orn: 3, 5, 9, 15)")
             .setRequired(true).setMinValue(3).setMaxValue(99)),

    new SlashCommandBuilder()
        .setName("kenar-bul")
        .setDescription("Canny Edge ile resimdeki kenarlari tespit eder.")
        .addAttachmentOption(o =>
            o.setName("gorsel").setDescription("Islenecek gorsel").setRequired(true)),
].map(k => k.toJSON());

// =============================================================================
// KOMUTLARI API'YE KAYDET
// =============================================================================
const rest = new REST({ version: "10" }).setToken(TOKEN);

async function komutlariKaydet(guildId) {
    try {
        const route = guildId
            ? Routes.applicationGuildCommands(CLIENT_ID, guildId)
            : Routes.applicationCommands(CLIENT_ID);

        const data = await rest.put(route, { body: komutTanimi });
        console.log(`[REST] ${data.length} slash komut kaydedildi.`);
    } catch (err) {
        console.error("[REST] Kayit hatasi:", err.message);
    }
}

// =============================================================================
// YARDIMCI: Gorseli indir -> isle -> AttachmentBuilder ile gonder
// =============================================================================

/** Ham buffer'i opencv (varsa) veya Jimp ile isler */
async function gorselIsle(hamBuffer, islemIsmi, cvFn, jimpFn) {
    tmpKlasoruHazirla();

    if (cv) {
        // ----- OPENCV MODU (bellek + disk karisimi) -----
        const src = cv.imdecode(hamBuffer);
        if (src.empty) throw new Error("Gorsel cozulemedi.");

        const sonuc = cvFn(src);

        // Encode -> buffer -> diske yaz (encoding buffer sorunu asmak icin)
        const gecici = geciciDosyaAdi(".jpg");
        // opencv4nodejs imencode returns a node buffer directly
        const buffer = cv.imencode(".jpg", sonuc);
        fs.writeFileSync(gecici, buffer);

        src.release();
        // sonuc, src ile ayni nesne olabilir; double release sorun yaratmaz
        try { sonuc.release(); } catch (_) {}

        return new AttachmentBuilder(fs.readFileSync(gecici), { name: `${islemIsmi}.jpg` });
    }

    // ----- JIMP YEDEK MODU (tamamen RAM'de) -----
    const img = await Jimp.read(hamBuffer);
    const islenmis = jimpFn(img);
    const buffer = await islenmis.getBufferAsync(Jimp.MIME_JPEG);
    return new AttachmentBuilder(buffer, { name: `${islemIsmi}.jpg` });
}

// =============================================================================
// INTERACTION OLAY YAKALAYICI
// =============================================================================
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction;

    try {
        const gorsel = options.getAttachment("gorsel");
        if (!gorsel || !gorsel.contentType?.startsWith("image/")) {
            await interaction.reply({
                content: "❌ Lutfen gecerli bir **gorsel dosyasi** yukleyin (JPEG/PNG).",
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply();

        // Asenkron gorsel indir (buffer)
        let ham;
        try {
            const res = await axios.get(gorsel.url, { responseType: "arraybuffer" });
            ham = Buffer.from(res.data);
        } catch {
            await interaction.editReply("❌ Gorsel indirilemedi. Dosya cok buyuk veya link gecersiz.");
            return;
        }

        // ===== KOMUT ISLEME =====
        if (commandName === "gri-yap") {
            const ek = await gorselIsle(
                ham,
                "gray",
                // OpenCV
                (mat) => mat.cvtColor(cv.COLOR_BGR2GRAY),
                // Jimp
                (img) => img.grayscale()
            );
            await interaction.editReply({ files: [ek] });

        } else if (commandName === "bulaniklastir") {
            const seviye = options.getInteger("seviye");
            if (seviye % 2 === 0) {
                await interaction.editReply("⚠️ Bulaniklik seviyesi **tek sayi** olmalidir. Orn: 5, 9, 15");
                return;
            }

            const ek = await gorselIsle(
                ham,
                "blurred",
                // OpenCV
                (mat) => mat.gaussianBlur(new cv.Size(seviye, seviye), 0),
                // Jimp
                (img) => img.blur(seviye)
            );
            await interaction.editReply({ files: [ek] });

        } else if (commandName === "kenar-bul") {
            const ek = await gorselIsle(
                ham,
                "edges",
                // OpenCV: Canny Edge
                (mat) => {
                    const gray = mat.bgrToGray();
                    const blur = gray.gaussianBlur(new cv.Size(5, 5), 0);
                    const edges = blur.canny(50, 150);
                    try { gray.release(); } catch (_) {}
                    try { blur.release(); } catch (_) {}
                    return edges;
                },
                // Jimp
                (img) => img.grayscale().contrast(1)
            );
            await interaction.editReply({ files: [ek] });
        }

    } catch (err) {
        console.error(`[HATA] ${interaction.commandName}:`, err.message);
        try {
            const msg = "❌ Bir hata olustu. Gorsel formati uygun olmayabilir veya dosya bozuk.";
            if (interaction.deferred) await interaction.editReply(msg);
            else await interaction.reply({ content: msg, ephemeral: true });
        } catch (_) {}
    }
});

// =============================================================================
// BOT BASLAT
// =============================================================================
client.once(Events.ClientReady, async (c) => {
    console.log(`[BOT] Giris: ${c.user.tag} (ID: ${c.user.id})`);

    // Ilk sunucunun ID'sini kullan (veya GUILD_ID varsa onu)
    const guild = c.guilds.cache.first();
    await komutlariKaydet(guild?.id || null);
});

client.login(TOKEN);
