const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'admins',
	description: 'Displays the current members with admin mode',
  usage: `admins`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    interaction.reply({ embeds: [ new MessageEmbed().setDescription('Restarting...').setColor('#9e9d9d') ] });
    console.log('Closing all connections...');
    client.destroy();
    console.log('Finished closing connections');
    process.exit(0);
  }
};