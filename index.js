const Discord = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');
const { Users } = require('./dbObjects');
const { Op } = require('sequelize');
const {google} = require('googleapis');
const commands = require('./general/commands');
const data = require('./general/data.json');
const fs = require('fs');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const currency = new Discord.Collection();
const prefix = config.prefix;
var status = 0;
var invites = [];
const attributes = ["SEVERE_TOXICITY", "IDENTITY_ATTACK", "THREAT", "SEXUALLY_EXPLICIT"];
const analyzeRequest = {
  comment: {
    text: '',
  },
  requestedAttributes: {
    SEVERE_TOXICITY: {},
    IDENTITY_ATTACK: {},
    THREAT: {},
    SEXUALLY_EXPLICIT: {},
  },
};
const tempData = {
  ignoredCh: data.ignoredCh,
  admins: data.admins,
}

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

function updateMemberCount() {
  const playersCh = client.channels.cache.get('834038553632702505');
  const guild = client.guilds.cache.get('830495072876494879');
  if (playersCh.name != `「Players」⇢ ${guild.memberCount}`) {
    playersCh.setName(`「Players」⇢ ${guild.memberCount}`);
    return true;
  }
  return false;
}

function updateInvites() {
  const guild = client.guilds.cache.get('830495072876494879');
  guild.fetchInvites().then(guildInvites => {
    guildInvites.forEach(invite => {
      let yes = true;
      for(let i = 0; i < invites.length; ++i) {
        if (invites[i][0] == invite.code) yes = false;
      }
      if (yes) invites.push([invite.code, invite.uses, invite.inviter.id]);
    });
  });
}

function findInvite(code = String) {
  for(let i = 0; i < invites.length; ++i) {
    if (invites[i][0] == code) return i;
  }
  return -1;
}

async function get_attrs (text) {
  const app = await google.discoverAPI(config.url);
  analyzeRequest.comment.text = text;
  const response = await app.comments.analyze({ key: token.apiKey, resource: analyzeRequest });
  const attrs = {};
  for (let attr of attributes) {
    const prediction = response.data["attributeScores"][attr]["summaryScore"]["value"];
    attrs[attr] = prediction;
  }
  return attrs;
};

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
    updateInvites();
  }, 4000);

  setInterval(updateMemberCount, 900000);
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async msg => {
  if (msg.author.bot || msg.webhookID || msg.channel.type != 'text' || msg.content.toLowerCase().startsWith(prefix)) return;

  //Hate Speech detection
  try {
    const characters = msg.content.split('');
    var letters = false;
    for(let i of characters) {
      if (config.abc.includes(i.toLowerCase())) {
        letters = true;
        break;
      }
    }
    if (letters && !tempData.ignoredCh.includes(msg.channel.id) && !tempData.admins.includes(msg.author.id)) {
      var warn = 0;
      var reason = [];
      const scores = await get_attrs(msg.content)
      for(let i of attributes) {
        if (scores[i] >= 0.75) {
          ++warn;
          reason.push(i);
        }
      }
      if (warn == 1 && scores[reason[0]] > 0.90) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        msg.member.roles.add(role);
        reply(msg.channel.id, `You have been **muted** for the following reason:\n${reason[0].toLowerCase()}: ${scores[reason[0]]}\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
        log('834179033289719839', `**Muted**\n\nReason:\n${reason[0].toLowerCase()}: ${scores[reason[0]]}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
      } else if (warn == 1) {
        reply(msg.channel.id, `This is a warning. You have been flagged for the following reason:\n${reason[0].toLowerCase()}: ${scores[reason[0]]}\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#9e9d9d');
        log('834179033289719839', `Warned\n\nReason:\n${reason[0].toLowerCase()}: ${scores[reason[0]]}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
      } else if (warn > 1) {
        var description = '';
        for(let i of reason) {
          description += `${i.toLowerCase()}: ${scores[i]}\n`;
        }
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        msg.member.roles.add(role);
        reply(msg.channel.id, `You have been **muted** for the following reasons:\n${description}\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
        log('834179033289719839', `**Muted**\n\nReasons:\n${description}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
      }
    }
  } catch (error) { }
});

client.on('message', async msg => {

  if (msg.author.bot || msg.webhookID) return;

  //Dm commands
  commands.dmCommands(client, msg);

  if (msg.channel.type != 'text') return;

  //Points
  const cooldown = currency.getCooldown(msg.author.id);

  if (cooldown < Date.now()) {
    await currency.addBalance(msg.author.id, 5);
    await currency.setCooldown(msg.author.id, Date.now() + 60000);
    log('830503210951245865', `+5🍰 to ${msg.author} for sending a message`, '#baffc9');
  }
  
  commands.announcements(client, msg);
  
  //Currency Stuff
  if (!msg.content.toLowerCase().startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'help') {
    commands.help(msg, reply);
  } else if (command == 'income') {
    commands.income(reply);
  } else if (['balance', 'bal'].includes(command)) {
    commands.balance(msg, reply, currency);
  } else if (['gamble', 'g'].includes(command)) {
    commands.gamble(msg, args, reply, log, currency);
  } else if (['bank', 'b'].includes(command)) {
    commands.bank(msg, reply, currency);
  } else if (command == 'add') {
    commands.add(msg, args, reply, log, currency);
  } else if (command == 'remove') {
    commands.remove(msg, args, reply, log, currency);
  } else if (command == 'shop') {
    commands.shop(msg, reply);
  } else if (command == 'buy') {
    commands.buy(msg, args, reply, log, currency);
  } else if (command == 'badges') {
    commands.badges(msg, reply, currency);
  } else if (command == 'weekly') {
    commands.weekly(msg, reply, log, currency, hours);
  } else if (command == 'daily') {
    commands.daily(msg, reply, log, currency);
  } else if (command == 'lb') {
    commands.lb(msg, reply, updateLeaderboard);
  } else if (command == 'ping') {
    commands.ping(client, msg, reply);
  } else if (command == 'admin') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      if (tempData.admins.includes(msg.author.id)) {
        for(var i = 0; i < tempData.admins.length; i++) {
  
          if (tempData.admins[i] == msg.author.id) {
            tempData.admins.splice(i, 1);
            reply(msg.channel.id, `No longer ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
            break;
          }
        }
      } else {
        tempData.admins.push(msg.author.id);
        reply(msg.channel.id, `Ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
      }
      let json = JSON.stringify(tempData);
      fs.writeFileSync('general/data.json', json);
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  } else if (command == 'admins') {
    var description = 'Admins\n';
    for(let i of tempData.admins) {
      description += `${client.users.cache.get(i).tag} - ${i}\n`
    }
    reply(msg.channel.id, description, '#9e9d9d');
  } else if (command == 'ignore') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      if (tempData.ignoredCh.includes(msg.channel.id)) {
        for(var i = 0; i < tempData.ignoredCh.length; i++) {
  
          if (tempData.ignoredCh[i] == msg.channel.id) {
            tempData.ignoredCh.splice(i, 1);
            reply(msg.channel.id, `No longer ignoring this channel\nid: ${msg.channel.id}`, '#9e9d9d');
            break;
          }
        }
      } else {
        tempData.ignoredCh.push(msg.channel.id);
        reply(msg.channel.id, `Ignoring this channel from auto mod\nid: ${msg.channel.id}`, '#9e9d9d');
      }
      let json = JSON.stringify(tempData);
      fs.writeFileSync('general/data.json', json);
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  } else if (command == 'ignores') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      var description = 'Ignored channels\n';
      for(let i of tempData.ignoredCh) {
        description += `${client.channels.cache.get(i).name} - ${i}\n`
      }
      reply(msg.channel.id, description, '#9e9d9d');
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
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
  updateInvites();
});
client.on('inviteDelete', () => {
  updateInvites();
});

//Sends welcome message plus who invited them
client.on('guildMemberAdd', member => {
  member.guild.fetchInvites().then(guildInvites => {
    guildInvites.forEach(invite => {
      let j = findInvite(invite.code);
      if (j == -1) return;
      if (invite.uses > invites[j][1]) {
        const inviter = client.users.cache.get(invites[j][2]);
        log('832758919059341313', `${member.user}(${member.user.tag}) joined using invite code ${invite.code} from ${inviter}(${inviter.tag}). Invite was used ${invite.uses} times since its creation.`, '#9e9d9d');
      }
    });
  });
  var embed = new Discord.MessageEmbed().setDescription(`${member.user} just joined!`).setThumbnail(member.user.displayAvatarURL()).setColor('#ffffba');
  const channel = client.channels.cache.get('830505212463546408');
  channel.send(embed);
});

client.on('error', error => {
  const cactus = client.users.cache.get('473110112844644372')
  cactus.send(`${cactus} hey error:\n${error}`);
});

client.login(token.main);