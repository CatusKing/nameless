const { MessageEmbed } = require('discord.js');
const { adminRoles } = require('../general/config.json');
module.exports = {
	name: 'admin',
	description: 'Toggles admin mode',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var yes = true;
    interaction.member.roles.cache.forEach(r => {
      if (adminRoles.includes(r.id) && yes) {

        if (admins.includes(interaction.user.id)) {
          for (var i = 0; i < admins.length; i++) {
  
            if (admins[i] === interaction.user.id) {
              admins.splice(i, 1);
              interaction.reply({ embeds: [ new MessageEmbed().setDescription(`No longer ignoring you from auto mod\nid: ${interaction.user.id}`).setColor('#9e9d9d') ] });
              break;
            }
          }
        } else {
          admins.push(interaction.user.id);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Ignoring you from auto mod\nid: ${interaction.user.id}`).setColor('#9e9d9d') ] });
        }
        setServerAdmins(admins);
        yes = false;
      }
    });
    if (yes) interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Sorry you don't have perms for this`).setColor('#9e9d9d') ] });
  }
};