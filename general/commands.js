const Discord = require('discord.js');
const config = require('./config.json');
const createBar = require('string-progressbar');
const prefix = config.prefix;

const dmCommands = (client = Discord.Client, msg = Discord.Message) => {
  if (msg.channel.type == 'dm') {
    const guild = client.guilds.cache.get('830495072876494879');
    const member = guild.members.cache.get(msg.author.id);

    if (!member.roles.cache.get('830496065366130709')) return msg.channel.send('Sorry only owners can run core commands!');

    if (msg.content == '!update') {
      client.user.setAvatar(guild.iconURL());
      msg.channel.send('Ran the following updates\nPfP');
    }
  }
};

const announcements = (client = Discord.Client, msg = Discord.Message) => {
  const announcementChannel = client.channels.cache.get('830506698908893235');
  const eventChannel = client.channels.cache.get('830506718164287498');
  if (msg.channel.id == '830503569622827069' && msg.content.includes('!announce!')) {
    if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
    msg.channel.send(`Is this announcement ok? (Respond yes or no)\n${msg.content.replace('!announce!', '')}`)
      .then(async () => {
        const filter = m => m.author.id == msg.author.id;
        msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
          .then(async collected => {

            if (collected.first().content.toLowerCase().includes('yes')) {
              try {
                const webhooks = await announcementChannel.fetchWebhooks();
                const webhook = webhooks.first();

                if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                var embeds = [];
                for (let i of msg.attachments) {
                  embeds.push(new Discord.MessageEmbed().setImage(i[1].url).setColor('#9e9d9d'));
                }
                await webhook.send(msg.content.replace('!announce!', ''), {
                  username: msg.guild.name,
                  avatarURL: msg.guild.iconURL(),
                  embeds: embeds,
                });
              } catch (error) {
                console.warn(error);
              }
            } else {
              msg.channel.send('Announcement canceled!');
            }
          }).catch(() => {
            msg.channel.send('No response :(');
          });
      });
  }
  if (msg.channel.id == '830503569622827069' && msg.content.includes('!event!')) {
    if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
    msg.channel.send(`Is this event ok?\nRespond yes or no\nImage will be included\n\n${msg.content.replace('!event!', '')}`)
      .then(async () => {
        const filter = m => m.author.id == msg.author.id;
        msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
          .then(async collected => {

            if (collected.first().content.toLowerCase().includes('yes')) {
              try {
                const webhooks = await eventChannel.fetchWebhooks();
                const webhook = webhooks.first();

                if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                var embeds = [];
                for (let i of msg.attachments) {
                  embeds.push(new Discord.MessageEmbed().setImage(i[1].url).setColor('#9e9d9d'));
                }
                await webhook.send(msg.content.replace('!event!', ''), {
                  username: msg.guild.name,
                  avatarURL: msg.guild.iconURL(),
                  embeds: embeds,
                });
              } catch (error) {
                console.warn(error);
              }
            } else {
              msg.channel.send('Event canceled!');
            }
          }).catch(() => {
            msg.channel.send('No response :(');
          });
      });
  }
};

const help = (msg = Discord.Message, reply) => {
  let description = '';
  for (let i = 0; i < config.help.length; ++i) {
    description += `\n${prefix}${config.help[i]}`;
  }
  var embed = new Discord.MessageEmbed().setDescription(description).setColor('#ffffba');
  msg.author.send(embed)
    .catch(() => {
      reply(msg.channel.id, description, '#ffffba')
    });
  reply(msg.channel.id, 'You got mail! :mailbox_with_mail:', '#9e9d9d');
};

const income = (reply) => {
  reply(msg.channel.id, `Ok this is a quick explanation on how points are made on this server. As of when the server first started the two ways to make points goes as follows:\n1. You can make +5🍰 points per minute of messaging. This use's a cooldown system that starts a 1 minute cooldown on point gain.\n2. Spending 1 minute in vc will give you +2🍰 points. If you are not muted you will instead get a total of +5🍰 points. If you are not muted and use camera you will get a total +8🍰 points. If you can not use your camera you can instead screenshare while unmuted to get a total of +6🍰 points.\n3. also events may give points :D\n\n**If you put https://discord.gg/Hja2gSnsAu in your status you will get about 1.5x as many points**`, '#ffffba');
};

const balance = (msg = Discord.Message, reply, round, currency = Discord.Collection) => {
  const target = msg.mentions.users.first() || msg.author;
  return reply(msg.channel.id, `${target} has ${round(currency.getBalance(target.id))}🍰(${currency.getBalance(target.id)}🍰)`, '#ffffba');
};

const gamble = async (msg = Discord.Message, args = [], reply, log, currency = Discord.Collection) => {
  if (args[0] == 'help') return reply(msg.channel.id, 'Spend some 🍰 to earn some 🍰\nMinimal gamble amount: 500🍰\nPayout table: (:teddy_bear:= not 💎 / :space_invader:)\n💎 💎 💎 - 25x\n💎 💎 ❓ - 5x\n:teddy_bear: :teddy_bear: :teddy_bear: - 10x\n:teddy_bear: :teddy_bear: ❓ - 2x\n:space_invader: ❓ ❓ - 0x (cancels any winning)\n❓ ❓ ❓ - 0x', '#9e9d9d');
  const balance = await currency.getBalance(msg.author.id);
  const bank = await currency.getBalance('bank');
  var bet = 0;

  if (args[0] == 'all') bet = balance;
  else if (!isNaN(args[0]) && Math.floor(args[0]) >= 500) bet = Math.floor(args[0]);
  else return reply(msg.channel.id, `Hey sorry but you need to use the command like this ${prefix}gamble <all \\|\\| number \\|\\| help>\nMinimal gamble amount is 500🍰`, '#9e9d9d');

  if (bet > balance || bet < 500) return reply(msg.channel.id, `Not enough funds! Your balance is ${balance}🍰 You need at least 500🍰`, '#9e9d9d');
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
  await currency.addBalance(msg.author.id, outcome);
  await currency.addBalance('bank', -outcome);
  var embed = new Discord.MessageEmbed()
    .setTitle(`Slot Machine results: ${config.emojis[slot1]} ${config.emojis[slot2]} ${config.emojis[slot3]}`)
    .setFooter(`Use *${prefix}gamble help* for an explanation on the slot machine`);

  if (total > 0) {
    embed.setColor('#baffc9')
      .setDescription(`You Spent: ${bet}🍰\nYou made: ${total}🍰 (${balance + outcome}🍰)\n${outcome}🍰 points taken from the bank(${bank + -outcome}🍰)`);
    log('830503210951245865', `+${outcome}🍰 to ${msg.author} from gambling ${bet}🍰`, '#baffc9');
  } else {
    embed.setColor('#ff7784')
      .setDescription(`You Spent: ${bet}🍰\nYou Made: ${total}🍰 (${balance + outcome}🍰)\n${-outcome}🍰 points added to the bank(${bank + -outcome}🍰)`);
    log('830503210951245865', `-${-outcome}🍰 to ${msg.author} from gambling ${bet}🍰`, '#ff7784');
  }
  msg.channel.send(embed);
};

const bank = async (msg = Discord.Message, reply, currency = Discord.Collection) => {
  reply(msg.channel.id, `The bank currently has ${await currency.getBalance('bank')}🍰`, '#ffffba');
};

const add = (msg = Discord.Message, args = [], reply, log, currency = Discord.Collection) => {
  if (msg.member.roles.cache.has('830496065366130709')) {
    const target = msg.mentions.users.first() || msg.author;

    if (isNaN(args[0])) return reply(msg.channel.id, `Sorry you need to use the command like this ${prefix}add <amount> [@User]`, '#9e9d9d');
    const amount = Math.floor(args[0]);
    const balance = currency.getBalance(target.id);
    currency.addBalance(target.id, amount);
    currency.addBalance('bank', -amount);
    reply(msg.channel.id, `Given ${amount}🍰 to ${target}\nThey now have ${balance + amount}🍰`, '#baffc9');
    log('830503210951245865', `+${amount}🍰 to ${target} given by ${msg.author}`, '#baffc9');
  } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
};

const remove = (msg = Discord.Message, args = [], reply, log, currency = Discord.Collection) => {
  if (msg.member.roles.cache.has('830496065366130709')) {
    const target = msg.mentions.users.first() || msg.author;

    if (isNaN(args[0])) return reply(msg.channel.id, `Sorry you need to use the command like this ${prefix}remove <amount> [@User]`, '#9e9d9d');
    const amount = Math.floor(args[0]);
    const balance = currency.getBalance(target.id);
    currency.addBalance(target.id, -amount);
    currency.addBalance('bank', amount);
    reply(msg.channel.id, `Taken ${amount}🍰 from ${target}\nThey now have ${balance - amount}🍰`, '#ff7784');
    log('830503210951245865', `-${amount}🍰 to ${target} taken by ${msg.author}`, '#ff7784');
  } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
};

const shop = (msg = Discord.Message, reply) => {
  var description = '';
  for (let i = 0; i < config.shop.length; ++i) description += `\n${config.shop[i][0]}`;
  reply(msg.channel.id, description, '#9e9d9d');
};

const buy = async (msg = Discord.Message, args = [], reply, log, currency = Discord.Collection) => {
  const balance = await currency.getBalance(msg.author.id);

  if (!args[0]) return reply(msg.channel.id, `You can use ${prefix}shop to see what you can buy`, '#9e9d9d');

  var bought = false;

  for (let i = 0; i < config.shop.length; ++i) {
    if (args[0].toLowerCase() == config.shop[i][1]) {
      const role = msg.guild.roles.cache.get(config.shop[i][3]);

      if (balance < config.shop[i][2]) {
        reply(msg.channel.id, `You don't have enough funds for the ${role} role\nYou need ${config.shop[i][2]}🍰\nYou have ${balance}🍰`, '#9e9d9d');
        bought = true;
        break;
      }
      if (config.shop[i][4] == 0) {
        if (msg.member.roles.cache.has(config.shop[i][3])) return reply(msg.channel.id, `You already have ${role} you dumb`, '#9e9d9d');
        msg.member.roles.add(role, `Bought ${role.name}`);
        currency.addBalance(msg.author.id, -config.shop[i][2]);
        currency.addBalance('bank', config.shop[i][2]);
        log('830503210951245865', `-${config.shop[i][2]}🍰 to ${msg.author} for buying ${role}`, '#ff7784');
        reply(msg.channel.id, `You spent ${config.shop[i][2]}🍰\n${msg.author}, you now have ${role}`, '#ffffba');
        bought = true;
        break;
      } else {
        if (!msg.member.roles.cache.has(config.shop[i][3])) return reply(msg.channel.id, `You don't have ${role} you dumb`, '#9e9d9d');
        msg.member.roles.remove(role, `Paid to remove ${role.name}`);
        currency.addBalance(msg.author.id, -config.shop[i][2]);
        currency.addBalance('bank', config.shop[i][2]);
        log('830503210951245865', `-${config.shop[i][2]}🍰 to ${msg.author} for removing ${role}`, '#ff7784');
        reply(msg.channel.id, `You spent ${config.shop[i][2]}🍰\n${msg.author}, you now have removed ${role}`, '#ffffba');
        bought = true;
        break;
      }
    }
  }
  if (!bought) reply(msg.channel.id, `You need to enter a valid item\nThey can be found using ${prefix}shop`, '#9e9d9d');
};

const badges = async (msg = Discord.Message, reply, round, currency = Discord.Collection) => {
  const balance = await currency.getBalance(msg.author.id);
  let description = `Your balance: ${round(balance)}🍰`;
  for (let i = 0; i < config.badges.length; ++i) {
    const role = msg.guild.roles.cache.get(config.badges[i][1]);

    if (config.badges[i][2] <= balance) {

      if (!msg.member.roles.cache.has(config.badges[i][1])) msg.member.roles.add(role, `Added badge ${role.name}`);
      description += `\n✅ ${config.badges[i][0]}`;
    } else {
      if (i == 0) description += `\n❌ ${config.badges[i][0]}\n0k🍰**<**${createBar(config.badges[i][2], balance, 25, '▬', '🎂')[0]}**>**${config.badges[i][2] / 1000}k🍰`;
      else description += `\n❌ ${config.badges[i][0]}\n${config.badges[i - 1][2] / 1000}k🍰**<**${createBar(config.badges[i][2] - config.badges[i - 1][2], balance - config.badges[i - 1][2], 25, '▬', '🎂')[0]}**>**${config.badges[i][2] / 1000}k🍰`;
      break;
    }
  }
  reply(msg.channel.id, description, '#ffffba');
};

const weekly = async (msg = Discord.Message, reply, log, currency = Discord.Collection, hours) => {
  const weekly = await currency.getWeekly(msg.author.id);

  if (weekly <= hours(Date.now())) {
    await currency.addBalance(msg.author.id, 2000);
    currency.addBalance('bank', -2000);
    currency.setWeekly(msg.author.id, hours(Date.now()) + 167);
    reply(msg.channel.id, `${msg.author} just claimed 2k🍰 for the week`, '#baffc9');
    log('830503210951245865', `+2000🍰 to ${msg.author} for their weekly claim`, '#baffc9');
  } else {
    let result = weekly - hours(Date.now());

    if (result > 24) result = `${Math.floor(result / 24) + 1} days`;
    else if (result == 1) result = `${result} hour`;
    else result = `${result} hours`;
    reply(msg.channel.id, `${msg.author} you have already claimed for this week\nYou can claim again in ${result}`, '#9e9d9d');
  }
};

const daily = async (msg = Discord.Message, reply, log, currency = Discord.Collection) => {
  var date = new Date();

  if (await currency.getDaily(msg.author.id) != date.getDate()) {
    currency.addBalance(msg.author.id, 200);
    currency.addBalance('bank', -200);
    currency.setDaily(msg.author.id, date.getDate());
    reply(msg.channel.id, `${msg.author} just claimed 200🍰 for the day`, '#baffc9');
    log('830503210951245865', `+200🍰 to ${msg.author} for their daily claim`, '#baffc9');
  } else {
    let result = 24 - date.getHours();

    if (result == 1) result = `${result} hour`;
    else result = `${result} hours`;
    reply(msg.channel.id, `${msg.author} you have already claimed for the day\nYou can claim again in ${result}`, '#9e9d9d');
  }
};

const lb = (msg = Discord.Message, reply, updateLeaderboard) => {
  if (msg.member.roles.cache.has('830496065366130709')) {
    updateLeaderboard();
    reply(msg.channel.id, `Updated the leaderboard`, '#ffffba');
  } else reply(msg.channel.id, `You don't have perms for that you dumb`, '#9e9d9d');
};

const ping = (client = Discord.Client, msg = Discord.Message, reply) => {
  msg.channel.send('Pinging...').then((message) => {
    const ping = new Discord.MessageEmbed()
      .setColor('#9e9d9d')
      .setTitle('Pong!')
      .setDescription(`Roundtrip latency is ${Math.floor(message.createdTimestamp - msg.createdTimestamp)}ms \nAPI Latency is ${Math.round(client.ws.ping)}ms`);
    message.edit(ping);
    message.edit("\u200B");
  });
}

const mute = async (client = Discord.Client, msg = Discord.Message, reply, currency = Discord.Collection) => {
  if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759') || msg.member.roles.cache.has('830495908336369694')) {
    const target = msg.mentions.members.first() || msg.member;
    const muted = await currency.getMuted(target.id);
    if (muted == 0) {
      const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
      target.roles.add(role, `Muted by ${msg.author}`);
      currency.setMuted(target.id, 1);
      reply(msg.channel.id, `Muted ${target}\nAction by ${msg.author}`, '#9e9d9d');
    } else reply(msg.channel.id, 'This user is already muted', '#9e9d9d');
  } else {
    reply(msg.channel.id, `You don't have perms for this`, `#9e9d9d`);
  }
};

const unmute = async (client = Discord.Client, msg = Discord.Message, reply, currency = Discord.Collection) => {
  if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759') || msg.member.roles.cache.has('830495908336369694')) {
    const target = msg.mentions.members.first() || msg.member;
    const muted = await currency.getMuted(target.id);
    if (muted == 1) {
      const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
      target.roles.remove(role, `Muted removed by ${msg.author}`);
      currency.setMuted(target.id, 0);
      reply(msg.channel.id, `Unmuted ${target}\nAction by ${msg.author}`, '#9e9d9d');
    } else reply(msg.channel.id, 'This user isn\'t muted', '#9e9d9d');
  } else {
    reply(msg.channel.id, `You don't have perms for this`, `#9e9d9d`);
  }
};

exports.dmCommands = dmCommands;
exports.announcements = announcements;
exports.help = help;
exports.income = income;
exports.balance = balance;
exports.gamble = gamble;
exports.bank = bank;
exports.add = add;
exports.remove = remove;
exports.shop = shop;
exports.buy = buy;
exports.badges = badges;
exports.weekly = weekly;
exports.daily = daily;
exports.lb = lb;
exports.ping = ping;
exports.mute = mute;
exports.unmute = unmute;