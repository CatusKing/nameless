const { MessageEmbed } = require('discord.js');
const { weeklyAmount } = require('../general/config.json');
module.exports = {
	name: 'weekly',
	description: 'Claim your weekly reward',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const weekly = getUserWeekly(interaction.user.id);

    if (weekly <= hours(Date.now())) {
      addUserBalance(interaction.user.id, weeklyAmount, 'their weekly claim');
      addUserBalance('bank', -weeklyAmount, 'bank');
      setUserWeekly(interaction.user.id, hours(Date.now()) + 167);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`${interaction.user} just claimed ${weeklyAmount}🦴 for the week`).setColor('#baffc9') ] });
    } else {
      let result = weekly - hours(Date.now());
      if (result > 24) result = `${Math.floor(result / 24) + 1} days`;
      else if (result == 1) result = `${result} hour`;
      else result = `${result} hours`;
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`${interaction.user} you have already claimed for this week\nYou can claim again in ${result}`).setColor('#9e9d9d') ] });
    }
  }
};