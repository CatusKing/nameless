const Discord = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');
const { Users } = require('./dbObjects');
const { Op } = require('sequelize');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const currency = new Discord.Collection();
const prefix = config.prefix;
var status = 0;

function start() {
  Reflect.defineProperty(currency, 'addBalance', {
    value: async function addBalance(id, amount) {
      const user = currency.get(id);
      if (user) {
        user.balance += Number(amount);
        return user.save();
      }
      const newUser = await Users.create({ user_id: id, balance: amount });
      currency.set(id, newUser);
      return newUser;
    },
  });
  
  Reflect.defineProperty(currency, 'setCooldown', {
    value: async function setCooldown(id, amount) {
      const user = currency.get(id);
      if (user) {
        user.cooldown = Number(amount);
        return user.save();
      }
      const newUser = await Users.create({ user_id: id, cooldown: amount });
      currency.set(id, newUser);
      return newUser;
    },
  });

  Reflect.defineProperty(currency, 'setDaily', {
    value: async function setDaily(id, amount) {
      const user = currency.get(id);
      if (user) {
        user.daily = Number(amount);
        return user.save();
      }
      const newUser = await Users.create({ user_id: id, daily: amount });
      currency.set(id, newUser);
      return newUser;
    },
  });

  Reflect.defineProperty(currency, 'setWeekly', {
    value: async function setWeekly(id, amount) {
      const user = currency.get(id);
      if (user) {
        user.weekly = Number(amount);
        return user.save();
      }
      const newUser = await Users.create({ user_id: id, weekly: amount });
      currency.set(id, newUser);
      return newUser;
    },
  });
  
  Reflect.defineProperty(currency, 'getCooldown', {
    value: function getCooldown(id) {
      const user = currency.get(id);
      return user ? user.cooldown : 0;
    },
  });
  
  Reflect.defineProperty(currency, 'getBalance', {
    value: function getBalance(id) {
      const user = currency.get(id);
      return user ? user.balance : 0;
    },
  });

  Reflect.defineProperty(currency, 'getWeekly', {
    value: function getWeekly(id) {
      const user = currency.get(id);
      return user ? user.weekly : 0;
    },
  });

  Reflect.defineProperty(currency, 'getDaily', {
    value: function getDaily(id) {
      const user = currency.get(id);
      return user ? user.daily : 0;
    },
  });
}

start();

function log(channelId = String, content = String, color = String) {
  const channel = client.channels.cache.get(channelId);
  const embed = new Discord.MessageEmbed().setDescription(content).setColor(color);
  channel.send(embed);
}

function reply(channelId = String, content = String, color = String) {
  const channel = client.channels.cache.get(channelId);
  const embed = new Discord.MessageEmbed().setDescription(content).setColor(color);
  channel.send(embed);
}

function round(balance = Number) {
  let bal = balance + '';

  if (bal.length > 3 && bal.length < 7) return `${Math.round(bal / 100) / 10}k`;
  else if (bal.length > 6 && bal.length < 10) return `${Math.round(bal / 10000) / 100}m`;
  else if (bal.length > 9 && bal.length < 13) return `${Math.round(bal / 10000000) / 100}b`;
  else return bal;
}

function updateLeaderboard() {
  client.channels.cache.get('830506017304477726').messages.fetch('830507916812353556')
    .then(message => {
      let description = '';
      currency.sort((a, b) => b.balance - a.balance)
        .filter(user => client.users.cache.has(user.user_id))
        .first(config.leaderboard_count)
        .forEach((user, position) => {
          let balance = round(user.balance);
          description += `\n(${position + 1}) ${balance}🍰 ${(client.users.cache.get(user.user_id))}`
        });
      var embed = new Discord.MessageEmbed().setColor('#ffffba').setDescription(description);
      message.edit(embed);
    })
    .catch(console.error);
}

function hours(milliseconds = Number) {
  return Math.floor(((milliseconds / 1000) / 60) / 60) + 1;
}

var invites = [];

const wait = require('util').promisify(setTimeout);

client.once('ready', async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
  setInterval(() => {
    const guild = client.guilds.cache.get('830495072876494879');
    var description = '';
    guild.channels.cache.forEach(ch => {
      
      if (ch.type == 'voice' && ch.id != '830505700269883412') {
        ch.members.forEach(m => {

          if (!m.voice.deaf) {

            if (m.user.bot) return;
            let amount = 2;

            if (!m.voice.mute) {
              amount += 3;

              if (m.voice.selfVideo) amount += 3;
              else if (m.voice.streaming) amount += 1;
            }
            currency.addBalance(m.id, amount);
            description += `\n+${amount}🍰 to ${m} for sitting in vc`;
          }
        })
      }
    });

    if (description != '') log('830503210951245865', description, '#baffc9');
  }, 60000);
  setInterval(async () => {
    ++status;

    if (status == config.status.length) status = 0;
    let top;
    currency.sort((a, b) => b.balance - a.balance)
      .filter(user => client.users.cache.has(user.user_id))
      .first(1)
      .forEach((user, position) => {
        top = client.users.cache.get(user.user_id).tag;
    });
    let bank = round(await currency.getBalance('bank'));
    client.user.setActivity(config.status[status]
      .replace('%bank%', bank)
      .replace('%prefix%', prefix)
      .replace('%top%', top)
    );
  }, 300000);
  setInterval(updateLeaderboard, 120000);

  setTimeout(() => {
    const guild = client.guilds.cache.get('830495072876494879');
    guild.fetchInvites().then(guildInvites => {
      guildInvites.forEach(invite => {
        let yes = true;
        for(let i = 0; i < invites.length; ++i) {
          if (invites[i][1] == invite.code) yes = false;
        }
        if (yes) invites.push([g.id, invite.code, invite.uses]);
      });
      console.log(guildInvites)
    });
    console.log(invites);
  }, 4000);
  console.log(invites);
  console.log(`Logged in as ${client.user.tag}`);
});

//Non-currency stuff
client.on('message', async msg => {
  //Logs an channels
  const announcementChannel = client.channels.cache.get('830506698908893235');
  const eventChannel = client.channels.cache.get('830506718164287498');

  if (msg.author.bot || msg.webhookID) return;

  //Dm commands
  if (msg.channel.type == 'dm') {
    const guild = client.guilds.cache.get('830495072876494879');
    const member = guild.members.cache.get(msg.author.id);

    if (!member.roles.cache.get('830496065366130709')) return msg.channel.send('Sorry only owners can run core commands!');

    if (msg.content == '!update') {
      client.user.setAvatar(guild.iconURL());
      msg.channel.send('Ran the following updates\nPfP');
    }
  }

  if (msg.channel.type != 'text') return;

  //Points
  const cooldown = currency.getCooldown(msg.author.id);

  if (cooldown < Date.now()) {
    await currency.addBalance(msg.author.id, 5);
    await currency.setCooldown(msg.author.id, Date.now() + 60000);
    log('830503210951245865', `+5🍰 to ${msg.author} for sending a message`, '#baffc9');
  }
  
  if (msg.channel.id == '830503569622827069' && msg.content.includes('!announce!')) {
    if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
    msg.channel.send(`Is this announcement ok? (Respond yes or no)\n${msg.content.replace('!announce!', '')}`)
      .then(async () => {
        const filter = m => m.author.id == msg.author.id;
        msg.channel.awaitMessages(filter, {max: 1, time: 15000, errors: ['time']})
          .then(async collected => {
            
            if (collected.first().content.toLowerCase().includes('yes')) {
              try {
                const webhooks = await announcementChannel.fetchWebhooks();
                const webhook = webhooks.first();
                
                if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                await webhook.send(msg.content.replace('!announce!',''), {
                  username: msg.guild.name,
                  avatarURL: msg.guild.iconURL(),
                  embeds: [],
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
    msg.channel.send(`Is this event ok? (Respond yes or no)\n${msg.content.replace('!event!', '')}`)
      .then(async () => {
        const filter = m => m.author.id == msg.author.id;
        msg.channel.awaitMessages(filter, {max: 1, time: 15000, errors: ['time']})
          .then(async collected => {
            
            if (collected.first().content.toLowerCase().includes('yes')) {
              try {
                const webhooks = await eventChannel.fetchWebhooks();
                const webhook = webhooks.first();
                
                if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                await webhook.send(msg.content.replace('!event!',''), {
                  username: msg.guild.name,
                  avatarURL: msg.guild.iconURL(),
                  embeds: [],
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
  
  //Currency Stuff
  if (!msg.content.startsWith(prefix) || msg.channel.type != 'text') return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'help') {
    let description = '';
    for(let i = 0; i < config.help.length; ++i) {
      description += `\n${prefix}${config.help[i]}`;
    }
    var embed = new Discord.MessageEmbed().setDescription(description).setColor('#ffffba');
    msg.author.send(embed)
      .catch(() => {
        reply(msg.channel.id, description, '#ffffba')
      });
    reply(msg.channel.id, 'You got mail! :mailbox_with_mail:', '#9e9d9d'); 
  } else if (command == 'income') {
    reply(msg.channel.id, `Ok this is a quick explanation on how points are made on this server. As of when the server first started the two ways to make points goes as follows:\n1. You can make +5🍰 points per minute of messaging. This use's a cooldown system that starts a 1 minute cooldown on point gain.\n2. Spending 1 minute in vc will give you +2🍰 points. If you are not muted you will instead get a total of +5🍰 points. If you are not muted and use camera you will get a total +8🍰 points. If you can not use your camera you can instead screenshare while unmuted to get a total of +6🍰 points.\n3. also events may give points :D`, '#ffffba')
  } else if (command == 'balance' || command == 'bal') {
    const target = msg.mentions.users.first() || msg.author;
    return reply(msg.channel.id, `${target.tag} has ${currency.getBalance(target.id)}🍰`, '#ffffba');
  } else if (command == 'gamble' || command == 'g') {

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
  } else if (command == 'bank' || command == 'b') {
    reply(msg.channel.id, `The bank currently has ${await currency.getBalance('bank')}🍰`, '#ffffba');
  } else if (command == 'add') {

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
  } else if (command == 'remove') {
    
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
  } else if (command == 'shop') {
    var description = '';
    for(let i = 0; i < config.shop.length; ++i) description += `\n${config.shop[i][0]}`;
    reply(msg.channel.id, description, '#9e9d9d');
  } else if (command == 'buy') {
    const balance = await currency.getBalance(msg.author.id);
    
    if (!args[0]) return reply(msg.channel.id, `You can use ${prefix}shop to see what you can buy`, '#9e9d9d');

    var bought = false;

    for(let i = 0; i < config.shop.length; ++i) {
      if (args[0].toLowerCase() == config.shop[i][1]) {
        const role = msg.guild.roles.cache.get(config.shop[i][3]);
        
        if (balance < config.shop[i][2]) {
          reply(msg.channel.id, `You don't have enough funds for the ${role} role\nYou need ${config.shop[i][2]}🍰\nYou have ${balance}🍰`, '#9e9d9d');
          bought = true;
          break;
        }
        if (config.shop[i][4] == 0) {
          if (msg.member.roles.cache.has(config.shop[i][3])) return reply(msg.channel.id, `You already have ${role} you dumb`, '#9e9d9d');
          msg.member.roles.add(role);
          currency.addBalance(msg.author.id, -config.shop[i][2]);
          currency.addBalance('bank', config.shop[i][2]);
          log('830503210951245865', `-${config.shop[i][2]}🍰 to ${msg.author} for buying ${role}`, '#ff7784');
          reply(msg.channel.id, `You spent ${config.shop[i][2]}🍰\n${msg.author}, you now have ${role}`, '#ffffba');
          bought = true;
          break;
        } else {
          if (!msg.member.roles.cache.has(config.shop[i][3])) return reply(msg.channel.id, `You don't have ${role} you dumb`, '#9e9d9d');
          msg.member.roles.remove(role);
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
  } else if (command == 'badges') {
    const balance = await currency.getBalance(msg.author.id);
    let description = `Your balance: ${balance}🍰\n(Smallest badge is worth 5k🍰)`;
    for(let i = 0; i < config.badges.length; ++i) {
      const role = msg.guild.roles.cache.get(config.badges[i][1]);

      if (config.badges[i][2] <= balance) {

        if (!msg.member.roles.cache.has(config.badges[i][1])) msg.member.roles.add(role);
        description += `\n✅ ${config.badges[i][0]}`;
      }
    }
    reply(msg.channel.id, description, '#ffffba');
  } else if (command == 'weekly') {
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
      else if (result == 1) `${result} hour`;
      else result = `${result} hours`;
      reply(msg.channel.id, `${msg.author} you have already claimed for this week\nYou can claim again in ${result}`, '#9e9d9d');
    }
  } else if (command == 'daily') {
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
  } else if (command == 'lb') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      updateLeaderboard();
      reply(msg.channel.id, `Updated the leaderboard`, '#ffffba');
    } else reply(msg.channel.id, `You don't have perms for that you dumb`, '#9e9d9d');
  } else {
    reply(msg.channel.id, `You can use ${prefix}help to see the available commands`, '#9e9d9d');
  }
});

//Shows if a message is edited
client.on('messageUpdate', (oldMsg, newMsg) => {

  if (oldMsg.partial) {
    try {
      oldMsg.fetch().then(fullMessage => {
        log('830856984579670086', `${fullMessage.author} just edited a past message\nNew: ${newMsg.content}`, '#9e9d9d');
      });
    } catch (error) {
      console.error(error);
    }
  } else {

    if (newMsg.author.bot || oldMsg.content == newMsg.content) return;

    if (oldMsg.content) log('830856984579670086', `${newMsg.author} just edited a message\nOld: ${oldMsg.content}\nNew: ${newMsg.content}`, '#9e9d9d');
    else log('830856984579670086', `${newMsg.author} just edited a past message\nNew: ${newMsg.content}`, '#9e9d9d');
  }
});

//Updates the cache of invites
client.on('inviteCreate', () => {
  // client.guilds.cache.forEach(g => {
  //   g.fetchInvites().then(guildInvites => {
  //     invites[g.id] = guildInvites;
  //   });
  // });
});
client.on('inviteDelete', () => {
  // client.guilds.cache.forEach(g => {
  //   g.fetchInvites().then(guildInvites => {
  //     invites[g.id] = guildInvites;
  //   });
  // });
});

//Sends welcome message plus who invited them
client.on('guildMemberAdd', member => {
  // member.guild.fetchInvites().then(guildInvites => {
  //   const ei = invites[member.guild.id];
  //   invites[member.guild.id] = guildInvites;
  //   const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
  //   const inviter = client.users.cache.get(invite.inviter.id);
  //   log('832758919059341313', `${member.user}(${member.user.tag}) joined using invite code ${invite.code} from ${inviter}(${inviter.tag}). Invite was used ${invite.uses} times since its creation.`, '#9e9d9d');
  // });
  // client.guilds.cache.forEach(g => {
  //   g.fetchInvites().then(guildInvites => {
  //     invites[g.id] = guildInvites;
  //   });
  // });
  var embed = new Discord.MessageEmbed().setDescription(`${member.user} just joined!`).setThumbnail(member.user.displayAvatarURL()).setColor('#ffffba');
  const channel = client.channels.cache.get('830505212463546408');
  channel.send(embed);
});

client.login(token.main);