const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'status',
	description: 'Updates the bots status',
  command: false,
  slash: true,
  options: [],
	executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('830496065366130709')) {
      updateStatus();
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Updated the status`).setColor(`#9e9d9d`) ] });
    } else return interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Sorry you don't have perms for this`).setColor(`#9e9d9d`) ] });
  }
};