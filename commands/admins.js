const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'admins',
	description: 'Displays the current members with admin mode',
  usage: `admins`,
  command: true,
  aliases: ['admins'],
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var description = 'Admins\n';
    for (let i of admins) {
      description += `${client.users.cache.get(i).tag} - ${i}\n`
    }
    interaction.reply({ embeds: [ new MessageEmbed().setDescription(description).setColor('#9e9d9d') ] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins) {
    var description = 'Admins\n';
    for (let i of admins) {
      description += `${client.users.cache.get(i).tag} - ${i}\n`
    }
    reply(msg.channel.id, description, '#9e9d9d');
	},
};