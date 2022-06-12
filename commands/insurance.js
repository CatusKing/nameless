const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
	name: 'insurance',
	description: 'Everything to do with insurance',
	command: false,
  slash: true,
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'help',
      description: 'Describes how the insurance works',
    },
    {
      type: 'SUB_COMMAND',
      name: 'buy',
      description: 'Allows you to buy insurance',
    },
    {
      type: 'SUB_COMMAND',
      name: 'cancel',
      description: 'Cancels your insurance benefits',
    },
    {
      type: 'SUB_COMMAND',
      name: 'status',
      description: 'Tells you if you have insurance',
    }
  ],
  executeI(client = new Client(), interaction = new CommandInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.options.getSubcommand() === 'help') {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(`Saves 20% of your gamble\nInsurance rates start at 5k🦴 a week plus 1/3 of what you owe.\nWhat you owe is decided by how much you've lost and been given back\nYour rate is ${round(5000 + Math.floor(db.get(`discord.users.${interaction.member.id}.insuranceOwed`) / 5 || 0))}🦴`) ] });
    } else if (interaction.options.getSubcommand() === 'buy') {
      if (interaction.member.roles.cache.has('889221970774867968')) {
        interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription('You already have insurance') ] });
      } else {
        const balance = getUserBalance(interaction.user.id);
        const price = 5000 + Math.floor(db.get(`discord.users.${interaction.member.id}.insuranceOwed`) / 5 || 0);
        if (balance >= price) {
          addUserBalance(interaction.user.id, -price, 'buying insurance', false);
          addUserBalance('bank', price, 'bank');
          interaction.member.roles.add('889221970774867968');
          interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(`You just bought insurance for ${round(price)}(${price})🦴`) ] })
        } else {
          interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(`You can't afford insurance\nYou need ${price}🦴\nYou have: ${balance}`) ] })
        }
      }
    } else if (interaction.options.getSubcommand() === 'cancel') {
      if (interaction.member.roles.cache.has('889221970774867968')) {
        interaction.member.roles.remove('889221970774867968', 'Canceled insurance');
        interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(`Insurance canceled`) ] });
      } else {
        interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(`You don't have insurance :()`) ] });
      }
    } else if (interaction.options.getSubcommand() === 'status') {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(`You owe: ${db.get(`discord.users.${interaction.member.id}.insuranceOwed`) || 0}🦴\nYour rate is ${(Math.floor(db.get(`discord.users.${interaction.member.id}.insuranceOwed`) / 5) || 0) + 5000}🦴 per week`) ] });
    }
  },
};