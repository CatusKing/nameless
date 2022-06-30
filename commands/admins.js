const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'admins',
  description: 'Displays the current members with admin mode',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var description = 'Admins\n';
    for (let i of admins) {
      description += `${client.users.cache.get(i).tag} - ${i}\n`
    }
    interaction.reply({ embeds: [ new MessageEmbed().setDescription(description).setColor('#9e9d9d') ] });
  }
};