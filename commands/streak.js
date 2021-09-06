const { MessageEmbed } = require("discord.js");
const progressbar = require('string-progressbar');
const { streaks } = require('../general/config.json');

module.exports = {
	name: 'streak',
	description: 'Gives you your current streak',
  usage: `streak`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var streak = db.get(`discord.users.${interaction.user.id}.streak`) || 0;
    var streakTime = db.get(`discord.users.${interaction.user.id}.streakTime`) || 0;
    var streakNum = 0;
    for(let i = 0; i < streaks.length; ++i) {
      if (streak < streaks[i][0]) {
        streakNum = i;
        break;
      }
    }
    if (streakNum == 0) {
      var total = 3;
      var current = streak;
    } else {
      var total = streaks[streakNum][0] - streaks[streakNum-1][0];
      var current = streak - streaks[streakNum-1][0];
    }
    console.debug(total)
    console.debug(current)
    if (streak > 0) {
      var date = new Date();
      if (streakTime <= Math.floor(((date.getTime() / 1000) / 60) / 60) + 24) {
        var description = '\nYou can continue your streak rn!'
      } else {
        if (streakTime - (Math.floor(((date.getTime() / 1000) / 60) / 60) + 24) == 1) var description = `\nYou can continue your streak in 1 hour`
        else var description = `\nYou can continue your streak in ${streakTime - (Math.floor(((date.getTime() / 1000) / 60) / 60) + 24)} hours`        
      }
    } else {
      var description = '\nYou can continue your streak rn!'
    }
    interaction.reply({ embeds: [new MessageEmbed().setColor('#9e9d9d').setDescription(`Your current streak is ${streak}🔥\nNext Streak Goal: ${streaks[streakNum][0]} Day Streak 🔥\nNext Streak Value: ${floor(streaks[streakNum][2])}🦴\n<${progressbar.filledBar(total, current)[0]}>\nYou are ${Math.floor(progressbar.filledBar(total, current)[1])}% the way there${description}`)] });
  }
};