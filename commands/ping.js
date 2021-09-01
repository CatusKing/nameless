const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Sends the bot\'s ping',
  usage: `ping`,
  command: true,
  aliases: ['ping'],
  slash: true,
  executeI(client, interaction) {
    interaction.reply('Pinging...');
    interaction.fetchReply().then(reply => {
      reply.edit('\u200B');
      const ping = new MessageEmbed()
        .setColor('#9e9d9d')
        .setTitle('Pong!')
        .setDescription(`Roundtrip latency is ${Math.floor(reply.createdTimestamp - interaction.createdTimestamp)}ms \nAPI Latency is ${Math.round(client.ws.ping)}ms`);
      reply.edit({ embeds: [ping] });
    });
  },
	execute(client, msg) {
    msg.channel.send('Pinging...').then((message) => {
      message.edit("\u200B");
      const ping = new MessageEmbed()
        .setColor('#9e9d9d')
        .setTitle('Pong!')
        .setDescription(`Roundtrip latency is ${Math.floor(message.createdTimestamp - msg.createdTimestamp)}ms \nAPI Latency is ${Math.round(client.ws.ping)}ms`);
      message.edit({ embeds: [ping] });
    });
  }
};