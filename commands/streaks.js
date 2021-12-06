const { MessageEmbed } = require("discord.js");
const { streaks } = require('../general/config.json');

module.exports = {
  name: 'streaks',
  description: 'Lists all the possible streak rewards',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    let description = '';
    streaks.forEach(value => {
      description += `${floor(value[2])}🦴 - <@&${value[1]}>\n`;
    });
    interaction.reply({ embeds: [new MessageEmbed().setDescription(description).setColor('#9e9d9d')] })
  }
};