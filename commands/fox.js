const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'fox',
	description: 'Sends a random fox image',
	command: false,
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://randomfox.ca/floof/', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(body.image) ] });
    });
  }
};