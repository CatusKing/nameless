const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'catfact',
	description: 'Sends a random cat fact',
	usage: `catfact`,
	command: true,
	aliases: ['catfact'],
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://meowfacts.herokuapp.com/', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(body.data[0]) ] });
    });
  },
	execute(client, msg) {
    request('https://meowfacts.herokuapp.com/', { json: true }, (err, res, body) => {
      msg.channel.send({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(body.data[0]) ] });
    });
  }
};