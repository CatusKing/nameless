const { MessageEmbed } = require('discord.js');
const config = require('../general/config.json');
const prefix = config.prefix;
module.exports = {
	name: 'gamble',
	description: 'Allows you to gamble for more points',
	execute(msg, args, reply, log, addUserBalance, getUserBalance) {
    msg.reply('no')
    return;
    if (args[0] == 'help') return reply(msg.channel.id, 'Spend some 🦴 to earn some 🦴\nMinimal gamble amount: 500🦴\nPayout table: (:white_circle:= not 💎 or :skull:)\n💎 💎 💎 - 25x\n💎 💎 :white_circle: - 5x\n:white_circle: :white_circle: :white_circle: - 10x\n:white_circle: :white_circle: ❓ - 2x\n:skull: ❓ ❓ - 0x (cancels any winning)\n❓ ❓ ❓ - 0x', '#9e9d9d');
    const balance = getUserBalance(msg.author.id);
    const bank = getUserBalance('bank');
    var bet = 0;

    if (args[0] == 'all') bet = balance;
    else if (!isNaN(args[0]) && Math.floor(args[0]) >= 500) bet = Math.floor(args[0]);
    else return reply(msg.channel.id, `Hey sorry but you need to use the command like this ${prefix}gamble <all \\|\\| number \\|\\| help>\nMinimal gamble amount is 500🦴`, '#9e9d9d');

    if (bet > balance) return reply(msg.channel.id, `Not enough funds! Your balance is ${balance}🦴 You need at least 500🦴`, '#9e9d9d');
    var slot1 = Math.floor(Math.random() * config.emojis.length);
    var slot2 = Math.floor(Math.random() * config.emojis.length);
    var slot3 = Math.floor(Math.random() * config.emojis.length);
    const diamond = config.emojis.length - 1;
    let total = 0;

    if (slot1 == diamond && slot2 == diamond && slot3 == diamond) total = bet * 25;
    else if (slot1 == diamond && slot2 == diamond || slot1 == diamond && slot3 == diamond || slot2 == diamond && slot3 == diamond) total = bet * 5;
    else if (slot1 == slot2 && slot2 == slot3) total = bet * 10;
    else if (slot1 == slot2 || slot1 == slot3 || slot2 == slot3) total = bet * 2;

    if (slot1 == 0 || slot2 == 0 || slot3 == 0) total = 0;
    let outcome = total - bet;
    addUserBalance(msg.author.id, outcome);
    addUserBalance('bank', -outcome);
    var embed = new MessageEmbed()
      .setTitle(`Slot Machine results: ${config.emojis[slot1]} ${config.emojis[slot2]} ${config.emojis[slot3]}`)
      .setFooter(`Use *${prefix}gamble help* for an explanation on the slot machine`);

    if (total > 0) {
      embed.setColor('#baffc9')
        .setDescription(`You Spent: ${bet}🦴\nYou made: ${total}🦴 (${balance + outcome}🦴)\n${outcome}🦴 points taken from the bank(${bank + -outcome}🦴)`);
      log('830503210951245865', `+${outcome}🦴 to ${msg.author} from gambling ${bet}🦴`, '#baffc9');
    } else {
      embed.setColor('#ff7784')
        .setDescription(`You Spent: ${bet}🦴\nYou Made: ${total}🦴 (${balance + outcome}🦴)\n${-outcome}🦴 points added to the bank(${bank + -outcome}🦴)`);
      log('830503210951245865', `-${-outcome}🦴 to ${msg.author} from gambling ${bet}🦴`, '#ff7784');
    }
    msg.channel.send(embed);
  }
};