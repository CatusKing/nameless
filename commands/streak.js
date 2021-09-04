module.exports = {
	name: 'streak',
	description: 'Gives you your current streak',
  usage: `streak`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var streak = db.get(`discord.users.${interaction.user.id}.streak`) || 0
    interaction.reply({ content: `${streak}` })
  }
};