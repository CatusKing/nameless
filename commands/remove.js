const { MessageEmbed } = require('discord.js');
const { prefix } = require('../general/config.json');
module.exports = {
	name: 'remove',
	description: 'Removes from the users balance',
  command: false,
  slash: true,
  options: [
    {
      name: 'amount',
      type: 'INTEGER',
      description: 'The amount of 🦴 to add to a user',
      required: true
    },
    {
      name: 'user',
      type: 'USER',
      description: 'The person you want to give 🦴 to',
      required: false
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('830496065366130709')) {
      const target = interaction.options.getUser('user') || interaction.user;
  
      const amount = interaction.options.getInteger('amount');
      const balance = addUserBalance(target.id, -amount);
      addUserBalance('bank', amount);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Taken ${amount}🦴 from ${target}\nThey now have ${balance}🦴`).setColor('#ff7784') ] });
      log('830503210951245865', `-${amount}🦴 to ${target} given by ${interaction.user}`, '#ff7784');
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Sorry you don't have perms for this`).setColor('#9e9d9d') ] });
  }
};