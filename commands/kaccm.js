const { MessageFlags } = require('discord.js');
const { T, Container } = require('../utils/componentsv2');
const E = require('../config/emojis');

const RESPONSES = [
  `${E.CL_loading} Ölçüyorum...`,
  `${E.CL_loading} Cetveli getiriyorum...`,
  `${E.CL_loading} Hmm, şöyle bir bakalım...`,
  `${E.CL_loading} Mühendisler çalışıyor...`,
  `${E.CL_loading} Hassas ölçüm yapılıyor...`,
];

module.exports = {
  kaçcm: {
    execute(message) {
      const cm = Math.floor(Math.random() * 66);
      const intro = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      const container = Container([T([
        `　${intro}`,
        '',
        `　**${E.CL_hedef} Sonuç: \`${cm} cm\`**`,
        '',
        `　*Senin emanetin bu kadar.*`,
        ...(cm < 10 ? ['　😬 Pek iç açıcı değil...'] : cm < 25 ? ['　🤔 İdare eder.'] : cm < 40 ? ['　👍 Fena değil!'] : cm < 55 ? ['　😎 İyi seviye!'] : cm === 65 ? [`　${E.CL_kupa} MAKSİMUM! EFSANE!`] : ['　🔥 Çok iyi!']),
        '',
        `-# Infermus League`,
      ].join('\n'))]);
      message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
  }
};
