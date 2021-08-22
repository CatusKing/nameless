const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'balance',
	description: 'Allows you to look at your or another users balance',
  usage: `balance [@User]`,
  command: true,
  aliases: ['balance', 'bal'],
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const target = msg.mentions.users.first() || msg.author;
    interaction.reply({ embeds: [ new MessageEmbed().setDescription(`${target} has ${floor(getUserBalance(target.id))}🦴(${getUserBalance(target.id)}🦴)`).setColor('#ffffba') ] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    const target = msg.mentions.users.first() || msg.author;
    reply(msg.channel.id, `${target} has ${floor(getUserBalance(target.id))}🦴(${getUserBalance(target.id)}🦴)`, '#ffffba');
  }
};