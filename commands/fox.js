const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'fox',
	description: 'Sends a random fox image',
	usage: `fox`,
	command: true,
	aliases: ['fox'],
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://randomfox.ca/floof/', { json: false }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(body.image) ] });
    });
  },
	execute(client, msg) {
    request('https://randomfox.ca/floof/', { json: false }, (err, res, body) => {
      msg.channel.send({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(body.image) ] });
    });
  }
};