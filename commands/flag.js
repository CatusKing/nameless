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
    for(let i = 0; i < 9; ++i) {
      var random2 = Math.floor(flags.length * Math.random());
      options.push({ label: flags[random2][1], value: `${flags[random2][0]}-${flags[random][0]}` });
    }
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('flagSelect')
          .setPlaceholder('Nothing selected')
          .addOptions([
            {
              label: 'Select me',
              description: 'This is a description',
              value: 'first_option',
            },
            {
              label: 'You can select me too',
              description: 'This is also a description',
              value: 'second_option',
            },
          ]),
      );
    interaction.reply({ 
      embeds: [new MessageEmbed().setColor('#9e9d9d').setTitle('What country is this?').setImage(`https://www.countryflags.io/${flags[random][0]}/flat/64.png`)],
      components: [row]
    });
  }
};