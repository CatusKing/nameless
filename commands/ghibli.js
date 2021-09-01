const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'ghibli',
	description: 'Send a Ghibli Studio menu',
	usage: `ghibli`,
	command: false,
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://ghibliapi.herokuapp.com/films', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(`https://cataas.com${body.url}`) ], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('films_1').setLabel('Next').setStyle('PRIMARY'))] });
    });
  },
  button: true,
  buttonId: '_',
  executeB(client, interaction) {
    interaction.reply('buuttooon')
  }
};