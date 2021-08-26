const { MessageEmbed } = require('discord.js');
const { dailyAmount } = require('../general/config.json');
module.exports = {
	name: 'daily',
	description: 'Claim your daily reward',
  usage: `daily`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var date = new Date();

    if (getUserDaily(interaction.user.id) != date.getDate()) {
      addUserBalance(interaction.user.id, dailyAmount);
      addUserBalance('bank', -dailyAmount);
      setUserDaily(interaction.user.id, date.getDate());
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`${interaction.user} just claimed ${dailyAmount}🦴 for the day`).setColor('#baffc9') ] });
      log('830503210951245865', `+${dailyAmount}🦴 to ${interaction.user} for their daily claim`, '#baffc9');
    } else {
      let result = 24 - date.getHours();
  
      if (result == 1) result = `${result} hour`;
      else result = `${result} hours`;
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`${interaction.user} you have already claimed for the day\nYou can claim again in ${result}`).setColor('#9e9d9d') ] });
    }
  }
};