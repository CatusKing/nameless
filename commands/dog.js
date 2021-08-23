const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'dog',
	description: 'Sends a random dog image',
	usage: `dog`,
	command: true,
	aliases: ['dog'],
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://dog.ceo/api/breeds/image/random', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(body.message) ] });
    });
  },
	execute(client, msg) {
    request('https://dog.ceo/api/breeds/image/random', { json: true }, (err, res, body) => {
      msg.channel.send({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(body.message) ] });
    });
  }
};