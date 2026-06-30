const { ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');

const cities = [
  { name: 'İstanbul', code: 'IST' },
  { name: 'Ankara', code: 'ESB' },
  { name: 'İzmir', code: 'ADB' },
  { name: 'Antalya', code: 'AYT' },
  { name: 'Londra', code: 'LHR' },
  { name: 'Paris', code: 'CDG' },
  { name: 'Amsterdam', code: 'AMS' },
  { name: 'Frankfurt', code: 'FRA' },
  { name: 'Dubai', code: 'DXB' },
];

const airlines = ['✈️ Electro Airlines', '🐦 Pegasus', '🦅 Turkish Airlines', '☀️ SunExpress', '🛩️ AnadoluJet'];

function generateFlight(from, to) {
  const basePrice = 400 + Math.floor(Math.random() * 500);
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const hour = 6 + Math.floor(Math.random() * 15);
  const minute = Math.floor(Math.random() * 4) * 15;
  const dep = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const dur = 45 + Math.floor(Math.random() * 150);
  const arrH = hour + Math.floor((minute + dur) / 60);
  const arrM = (minute + dur) % 60;
  const arr = `${String(arrH % 24).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;
  const stops = Math.random() > 0.7 ? '1 Aktarma' : 'Direkt';
  const price = stops === 'Direkt' ? basePrice : Math.round(basePrice * 0.85);
  return { airline, dep, arr, dur: `${Math.floor(dur / 60)}s ${dur % 60}d`, stops, price, flightNo: `${airline.split(' ').pop()}${100 + Math.floor(Math.random() * 900)}` };
}

module.exports = {
  ucakbileti: {
    async execute(message, args) {
      const row1 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ucak_from')
          .setPlaceholder('📌 Kalkış Noktası')
          .addOptions(cities.map(c => ({ label: `${c.name} (${c.code})`, value: c.code, emoji: '🛫' })))
      );

      const row2 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ucak_to')
          .setPlaceholder('📍 Varış Noktası')
          .addOptions(cities.map(c => ({ label: `${c.name} (${c.code})`, value: c.code, emoji: '🛬' })))
      );

      const msg = await message.channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [Container([T(`**✈️ Uçak Bileti Ara**\n\nAşağıdaki menüden kalkış ve varış noktasını seçin.\n-# Electro Airlines`), row1.toJSON(), row2.toJSON()])]
      });

      const filter = i => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 120000, idle: 60000 });

      let fromCode = null, toCode = null;

      collector.on('collect', async (i) => {
        if (i.customId === 'ucak_from') {
          fromCode = i.values[0];
          await i.reply({ content: `✅ Kalkış: **${cities.find(c => c.code === fromCode).name}**`, ephemeral: true });
        } else if (i.customId === 'ucak_to') {
          toCode = i.values[0];
          await i.reply({ content: `✅ Varış: **${cities.find(c => c.code === toCode).name}**`, ephemeral: true });
        }

        if (fromCode && toCode) {
          collector.stop();
          if (fromCode === toCode) {
            return message.channel.send('❌ Kalkış ve varış noktası aynı olamaz!');
          }

          const fromCity = cities.find(c => c.code === fromCode).name;
          const toCity = cities.find(c => c.code === toCode).name;
          const flights = Array.from({ length: 5 }, () => generateFlight(fromCode, toCode));
          flights.sort((a, b) => a.price - b.price);

          const desc = flights.map((f, i) =>
            `${f.airline} \`${f.flightNo}\`\n🛫 ${f.dep} → 🛬 ${f.arr} (${f.dur}) • ${f.stops}\n💰 **${f.price} ₺**\n`
          ).join('\n');

          await msg.edit({ components: [Container([T(`**✈️ ${fromCity} → ${toCity}**\n\n${desc}\n-# Electro Airlines • .ucakbileti ile yeni arama`)])] });
        }
      });

      collector.on('end', (_, reason) => {
        if (reason === 'time' || reason === 'idle') {
          msg.edit({ components: [] }).catch(() => {});
        }
      });
    }
  }
};
