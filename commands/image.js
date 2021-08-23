const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'image',
	description: 'Sends a random image',
	usage: `image`,
	command: true,
	aliases: ['image'],
  slash: true,
  options: [],
  executeI(client, interaction) {
    var seed = Math.floor(Math.random() * 5000);
    interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(`https://picsum.photos/seed/${seed}/500/300`) ] })
  },
	execute(client, msg) {
    var seed = Math.floor(Math.random() * 5000);
    msg.channel.send({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(`https://picsum.photos/seed/${seed}/500/300`) ] })
  }
};