const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Sends the bot\'s ping',
  usage: `ping`,
  command: true,
  aliases: ['ping'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned) {
    msg.channel.send('Pinging...').then((message) => {
      message.edit("\u200B");
      const ping = new MessageEmbed()
        .setColor('#9e9d9d')
        .setTitle('Pong!')
        .setDescription(`Roundtrip latency is ${Math.floor(message.createdTimestamp - msg.createdTimestamp)}ms \nAPI Latency is ${Math.round(client.ws.ping)}ms`);
      message.edit(ping);
    });
  }
};