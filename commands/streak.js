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
    var streakNum = 0;
    for(let i = 0; i < streaks.length; ++i) {
      if (streak < streaks[i][0]) {
        streakNum = i;
        break;
      }
    }
    console.log(streakNum)
    if (streakNum == 0) {
      var total = 3;
      var current = streak;
    } else {
      var total = streaks[streakNum][0] - streaks[streakNum-1][0];
      var current = current - streaks[streakNum-1][0];
    }
    interaction.reply({ embeds: [new MessageEmbed().setColor('#9e9d9d').setDescription(`Your current streak is ${streak}🔥\nNext Streak: ${streaks[streakNum][0]} Days\nNext Streak Value: ${floor(streaks[streakNum][2])}🦴\n<${progressbar.filledBar(total, current)}>`)] });
  }
};