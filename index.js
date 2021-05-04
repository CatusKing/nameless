const Discord = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');
const { Users } = require('./dbObjects');
const { Op } = require('sequelize');
const { google } = require('googleapis');
const commands = require('./general/commands');
const data = require('./general/data.json');
const fs = require('fs');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], ws: { properties: { $browser: "Discord iOS" } } });
const currency = new Discord.Collection();
const prefix = config.prefix;
var status = 0;
var invites = [];
const attributes = ["SEVERE_TOXICITY", "IDENTITY_ATTACK", "THREAT", "SEXUALLY_EXPLICIT"];
const tempData = { ignoredCh: data.ignoredCh, admins: data.admins, creepyMode: data.creepyMode };
const analyzeRequest = { comment: { text: '' }, requestedAttributes: { SEVERE_TOXICITY: {}, IDENTITY_ATTACK: {}, THREAT: {}, SEXUALLY_EXPLICIT: {} } };

const start = () => {
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

  Reflect.defineProperty(currency, 'getMuted', {
    value: function getMuted(id) {
      const user = currency.get(id);
      return user ? user.muted : 0;
    },
  });

  Reflect.defineProperty(currency, 'setMuted', {
    value: async function setMuted(id, amount) {
      const user = currency.get(id);
      if (user) {
        user.muted = Number(amount);
        return user.save();
      }
      const newUser = await Users.create({ user_id: id, daily: amount });
      currency.set(id, newUser);
      return newUser;
    },
  });
};

start();

const log = (channelId = String, content = String, color = String) => {
  const channel = client.channels.cache.get(channelId);
  const embed = new Discord.MessageEmbed().setDescription(content).setColor(color);
  channel.send(embed);
};

const reply = (channelId = String, content = String, color = String) => {
  const channel = client.channels.cache.get(channelId);
  const embed = new Discord.MessageEmbed().setDescription(content).setColor(color);
  channel.startTyping();
  setTimeout(() => {
    channel.send(embed);
    channel.stopTyping();
  }, 1000);
};

const round = (balance = Number) => {
  let bal = balance + '';

  if (bal.length > 3 && bal.length < 7) return `${Math.round(bal / 100) / 10}k`;
  else if (bal.length > 6 && bal.length < 10) return `${Math.round(bal / 10000) / 100}m`;
  else if (bal.length > 9 && bal.length < 13) return `${Math.round(bal / 10000000) / 100}b`;
  else return bal;
};

const updateLeaderboard = () => {
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
};

const punish = async (msg = Discord.Message) => {
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
    if (letters && !tempData.ignoredCh.includes(msg.channel.id) && !tempData.admins.includes(msg.author.id)) {
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
        if (msg.member.roles.cache.has('830495536582361128')) {
          msg.member.kick('Was already muted').catch(error => {
            cactus.send(error);
          });
          cactus.send(`umm ${author} was just kicked`);
          log('834179033289719839', `**Kicked**\n\nReason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\nWas **already** muted\n\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
        } else {
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          msg.member.roles.add(role, `Muted for getting 1 warning over .90`);
          currency.setMuted(msg.author.id, 1);
          reply(msg.channel.id, `${msg.author}, you have been **muted** for the following reason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
          log('834179033289719839', `**Muted**\n\nReason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
        }
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
        if (msg.member.roles.cache.has('830495536582361128')) {
          msg.member.kick('Was already muted').catch(error => {
            cactus.send(error);
          });
          cactus.send(`umm ${author} was just kicked`);
          log('834179033289719839', `**Kicked**\n\nReasons:\n${description}\nMember was **already** muted\n\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
        } else {
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          msg.member.roles.add(role, `Muted for getting 2 or more warnings`);
          currency.setMuted(msg.author.id, 1);
          reply(msg.channel.id, `${msg.author}, you have been **muted** for the following reasons:\n${description}\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
          log('834179033289719839', `**Muted**\n\nReasons:\n${description}\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n${msg.url}`, '#9e9d9d');
        }
        return true;
      }
    } else return false;
  } catch (error) { }
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
            for (let i of m.presence.activities) {
              if (i.type == 'CUSTOM_STATUS' && i.state.includes('https://discord.gg/Hja2gSnsAu')) {
                amount = Math.floor(amount * 1.5);
                break;
              }
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

  setTimeout(updateInvites, 4000);

  setInterval(updateMemberCount, 900000);

  setInterval(checkCh, 15000);

  console.log(`Logged in as ${client.user.tag}`);
});

//Currency and commands
client.on('message', async msg => {

  if (msg.author.bot || msg.webhookID) return;

  //Dm commands
  commands.dmCommands(client, msg);

  if (msg.channel.type != 'text') return;

  //Hate Speech
  punish(msg);

  //Points
  const cooldown = currency.getCooldown(msg.author.id);

  if (cooldown < Date.now()) {
    let amount = 5;
    for (let i of msg.author.presence.activities) {
      if (i.type == 'CUSTOM_STATUS' && i.state.includes('https://discord.gg/Hja2gSnsAu')) {
        amount = Math.floor(amount * 1.5);
        break;
      }
    }
    await currency.addBalance(msg.author.id, amount);
    await currency.setCooldown(msg.author.id, Date.now() + 60000);
    log('830503210951245865', `+${amount}🍰 to ${msg.author} for sending a message`, '#baffc9');
  }

  commands.announcements(client, msg);

  //Currency Stuff
  if (!msg.content.toLowerCase().startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'help') {
    commands.help(msg, reply);
  } else if (command == 'income') {
    commands.income(msg, reply);
  } else if (['balance', 'bal'].includes(command)) {
    commands.balance(msg, reply, round, currency);
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
    commands.badges(msg, reply, round, currency);
  } else if (command == 'weekly') {
    commands.weekly(msg, reply, log, currency, hours);
  } else if (command == 'daily') {
    commands.daily(msg, reply, log, currency);
  } else if (command == 'lb') {
    commands.lb(msg, reply, updateLeaderboard);
  } else if (command == 'ping') {
    commands.ping(client, msg, reply);
  } else if (command == 'mute') {
    commands.mute(client, msg, reply, currency);
  } else if (command == 'unmute') {
    commands.unmute(client, msg, reply, currency);
  } else if (command == 'spy') {
    if (msg.member.roles.cache.has('838963152988274689')) {
      reply(msg.channel.id, 'Hey check where you were just pinged!', '#9e9d9d')
      msg.guild.channels.create(`${msg.author.tag}-is-spying`, {
        type: 'text',
        parent: '838954294094856242',
        reason: `${msg.author} wanted to spy on someone`,
        permissionOverwrites: [
          {
            id: `${msg.author.id}`,
            allow: 'SEND_MESSAGES'
          },
          {
            id: `${msg.author.id}`,
            allow: 'VIEW_CHANNEL'
          },
          {
            id: `830495072876494879`,
            deny: 'VIEW_CHANNEL'
          },
          {
            id: `830495908336369694`,
            allow: 'VIEW_CHANNEL'
          }
        ]
      }).then(ch => {
        ch.send(`${msg.author} ping who you want to spy on by sending a mention. You can do this by doing \`\`<@target discord id>\`\``)
          .then(() => {
            const filter = m => m.author.id == msg.author.id;
            ch.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
              .then(collected => {
                const target = collected.first().mentions.members.first() || msg.member;
                var embed = new Discord.MessageEmbed()
                  .setTitle(`All the information I could get on ${target.user.tag}`)
                  .setFooter('If you abuse this you are subject to a server ban!')
                  .setDescription(`User: ${target}\nTag: ${target.user.tag}\nDisplay name: ${target.displayName}\nDisplay Color: ${target.displayColor}\nId: ${target.id}`)
                  .setImage(target.user.displayAvatarURL())
                  .setColor('#9e9d9d');
                let roles = '';
                for (let i of target.roles.cache) {
                  roles += `${i[1].name}\n`;
                }
                embed
                  .addField('Roles', roles, false)
                  .addField('Account created on', target.user.createdAt.toUTCString(), true)
                  .addField('Joined this server on', target.joinedAt.toUTCString(), true)
                  .addField('Last message', `${target.user.lastMessage}`, true)
                  .addField('!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!', '\u200B\n\n\n__**Presence Data**__', false)
                  .addField('Status', `${target.presence.status}`, true)
                if (target.presence.status != 'offline') embed.addField('Client Status', `Desktop: ${target.user.presence.clientStatus.desktop}\nMobile: ${target.user.presence.clientStatus.mobile}\nWeb: ${target.user.presence.clientStatus.web}\n`, true)
                for (let i of target.presence.activities) {
                  let description = '\u200B';
                  if (i.state) description += `${i.state}\n`;
                  if (i.details) description += `${i.details}`;
                  embed.addField(`${i.name}`, description, true);
                }
                ch.send(embed);
                reply(ch.id, 'Deleting channel in 10 minutes', '#9e9d9d')
                setTimeout(() => {
                  ch.delete(`10 minutes has passed`)
                }, 600000)
              }).catch(error => {
                console.log(error);
                ch.send('No response :(\nDeleting channel...');
                setTimeout(() => {
                  ch.delete(`No target input`);
                }, 10000);
              });
          });
      });
    } else reply(msg.channel.id, 'Sorry you need to be a Spy to do this :(', '#9e9d9d');
  } else if (command == 'admin') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      if (tempData.admins.includes(msg.author.id)) {
        for (var i = 0; i < tempData.admins.length; i++) {

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
    for (let i of tempData.admins) {
      description += `${client.users.cache.get(i).tag} - ${i}\n`
    }
    reply(msg.channel.id, description, '#9e9d9d');
  } else if (command == 'ignore') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      if (tempData.ignoredCh.includes(msg.channel.id)) {
        for (var i = 0; i < tempData.ignoredCh.length; i++) {

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
      for (let i of tempData.ignoredCh) {
        description += `${client.channels.cache.get(i).name} - ${i}\n`
      }
      reply(msg.channel.id, description, '#9e9d9d');
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  } else if (command == 'creepy') {
    if (msg.member.roles.cache.has('830496065366130709')) {
      tempData.creepyMode = !tempData.creepyMode;
      reply(msg.channel.id, `Creepy mode is now ${tempData.creepyMode}`.replace('true', 'on').replace('false', 'off'), '#9e9d9d')
      let json = JSON.stringify(tempData);
      fs.writeFileSync('general/data.json', json);
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  }
});

//Shows if a message is edited
client.on('messageUpdate', (oldMsg, newMsg) => {

  if (oldMsg.partial) {
    try {
      oldMsg.fetch().then(fullMessage => {
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
  var embed = new Discord.MessageEmbed().setDescription(`${member.user} just joined!`).setThumbnail(member.user.displayAvatarURL()).setColor('#ffffba');
  const channel = client.channels.cache.get('830505212463546408');
  channel.send(embed);
  const muted = currency.getMuted(member.user.id);
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

client.on('typingStart', (ch, user) => { if (!user.bot && tempData.creepyMode) log('838774906719043584', `${user} just started typing in ${ch}`, '#9e9d9d'); });

client.on('presenceUpdate', (presence1, presence2) => {
  if (presence2.user.bot || !tempData.creepyMode) return;
  var embed = new Discord.MessageEmbed().setColor('#9e9d9d').setTitle(`${presence2.member.displayName}'s Presence`).setDescription(`~ is new`);
  let description = '';
  if (presence1 && presence2 && presence1.status != presence2.status) embed.addField('Status', `${presence1.status}`, true);
  if (presence1 && presence2 && presence1.clientStatus && presence1.clientStatus.desktop != presence2.clientStatus.desktop || presence1.clientStatus.mobile != presence2.clientStatus.mobile || presence1.clientStatus.web != presence2.clientStatus.web) embed.addField('Client Status', `Desktop: ${presence1.clientStatus.desktop}\nMobile: ${presence1.clientStatus.mobile}\nWeb: ${presence1.clientStatus.web}\n`, true);
  if (presence1 && presence1.activities) {
    for (let i = 0; i < presence1.activities.length; ++i) {
      description = '\u200B';
      if (presence1.activities[i].state && presence1.activities[i].state != presence2.activities[i].state) description += `${presence1.activities[i].state}\n`;
      if (presence1.activities[i].details && presence1.activities[i].details != presence2.activities[i].details) description += `${presence1.activities[i].details}`;
      if (description != '\u200B') embed.addField(`${presence1.activities[i].name}`, description, true);
    }
    embed.addField('!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!i!', '\u200B', false);
  }
  if (presence1 && presence2 && presence1.status != presence2.status) embed.addField('~Status~', `${presence2.status}`, true);
  if (presence1 && presence2 && presence2.clientStatus && presence1.clientStatus.desktop != presence2.clientStatus.desktop || presence1.clientStatus.mobile != presence2.clientStatus.mobile || presence1.clientStatus.web != presence2.clientStatus.web) embed.addField('~Client Status~', `Desktop: ${presence2.clientStatus.desktop}\nMobile: ${presence2.clientStatus.mobile}\nWeb: ${presence2.clientStatus.web}\n`, true);
  if (presence2) {
    for (let i = 0; i < presence2.activities.length; ++i) {
      description = '\u200B';
      if (presence2.activities[i].state && presence1.activities[i].state != presence2.activities[i].state) description += `${presence2.activities[i].state}\n`;
      if (presence2.activities[i].details && presence1.activities[i].details != presence2.activities[i].details) description += `${presence2.activities[i].details}`;
      if (description != '\u200B') embed.addField(`~${presence2.activities[i].name}~`, description, true);
    }
  }
  const logCh = client.channels.cache.get('838774906719043584');
  logCh.send(embed);
});

client.on('error', error => {
  const cactus = client.users.cache.get('473110112844644372')
  cactus.send(`${cactus} hey error:\n${error}`);
});

client.login(token.main);