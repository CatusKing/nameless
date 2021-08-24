const { MessageEmbed } = require("discord.js");
const { flags } = require('../general/config.json');

module.exports = {
	name: 'flag',
	description: 'WIP',
	usage: `flag`,
	command: true,
  slash: true,
  options: [],
  executeI(client, interaction) {
    var random = Math.floor(flags.length * Math.random())
    interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(flags[random][1]).setImage(`https://www.countryflags.io/${flags[random][0]}/flat/64.png`) ] });
  }
};