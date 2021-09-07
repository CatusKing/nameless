const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'restart',
	description: 'Restarts the bot',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.user.id != '473110112844644372') return interaction.reply(`<@473110112844644372>`);
    interaction.reply({ embeds: [ new MessageEmbed().setDescription('Restarting...').setColor('#9e9d9d') ] });
    setTimeout(() => {
      console.log('Closing all connections...');
      client.destroy();
      console.log('Finished closing connections');
      process.exit(0);
    }, 1500);
  }
};