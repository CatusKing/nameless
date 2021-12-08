const { MessageEmbed } = require('discord.js');
const { adminRoles } = require('../general/config.json');
module.exports = {
	name: 'admin',
	description: 'Toggles admin mode',
  command: false,
  slash: true,
  options: [
    {
      name: 'target',
      description: 'The person you want to give admin',
      type: 'MEMBER',
      required: false
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    let yes = true;
    const target = interaction.options.getMember('target') || interaction.member;
    target.roles.cache.forEach(r => {
      if (adminRoles.includes(r.id) && yes) {

        if (admins.includes(target.id)) {
          for (let i = 0; i < admins.length; i++) {
  
            if (admins[i] === target.id) {
              admins.splice(i, 1);
              interaction.reply({ embeds: [ new MessageEmbed().setDescription(`No longer ignoring ${target} from auto mod\nid: ${target.id}`).setColor('#9e9d9d') ] });
              break;
            }
          }
        } else {
          admins.push(target.id);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Ignoring ${target} from auto mod\nid: ${target.id}`).setColor('#9e9d9d') ] });
        }
        setServerAdmins(admins);
        yes = false;
      }
    });
    if (yes) interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Sorry you don't have perms for this`).setColor('#9e9d9d') ] });
  }
};