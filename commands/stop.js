const { MessageEmbed } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
	name: 'stop',
	description: 'Stops the bot',
  usage: `stop`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.user.id != '473110112844644372') return interaction.reply(`<@473110112844644372>`);
    interaction.reply({ embeds: [ new MessageEmbed().setDescription('Stopping...').setColor('#9e9d9d') ] });
    setTimeout(() => {
      exec('pm2 stop nameless');
    }, 1500);
  }
};