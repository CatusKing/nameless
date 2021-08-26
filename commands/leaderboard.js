const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'leaderboard',
	description: 'Updates the leaderboard',
  usage: `leaderboard`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('830496065366130709')) {
      updateLeaderboard(client, db, round);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Updated the leaderboard`).setColor('#ffffba') ] });
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have perms for that you dumb`).setColor('#ffffba') ] });
  }
};