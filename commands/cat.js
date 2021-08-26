const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'cat',
	description: 'Sends a random cat image',
	usage: `cat`,
	command: false,
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://cataas.com/cat?json=true', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(`https://cataas.com${body.url}`) ] });
    });
  }
};