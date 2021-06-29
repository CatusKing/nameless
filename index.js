const { Client, Collection, MessageEmbed } = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');
const db = require('quick.db');
const { google } = require('googleapis');
const fs = require('fs');

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], ws: { properties: { $browser: "Discord iOS" } } });
const prefix = config.prefix;
var status = 0;
var invites = [];
const attributes = ["SEVERE_TOXICITY", "IDENTITY_ATTACK", "THREAT", "SEXUALLY_EXPLICIT"];
const analyzeRequest = { comment: { text: '' }, requestedAttributes: { SEVERE_TOXICITY: {}, IDENTITY_ATTACK: {}, THREAT: {}, SEXUALLY_EXPLICIT: {} } };

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

const log = (channelId = String, content = String, color = String) => {
  const channel = client.channels.cache.get(channelId);
  const embed = new MessageEmbed().setDescription(content).setColor(color);
  channel.send(embed);
};

const reply = (channelId = String, content = String, color = String) => {
  const channel = client.channels.cache.get(channelId);
  const embed = new MessageEmbed().setDescription(content).setColor(color);
  channel.startTyping();
  setTimeout(() => {
    channel.send(embed);
    channel.stopTyping();
  }, 500);
};

const round = (balance = Number) => {
  let bal = balance + '';

  if (bal.length > 3 && bal.length < 7) return `${Math.round(bal / 100) / 10}k`;
  else if (bal.length > 6 && bal.length < 10) return `${Math.round(bal / 10000) / 100}m`;
  else if (bal.length > 9 && bal.length < 13) return `${Math.round(bal / 10000000) / 100}b`;
  else return bal;
};

const floor = (balance = Number) => {
  let bal = balance + '';

  if (bal.length > 3 && bal.length < 7) return `${Math.floor(bal / 100) / 10}k`;
  else if (bal.length > 6 && bal.length < 10) return `${Math.floor(bal / 10000) / 100}m`;
  else if (bal.length > 9 && bal.length < 13) return `${Math.floor(bal / 10000000) / 100}b`;
  else return bal;
};

const updateLeaderboard = () => {
  const guildMembers = client.guilds.cache.get('830495072876494879').members.cache;
  const lb = db.get(`discord.server.leaderboard`) || [];
  const leaderboard = new Collection();
  for (let i = 0; i < lb.length; ++i) {
    if (guildMembers.has(lb[i][0])) {
      leaderboard.set(lb[i][0], lb[i][1]);
    }
  }
  client.channels.cache.get('830506017304477726').messages.fetch('830507916812353556')
    .then(message => {
      let description = '```';
      let num = 1;
      leaderboard.sort((a, b) => b - a)
        .filter((value, key) => client.users.cache.has(key))
        .forEach((value, key) => {
          if (num <= config.leaderboard_count) {
            description += `\n< ${num} > ${round(value)}🦴 ${client.users.cache.get(key).tag}`;
          }
          ++num;
        });
      description += '```';
      var embed = new MessageEmbed().setColor('#ffffba').setDescription(description);
      message.edit(embed);
    });
};

const hours = (milliseconds = Number) => {
  return Math.floor(((milliseconds / 1000) / 60) / 60) + 1;
};

const updateMemberCount = () => {
  const playersCh = client.channels.cache.get('834038553632702505');
  const guild = client.guilds.cache.get('830495072876494879');
  if (playersCh.name != `「Players」⇢ ${guild.memberCount}`) {
    playersCh.setName(`「Players」⇢ ${guild.memberCount}`, `They're now ${guild.memberCount} members in the guild`);
    return true;
  }
  return false;
};

const updateInvites = () => {
  const guild = client.guilds.cache.get('830495072876494879');
  guild.fetchInvites().then(guildInvites => {
    guildInvites.forEach(invite => {
      let yes = true;
      for (let i = 0; i < invites.length; ++i) {
        if (invites[i][0] == invite.code) yes = false;
      }
      if (yes) invites.push([invite.code, invite.uses, invite.inviter.id]);
    });
  });
};

const findInvite = (code = String) => {
  for (let i = 0; i < invites.length; ++i) {
    if (invites[i][0] == code) return i;
  }
  return -1;
};

const get_attrs = async (text) => {
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

const checkCh = () => {
  const videoOnlyCh = client.channels.cache.get('831347288710316032');
  const generalCh = client.channels.cache.get('830495073430929472');
  videoOnlyCh.members.forEach(m => {
    if (!m.voice.selfVideo && !m.user.bot) {
      m.voice.setChannel(generalCh, 'Video not enabled in the video only channel');
    }
  });
  client.guilds.cache.get('830495072876494879').members.cache.forEach((member) => {
    if (member.voice.channel != null) {
      if (!member.roles.cache.has('859270541713211422')) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('859270541713211422');
        member.roles.add(role);
      }
    } else if (member.roles.cache.has('859270541713211422')) {
      const role = client.guilds.cache.get('830495072876494879').roles.cache.get('859270541713211422');
      member.roles.remove(role);
    }
  });
};

const updateStatus = async () => {
  ++status;

  if (status == config.status.length) status = 0;
  const lb = db.get(`discord.server.leaderboard`) || [];
  const guildMembers = client.guilds.cache.get('830495072876494879').members.cache;
  const leaderboard = new Collection();
  for (let i = 0; i < lb.length; ++i) {
    if (guildMembers.has(lb[i][0])) {
      leaderboard.set(lb[i][0], lb[i][1]);
    }
  }
  let num = 1;
  let top;
  leaderboard.sort((a, b) => b - a)
    .filter((value, key) => client.users.cache.has(key))
    .forEach((value, key) => {
      if (num == 1) top = client.users.cache.get(key).tag;
      ++num;
    });
  let bank = round(getUserBalance('bank'));
  client.user.setActivity(config.status[status]
    .replace('%bank%', bank)
    .replace('%prefix%', prefix)
    .replace('%top%', top)
  );
};

const givePoints = () => {
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
          for (let i of m.presence.activities) {
            if (i.type == 'CUSTOM_STATUS' && i.state.includes('https://discord.gg/Hja2gSnsAu')) {
              amount = Math.floor(amount * 1.5);
              break;
            }
          }
          addUserBalance(m.id, amount);
          description += `\n+${amount}🦴 to ${m} for sitting in vc`;
        }
      });
    }
  });
  
  if (description != '') log('830503210951245865', description, '#baffc9');
};

const checkMuted = () => {
  const users = db.get(`discord.users`) || {};
  client.guilds.cache.get('830495072876494879').members.cache.forEach((member, id) => {
    if (users[id] != null) {
      const muted = users[id].muted || 0;
      if (muted > 0 || muted == -1) {
        if (!member.roles.cache.has('830495536582361128')) {
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          member.roles.add(role, `${member.user.username} is still muted`);
        }
        if (muted != -1) users[id].muted = muted - 1;
      } else if (muted == 0) {
        if (member.roles.cache.has('830495536582361128')) {
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          member.roles.remove(role, `${member.user.username} is not muted`);
        }
      }
    }
  });
  db.set(`discord.users`, users);
};

const checkBanned = () => {
  const users = db.get(`discord.server.banned`) || [];
  for(let i = 0; i < users.length; i++) {
    const banned = users[i][1];
      if (banned > 0 || banned == -1) {
        if (client.guilds.cache.get('830495072876494879').members.cache.has(users[i][0])) {
          const member = client.guilds.cache.get('830495072876494879').members.cache.get(users[i][0]);
          member.ban({reason: `Temp banned`, days: 1});
        }
        if (banned != -1) users[i][1] = banned - 1;
      } else if (banned == 0) {
        client.guilds.cache.get('830495072876494879').fetchBans().then(bannedMembers => {
          const banned = bannedMembers.find(user => user.user.id == users[i][0]);
          if (banned) client.guilds.cache.get('830495072876494879').members.unban(banned.user, 'Temp ban over')
        });
      }
  }
  db.set(`discord.server.banned`, users);
};

const getUserBalance = (id = '') => {
  const user = db.get(`discord.users.${id}`) || {};
  return user.balance || 0;
};

const addUserBalance = (id = '', num = 0) => {
  const user = db.get(`discord.users.${id}`) || {};
  const lb = db.get(`discord.server.leaderboard`) || [];
  Number(user.balance);
  user.balance = user.balance + num;
  let included = false;
  for (let i = 0; i < lb.length; ++i) {
    if (lb[i][0] == id) {
      lb[i][1] = user.balance;
      included = true;
      break;
    }
  }
  if (!included) lb.push([id, user.balance]);
  db.set(`discord.server.leaderboard`, lb);
  db.set(`discord.users.${id}`, user);
  return user.balance;
};

const getUserWeekly = (id = '') => {
  const user = db.get(`discord.users.${id}`) || {};
  return user.weekly || 0;
};

const setUserWeekly = (id = '', num = 0) => {
  const user = db.get(`discord.users.${id}`) || {};
  user.weekly = num;
  db.set(`discord.users.${id}`, user);
  return user.weekly;
};

const getUserDaily = (id = '') => {
  const user = db.get(`discord.users.${id}`) || {};
  return user.daily || 0;
};

const setUserDaily = (id = '', num = 0) => {
  const user = db.get(`discord.users.${id}`) || {};
  user.daily = num;
  db.set(`discord.users.${id}`, user);
  return user.daily;
};

const getUserMuted = (id = '') => {
  const user = db.get(`discord.users.${id}`) || {};
  return user.muted || 0;
};

const setUserMuted = (id = '', num = 0) => {
  const user = db.get(`discord.users.${id}`) || {};
  user.muted = num;
  db.set(`discord.users.${id}`, user);
  return user.muted;
};

const getServerAdmins = () => {
  return db.get(`discord.server.admins`) || [];
};

const setServerAdmins = (admins = []) => {
  db.set(`discord.server.admins`, admins);
};

const getServerIgnoredCh = () => {
  return db.get(`discord.server.ignoredCh`) || [];
};

const setServerIgnoredCh = (ignoredCh = []) => {
  db.set(`discord.server.ignoredCh`, ignoredCh);
};

const getUserCooldown = (id = '') => {
  const user = db.get(`discord.users.${id}`) || {};
  return user.cooldown || 0;
};

const setUserCooldown = (id = '', num = 0) => {
  const user = db.get(`discord.users.${id}`) || {};
  user.cooldown = num;
  db.set(`discord.users.${id}`, user);
  return user.cooldown;
};

const setUserBanned = (id = '', num = 0) => {
  const bans = db.get(`discord.server.banned`) || [];
  let contains = false;
  for(let i = 0; i < bans.length; ++i) {
    if (bans[i][0] == id) {
      bans[i][1] = num;
      contains = true;
      break;
    }
  }
  if (!contains) bans.push([Number(id), num]);
  db.set(`discord.server.banned`, bans);
  return;
};

var admins = getServerAdmins();
var ignoredCh = getServerIgnoredCh();

const punish = async (msg) => {
  const cactus = client.users.cache.get('473110112844644372');
  try {
    const characters = msg.content.split('');
    var letters = false;
    for (let i of characters) {
      if (config.abc.includes(i.toLowerCase())) {
        letters = true;
        break;
      }
    }
    if (letters && !ignoredCh.includes(msg.channel.id) && !admins.includes(msg.author.id)) {
      var warn = 0;
      var reason = [];
      const scores = await get_attrs(msg.content)
      for (let i of attributes) {
        if (scores[i] >= 0.75) {
          ++warn;
          reason.push(i);
        }
      }
      const author = msg.author;
      if (warn == 1 && scores[reason[0]] > 0.90) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        msg.member.roles.add(role, `Muted for getting 1 warning over .90`);
        setUserMuted(msg.author.id, -1);
        reply(msg.channel.id, `${msg.author}, you have been **muted** for the following reason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
        log('834179033289719839', `**Muted**\n\nReason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
        return true;
      } else if (warn == 1) {
        reply(msg.channel.id, `${msg.author}, this is a warning. You have been flagged for the following reason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#9e9d9d');
        log('834179033289719839', `Warned\n\nReason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
        return true;
      } else if (warn > 1) {
        var description = '';
        for (let i of reason) {
          description += `**${i.toLowerCase()}**: ${scores[i]}\n`;
        }
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        msg.member.roles.add(role, `Muted for getting 2 or more warnings`);
        setUserMuted(msg.author.id, -1);
        reply(msg.channel.id, `${msg.author}, you have been **muted** for the following reasons:\n${description}\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
        log('834179033289719839', `**Muted**\n\nReasons:\n${description}\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
        return true;
      }
    } else return false;
  } catch (error) { }
};

client.once('ready', async () => {
  setInterval(givePoints, 60000);

  setInterval(updateStatus, 300000);

  setInterval(updateLeaderboard, 120000);

  setTimeout(updateInvites, 4000);

  setInterval(updateMemberCount, 900000);

  setInterval(checkCh, 15000);

  setInterval(checkMuted, 30000);

  setInterval(checkBanned, 30000);

  console.log(`Logged in as ${client.user.tag}`);
});

//Currency and commands
client.on('message', async msg => {

  if (msg.author.bot || msg.webhookID) return;

  // //Dm commands
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

  // //Hate Speech
  punish(msg);

  // //Points
  const cooldown = getUserCooldown(msg.author.id);
  if (cooldown < Date.now()) {
    let amount = 5;
    for (let i of msg.author.presence.activities) {
      if (i.type == 'CUSTOM_STATUS' && i.state != null && i.state.includes('https://discord.gg/Hja2gSnsAu')) {
        amount = Math.floor(amount * 1.5);
        break;
      }
    }
    addUserBalance(msg.author.id, amount);
    setUserCooldown(msg.author.id, Date.now() + 60000);
    log('830503210951245865', `+${amount}🦴 to ${msg.author} for sending a message`, '#baffc9');
  }

  //Announcements commands
  try {
    client.commands.get('announcements').execute(client, msg);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }

  //Currency Stuff
  if (!msg.content.toLowerCase().startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'help') {
    try {
      client.commands.get(command).execute(msg, reply);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (command == 'income') {
    try {
      client.commands.get(command).execute(msg, reply);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (['balance', 'bal'].includes(command)) {
    try {
      client.commands.get('balance').execute(msg, reply, getUserBalance, floor);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (['gamble', 'g'].includes(command)) {
    try {
      client.commands.get('gamble').execute(msg, args, reply, log, addUserBalance, getUserBalance);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (['bank', 'b'].includes(command)) {
    try {
      client.commands.get('bank').execute(msg, reply, floor, getUserBalance);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (command == 'add') {
    try {
      client.commands.get(command).execute(msg, args, reply, log, addUserBalance);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (command == 'remove') {
    try {
      client.commands.get(command).execute(msg, args, reply, log, addUserBalance);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (command == 'shop') {
    try {
      client.commands.get(command).execute(msg, reply);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    };
  } else if (command == 'buy') {
    try {
      client.commands.get(command).execute(msg, args, reply, log, getUserBalance, addUserBalance);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'weekly') {
    try {
      client.commands.get(command).execute(msg, reply, log, hours, getUserWeekly, setUserWeekly, addUserBalance);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'daily') {
    try {
      client.commands.get(command).execute(msg, reply, log, getUserDaily, setUserDaily, addUserBalance);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (['leaderboard', 'lb'].includes(command)) {
    try {
      client.commands.get('leaderboard').execute(msg, reply, updateLeaderboard);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'ping') {
    try {
      client.commands.get(command).execute(client, msg);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'mute') {
    try {
      client.commands.get(command).execute(client, msg, args, reply, getUserMuted, setUserMuted);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'unmute') {
    try {
      client.commands.get(command).execute(client, msg, reply, getUserMuted, setUserMuted);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'advice') {
    try {
      client.commands.get(command).execute(msg, reply);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'status') {
    try {
      client.commands.get(command).execute(msg, reply, updateStatus);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'poll') {
    try {
      client.commands.get(command).execute(msg, args, reply);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  } else if (command == 'admin') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      if (admins.includes(msg.author.id)) {
        for (var i = 0; i < admins.length; i++) {

          if (admins[i] == msg.author.id) {
            admins.splice(i, 1);
            reply(msg.channel.id, `No longer ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
            break;
          }
        }
      } else {
        admins.push(msg.author.id);
        reply(msg.channel.id, `Ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
      }
      setServerAdmins(admins);
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  } else if (command == 'admins') {
    var description = 'Admins\n';
    for (let i of admins) {
      description += `${client.users.cache.get(i).tag} - ${i}\n`
    }
    reply(msg.channel.id, description, '#9e9d9d');
  } else if (command == 'ignore') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      if (ignoredCh.includes(msg.channel.id)) {
        for (var i = 0; i < ignoredCh.length; i++) {

          if (ignoredCh[i] == msg.channel.id) {
            ignoredCh.splice(i, 1);
            reply(msg.channel.id, `No longer ignoring this channel\nid: ${msg.channel.id}`, '#9e9d9d');
            break;
          }
        }
      } else {
        ignoredCh.push(msg.channel.id);
        reply(msg.channel.id, `Ignoring this channel from auto mod\nid: ${msg.channel.id}`, '#9e9d9d');
      }
      setServerIgnoredCh(ignoredCh);
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  } else if (command == 'ignores') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      var description = 'Ignored channels\n';
      for (let i of ignoredCh) {
        description += `${client.channels.cache.get(i).name} - ${i}\n`
      }
      reply(msg.channel.id, description, '#9e9d9d');
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  } else if (command == 'punish') {
    try {
      client.commands.get(command).execute(client, msg, args, reply, log, setUserMuted, setUserBanned);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  }
});

//Shows if a message is edited
client.on('messageUpdate', (oldMsg, newMsg) => {
  if (oldMsg.partial) {
    try {
      oldMsg.fetch().then(fullMessage => {
        if (fullMessage.author.bot) return
        log('830856984579670086', `${fullMessage.author} just edited a past message\nNew: ${newMsg.content}`, '#9e9d9d');
        const yes = punish(newMsg)
        if (yes[0]) newMsg.delete();
      });
    } catch (error) {
      console.error(error);
    }
  } else {

    if (newMsg.author.bot || oldMsg.content == newMsg.content) return;

    if (oldMsg.content) {
      log('830856984579670086', `${newMsg.author} just edited a message\nOld: ${oldMsg.content}\nNew: ${newMsg.content}`, '#9e9d9d');
      const yes = punish(newMsg)
      if (yes[0]) newMsg.delete();
    }
    else {
      log('830856984579670086', `${newMsg.author} just edited a past message\nNew: ${newMsg.content}`, '#9e9d9d');
      const yes = punish(newMsg)
      if (yes[0]) newMsg.delete();
    }
  }
});

//Updates the cache of invites
client.on('inviteCreate', invite => {
  updateInvites();
  let description = '';
  if (invite.targetUser) description += `\nIt was targeted towards ${invite.targetUser.tag}`;
  log('837513841389862932', `${invite.inviter} just created a invite(${invite.code})${description}`, ' #9e9d9d');
});
client.on('inviteDelete', () => { updateInvites(); });

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
  updateInvites();
  var embed = new MessageEmbed().setDescription(`${member.user} just joined!`).setThumbnail(member.user.displayAvatarURL()).setColor('#ffffba');
  const channel = client.channels.cache.get('830505212463546408');
  channel.send(embed);
  const muted = getUserMuted(member.user.id);
  if (muted == 1) {
    const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
    member.roles.add(role, `Auto muted on rejoin`);
  }
  log('837513841389862932', `${member}(${member.user.tag}) just joined the server`, '#9e9d9d');
});

client.on('guildMemberRemove', member => {
  log('837513841389862932', `${member}(${member.user.tag}) just left the server`, '#9e9d9d');
});

client.on('messageDelete', msg => {

  if (msg.partial) {
    try {
      msg.fetch().then(fullMessage => {
        log('830856984579670086', `${fullMessage.author}'s past message was just deleted\n\n${fullMessage.content}`, '#9e9d9d');
      });
    } catch (error) {
      console.error(error);
    }
  } else {

    if (msg.author.bot) return;

    if (msg.content) log('830856984579670086', `${msg.author}'s message was just deleted\n\n${msg.content}`, '#9e9d9d');
  }
});

client.on('guildBanAdd', (guild, user) => { log('834179033289719839', `${user} was just banned`, '#9e9d9d'); });

client.on('guildBanRemove', (guild, user) => { log('834179033289719839', `${user} was unbanned`, '#9e9d9d'); });

client.on('rateLimit', rl => {
  const cactus = client.users.cache.get('473110112844644372');
  cactus.send(`Hey um i was just rate limited :(\nLimit: ${rl.limit}\nMethod: ${rl.method}\nPath: ${rl.path}\nRoute: ${rl.route}\nTime Difference: ${rl.timeDifference}\nTimeout: ${rl.timeout}`);
});

client.on('warn', warning => {
  const cactus = client.users.cache.get('473110112844644372');
  cactus.send(`The bot was just warned :(\n${warning}`);
});

client.on('error', error => {
  const cactus = client.users.cache.get('473110112844644372')
  cactus.send(`${cactus} hey error:\n${error}`);
});

client.login(token.main);