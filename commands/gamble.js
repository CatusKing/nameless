const { MessageEmbed } = require('discord.js');
const config = require('../general/config.json');
const prefix = '/';
module.exports = {
	name: 'gamble',
	description: 'Allows you to gamble for more points',
  command: false,
  slash: true,
  options: [
    {
      type: 'STRING',
      name: 'amount',
      description: 'The amount you want to gamble',
      required: true
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    let embed;
    const balance = getUserBalance(interaction.user.id) || 0;
    const bank = getUserBalance('bank') || 0;
    let bet = 0;

    if (interaction.options.get('amount').value == 'all') bet = balance;
    else if (!Number.isNaN(interaction.options.get('amount').value)) bet = Math.floor(interaction.options.get('amount').value);
    else return interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Hey sorry but you need to use the command like this ${prefix}gamble <all \\|\\| number \\|\\| help>\nMinimal gamble amount is 500🦴`).setColor('#9e9d9d') ] });

    if (bet < 500) return interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Hey sorry but you need to use the command like this ${prefix}gamble <all \\|\\| number \\|\\| help>\nMinimal gamble amount is 500🦴`).setColor('#9e9d9d') ] });
    if (bet > balance) return interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Not enough funds! Your balance is ${balance}🦴 You need at least 500🦴`).setColor('#9e9d9d') ] });
    const slot1 = Math.floor(Math.random() * config.emojis.length);
    const slot2 = Math.floor(Math.random() * config.emojis.length);
    const slot3 = Math.floor(Math.random() * config.emojis.length);
    const diamond = config.emojis.length - 1;
    let total = 0;

    if (slot1 == diamond && slot2 == diamond && slot3 == diamond) total = bet * 25;
    else if (slot1 == diamond && slot2 == diamond || slot1 == diamond && slot3 == diamond || slot2 == diamond && slot3 == diamond) total = bet * 5;
    else if (slot1 == slot2 && slot2 == slot3) total = bet * 10;
    else if (slot1 == slot2 || slot1 == slot3 || slot2 == slot3) total = bet * 2;

    if (slot1 == 0 || slot2 == 0 || slot3 == 0) total = 0;
    let outcome = total - bet;
    if (outcome < 0 && interaction.member.roles.cache.has('889221970774867968')) {
      let insured = outcome;
      outcome = Math.floor(outcome / 5);
      insured = insured - outcome;
      addUserBalance(interaction.user.id, insured, `gambling ${bet}🦴`, false);
      addUserBalance('bank', -insured);
      db.set(`discord.users.${interaction.member.id}.insuranceOwed`, (db.get(`discord.users.${interaction.member.id}.insuranceOwed`) || 0) + -outcome)
      embed = new MessageEmbed()
        .setTitle(`Slot Machine results: ${config.emojis[slot1]} ${config.emojis[slot2]} ${config.emojis[slot3]}`)
        .setFooter(`Use *${prefix}gamble help* for an explanation on the slot machine`)
        .setColor('#ff7784')
        .setDescription(`You Spent: ${bet}🦴\nYou made: ${-outcome}🦴 (${balance + insured}🦴)\n${-insured}🦴 points added to the bank(${bank + -insured}🦴)\nInsurance saved half the bet meaning you owe the other half anf it has been added to your insurance rate`);
      interaction.reply({ embeds: [embed] });
      return;
    }
    addUserBalance(interaction.user.id, outcome, `gambling ${bet}🦴`, false);
    addUserBalance('bank', -outcome, 'bank');
    embed = new MessageEmbed()
        .setTitle(`Slot Machine results: ${config.emojis[slot1]} ${config.emojis[slot2]} ${config.emojis[slot3]}`)
        .setFooter(`Use *${prefix}gamble help* for an explanation on the slot machine`);

    if (total > 0) {
      embed.setColor('#baffc9')
        .setDescription(`You Spent: ${bet}🦴\nYou made: ${total}🦴 (${balance + outcome}🦴)\n${outcome}🦴 points taken from the bank(${bank + -outcome}🦴)`);
    } else {
      embed.setColor('#ff7784')
        .setDescription(`You Spent: ${bet}🦴\nYou made: ${total}🦴 (${balance + outcome}🦴)\n${-outcome}🦴 points added to the bank(${bank + -outcome}🦴)`);
    }
    interaction.reply({ embeds: [embed] });
  }
};