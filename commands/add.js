const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'add',
	description: 'Adds to the users balance',
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
      const amount = Math.floor(interaction.options.getInteger('amount'));
      const balance = addUserBalance(target.id, amount);
      addUserBalance('bank', -amount, `given by ${interaction.user}`);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Given ${amount}🦴 to ${target}\nThey now have ${balance}🦴`).setColor('#baffc9') ] });
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Sorry you don't have perms for this`).setColor('#9e9d9d') ] });
  }
};