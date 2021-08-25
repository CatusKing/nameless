const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { flags } = require('../general/config.json');

module.exports = {
	name: 'flag',
	description: 'WIP',
	usage: `flag`,
	command: true,
  slash: true,
  options: [],
  executeI(client, interaction) {
    var random = Math.floor(flags.length * Math.random());
    var options = [{ label: flags[random][1], value: `${flags[random][0]}-${flags[random][0]}` }];
    var randoms = [random];
    for(let i = 0; i < 4; ++i) {
      var random2 = Math.floor(flags.length * Math.random());
      if (randoms.includes(random2)) continue;
      randoms.push(random2);
      options.push({ label: flags[random2][1], value: `${flags[random2][0]}-${flags[random][0]}` });
    }
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('flag')
          .setPlaceholder('Nothing selected')
          .addOptions(options)
      );
    interaction.reply({ 
      embeds: [new MessageEmbed().setColor('#9e9d9d').setTitle('What country is this?').setImage(`https://www.countryflags.io/${flags[random][0]}/flat/64.png`)],
      components: [row]
    })
    setTimeout(() => {
      interaction.fetchReply().then((msg) => {
        if (msg.components != []) {
          msg.edit({ components: [], embeds: [new MessageEmbed().setColor('#ff7784').setDescription('You ran out of time\n\n(rn you don\'t get money for this yet)')] })
        }
      });
    }, 15000);
  },
  selectMenu: true,
  executeSM(client, interaction) {
    var guess = interaction.values[0].split('-')[0];
    var answer = interaction.values[0].split('-')[1];
    if (guess == answer) interaction.message.edit({ embeds: [new MessageEmbed().setColor('#baffc9').setDescription('Pog you got it right!\n\n(rn you don\'t get money for this yet)')], components: [] });
    else interaction.message.edit({ embeds: [new MessageEmbed().setColor('#ff7784').setDescription('You got it wrong :(\n\n(rn you don\'t get money for this yet)')], components: [] });
  }
};