const { Client, Collection, MessageEmbed, Intents, Message } = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');
const db = require('quick.db');
const { google } = require('googleapis');
const fs = require('fs');
const request = require('request');
const { create, all} = require('mathjs');
const math = create(all);
const limitedEvaluate = math.evaluate;
const intents = new Intents(32767);
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], ws: { properties: { $browser: "Discord iOS" } }, intents: intents });
const prefix = config.prefix;
var status = 0;
var invites = [];
var crazyTime = 0;
const attributes = ["SEVERE_TOXICITY", "IDENTITY_ATTACK", "THREAT", "SEXUALLY_EXPLICIT"];
const analyzeRequest = { comment: { text: '' }, requestedAttributes: { SEVERE_TOXICITY: {}, IDENTITY_ATTACK: {}, THREAT: {}, SEXUALLY_EXPLICIT: {} } };
var count = db.get(`discord.count`) || 0;
var topCount = db.get(`discord.topCount`) || 0;

client.commands = new Collection();
client.functions = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

for (const file of functionFiles) {
  const functions = require(`./functions/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.functions.set(file.replace('.js', ''), functions);
}

math.import({
  'import':     function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'compile':    function () { throw new Error('Function compile is disabled') },
}, { override: true });

const log = (channelId = new String, content = new String, color = new String) => {
  const channel = client.channels.cache.get(channelId);
  const embed = new MessageEmbed().setDescription(content).setColor(color);
  channel.send({ embeds: [embed] });
};

const reply = (channelId = new String(), content = new String(), color = '#9e9d9d') => {
  const channel = client.channels.cache.get(channelId);
  const embed = new MessageEmbed().setDescription(content).setColor(color);
  channel.sendTyping();
  setTimeout(() => {
    channel.send({ embeds: [embed] });
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

const hours = (milliseconds = Number) => {
  return Math.floor(((milliseconds / 1000) / 60) / 60) + 1;
};

const updateInvites = () => {
  const guild = client.guilds.cache.get('830495072876494879');
  guild.invites.fetch().then(guildInvites => {
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
    .replace('%topCount%', topCount)
  );
};

const givePoints = () => {
  const guild = client.guilds.cache.get('830495072876494879');
  var description = '';
  guild.channels.cache.forEach(ch => {
    
    if (ch.type == 'GUILD_VOICE' && ch.id != '830505700269883412') {
      ch.members.forEach(member => {
        
        if (!member.voice.deaf) {
          
          if (member.user.bot) return;
          let amount = 2;
          
          if (!member.voice.mute) {
            amount += 3;
            
            if (member.voice.selfVideo) amount += 3;
            else if (member.voice.streaming) amount += 1;
          }
          var yes = false;
          if (member.roles.cache.has('867226596103946250')) {
            amount = Math.floor(amount * 1.5);
            yes = true;
          }
          if (member.presence) {
            for (let i of member.presence.activities) {
              if (i.type == 'CUSTOM_STATUS' && i.state.includes('discord.gg/Hja2gSnsAu') && !yes) {
                amount = Math.floor(amount * 1.5);
                break;
              }
            }
          }
          addUserBalance(member.id, amount);
          description += `\n+${amount}🦴 to ${member} for sitting in vc`;
        }
      });
    }
  });
  
  if (description != '') log('830503210951245865', description, '#baffc9');
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

const punish = async (msg) => {
  try {
    const characters = msg.content.split('');
    var letters = false;
    for (let i of characters) {
      if (config.abc.includes(i.toLowerCase())) {
        letters = true;
        break;
      }
    }
    var admins = getServerAdmins();
    var ignoredCh = getServerIgnoredCh();
    if (letters && !ignoredCh.includes(msg.channel.id) && !admins.includes(msg.author.id)) {
      var warn = 0;
      var severity = 0;
      var reason = [];
      const scores = await get_attrs(msg.content)
      for (let i of attributes) {
        if (scores[i] >= 0.75) {
          ++warn;
          severity = severity + scores[i];
          reason.push(i);
        }
      }
      var date = new Date();
      if (warn == 1 && severity >= .9 || warn > 1 && severity <= 1.65) {
        reply(msg.channel.id, `${msg.author}, this is a warning. You have been flagged for the following reason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#9e9d9d');
        log('834179033289719839', `Warned <t:${Math.floor(date.getTime() / 1000)}:R>\n\nReason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n[Jump to!](${msg.url})`, '#9e9d9d');
        return true;
      } else if (warn > 1 && severity > 1.65) {
        var description = '';
        for (let i of reason) {
          description += `**${i.toLowerCase()}**: ${scores[i]}\n`;
        }
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        msg.member.roles.add(role, `Muted for getting 2 or more warnings`);
        setUserMuted(msg.author.id, -1);
        reply(msg.channel.id, `${msg.author}, you have been **muted** for the following reasons:\n${description}\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
        log('834179033289719839', `**Muted** <t:${Math.floor(date.getTime() / 1000)}:R>\n\nReasons:\n${description}\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n[Jump to!](${msg.url})`, '#9e9d9d');
        return true;
      }
    } else return false;
  } catch (error) { }
};

const APOD = (id = config.APOD_chID) => {
  request(`https://api.nasa.gov/planetary/apod?api_key=${token.apiKey1}`, { json: true }, (err, res, body) => {
    if (err) return console.log(err);
    const ch = client.channels.cache.get(id);
    var embed = new MessageEmbed()
      .setImage(body.hdurl)
      .setAuthor(`Credit to NASA for providing the APOD(Astronomy Picture of the Day) <3`)
      .setTitle(body.title)
      .setURL(body.hdurl)
      .setDescription(body.explanation)
      .setColor(`#0b3d91`)
      .setFooter(body.date);
    ch.send({ embeds: [embed] });
  });
};

const nextLaunch = () => {
  client.channels.cache.get('841137170525716480').messages.fetch('880297426508972113')
    .then(message => {
      request(`https://ll.thespacedevs.com/2.0.0/launch/upcoming/?format=json&limit=20`, { json: true }, (err, res, body) => {
        if (err) return console.log(err);
        var date = new Date();
        var id = 0;
        var temp = -1;
        for (let i = 0; i < body.results.length; ++i) {
          var tempDate = new Date(body.results[i].net);
          if (temp == -1 && (tempDate.getTime() - date.getTime()) > 0 || temp > (tempDate.getTime() - date.getTime()) && (tempDate.getTime() - date.getTime()) > 0) {
            id = i;
            temp = tempDate.getTime() - date.getTime();
          }
        }
        var launchTime = new Date(body.results[id].net);
        var embed = new MessageEmbed()
          .setColor('#0b3d91')
          .setAuthor(`Updated on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} EST`)
          .setTitle(body.results[id].name)
          .setThumbnail(body.results[id].image)
          .addField(`Status and probability`, `Status: ${body.results[id].status.name}\nProbability: ${body.results[id].probability}`)
          .addField(`Provider: ${body.results[id].launch_service_provider.name}`, `Type: ${body.results[id].launch_service_provider.type}`)
          .setImage(body.results[id].ideographic);
        if (body.results[id].mission != null) {
          embed.setDescription(`Launch <t:${Math.floor(launchTime.getTime() / 1000)}:R>\n\n${body.results[id].mission.description}`)
            .addField(`Mission ${body.results[id].mission.name}`, `Type: ${body.results[id].mission.type}`)
          if (body.results[id].mission.orbit != null) {
            embed.addField(`Orbit`, body.results[id].mission.orbit.name);
          };
        }
        message.edit({ content: '\u200B', embeds: [embed] });
      });
    });
};

const events = () => {
  var embeds = [];
  request(`https://ll.thespacedevs.com/2.0.0/event/upcoming/?format=json&limit=20`, { json: true }, (err, res, body) => {
    if (err) return console.log(err);
    var date = new Date();
    for (let i of body.results) {
      var launchTime = new Date(i.date);
      if (launchTime.getTime() - date.getTime() < 0) continue;
      var embed = new MessageEmbed()
        .setColor('#0b3d91')
        .setAuthor(`Updated on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} EST`)
        .setTitle(i.name)
        .setURL(i.news_url)
        .setDescription(`<t:${Math.floor(launchTime.getTime() / 1000)}:R>\n\n${i.description}`)
        .addField('Type', i.type.name)
        .setImage(i.feature_image);
      embeds.push(embed);
    }
    var time = 0;
    for (let j = 0; j < config.eventsMessages.length; ++j) {
      client.channels.cache.get('841334897825415199').messages.fetch(config.eventsMessages[j])
        .then(message => {
          time = time + 5000;
          if (embeds[j] != null) {
            setTimeout(() => message.edit({ embeds: [embeds[j]], content: '\u200B' }), time);
          } else {
            setTimeout(() => message.edit({ embeds: [new MessageEmbed().setDescription('\u200B').setColor('#9e9d9d')], content: '\u200B' }), time);
          }
        });
    }
  });
};

const counting = () => {
  const channel = client.channels.cache.get('830661661991632907');
  const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830904166007701504');
  channel.messages.fetch({limit: 10}, {force: true}).then((messages) => {
    try {var number = limitedEvaluate(messages.first().content);}
    catch (err) {
      db.set(`discord.count`, 0);
      count = 0;
      messages.first().react('❌');
      messages.first().channel.send(`\`\`\`\n${err}\`\`\``);
      messages.first().channel.send(`Why... reset back to 1...`);
      messages.first().member.roles.add(role);
    }
    if (isNaN(number) || number != count + 1) {
      messages.first().channel.send(`Ugh wrong number\nThe right number was ${count + 1} not ${number}`);
      db.set(`discord.count`, 0);
      count = 0;
      messages.first().react('❌');
      messages.first().member.roles.add(role);
    } else {
      if (count == 0) {
        db.set('discord.count', count + 1);
        ++count;
        messages.first().react('✅');
        if (messages.first().member.roles.cache.has('867226596103946250')) var mult = 1.5;
        else var mult = 1;
        if (count > topCount) {
          db.set('discord.topCount', count);
          topCount = count;
          messages.first().react('🎉');
          addUserBalance(messages.first().author.id, Math.floor(50 * mult));
          log('830503210951245865', `+${Math.floor(50 * mult)}🦴 to ${messages.first().author} for getting a new high score in counting`, '#baffc9');
        } else {
          addUserBalance(messages.first().author.id, Math.floor(5 * mult));
          log('830503210951245865', `+${Math.floor(5 * mult)}🦴 to ${messages.first().author} for counting`, '#baffc9');
        }
      } else {
        if (messages.first().author.id == messages.first(2)[1].author.id) {
          db.set(`discord.count`, 0);
          count = 0;
          messages.first().react('❌');
          messages.first().channel.send(`Why... You cant go after yourself...`);
          messages.first().member.roles.add(role);
        } else {
          db.set('discord.count', count + 1);
          ++count;
          messages.first().react('✅');
          if (messages.first().member.roles.cache.has('867226596103946250')) var mult = 1.5;
          else var mult = 1;
          if (count > topCount) {
            db.set('discord.topCount', count);
            topCount = count;
            messages.first().react('🎉');
            addUserBalance(messages.first().author.id, Math.floor(50 * mult));
            log('830503210951245865', `+${Math.floor(50 * mult)}🦴 to ${messages.first().author} for getting a new high score in counting`, '#baffc9');
          } else {
            addUserBalance(messages.first().author.id, Math.floor(5 * mult));
            log('830503210951245865', `+${Math.floor(5 * mult)}🦴 to ${messages.first().author} for counting`, '#baffc9');
          }
        }
      }
    }
  });
};

const checkStreaks = () => {
  var users = db.get(`discord.users`) || {};
  var date = new Date();
  var guild = client.guilds.cache.get('830495072876494879');
  guild.members.cache.forEach((member) => {
    if (users[member.id]) {
      if (isNaN(users[member.id].streakTime)) users[member.id].streakTime = 0;
      var streakTime = users[member.id].streakTime || 0;
      if (streakTime <= Math.floor(((date.getTime() / 1000) / 60) / 60)) {
        users[member.id].streak = 0;
      } else {
        for(let i = 0; i < config.streaks.length; ++i) {
          const role = guild.roles.cache.get(config.streaks[i][1]);
          if (users[member.id].streak < config.streaks[i][0] && member.roles.cache.has(role.id)) {
            member.roles.remove(role, 'Reset Streak :(');
          }
        }
      }
    }
  });
  db.set(`discord.users`, users);
};

const updateStreak = (id = new String(), msg = new Message()) => {
  var currentTime = db.get(`discord.users.${id}.streakTime`) || 0;
  var date = new Date();
  if (currentTime <= Math.floor(((date.getTime() / 1000) / 60) / 60) + 24) {
    msg.react('🔥');
    var streak = db.get(`discord.users.${id}.streak`) + 1 || 1;
    for(let i = 0; i < config.streaks.length; ++i) {
      if (streak < config.streaks[i][0]) break;
      else if (streak >= config.streaks[i][0] && !msg.member.roles.cache.has(config.streaks[i][1])) {
        var role = msg.guild.roles.cache.get(config.streaks[i][1]);
        msg.member.roles.add(role, 'New Streak Score');
        addUserBalance(msg.author.id, config.streaks[i][2]);
        msg.react('🦴');
        log(`830503210951245865`, `+${config.streaks[i][2]}🦴 to ${msg.member} for reaching a streak of ${config.streaks[i][0]}`, '#9e9d9d')
      }
    }
    db.set(`discord.users.${id}.streakTime`, Math.floor(((date.getTime() / 1000) / 60) / 60) + 48);
    db.set(`discord.users.${id}.streak`, streak);
  }
};


client.once('ready', () => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  setInterval(givePoints, 60000);

  setInterval(updateStatus, 300000);

  setTimeout(() => {
    setInterval(() => client.functions.get('updateLeaderboard').execute(client, db, round), 300000);
  }, 30000);

  setTimeout(updateInvites, 4000);

  setInterval(() => client.functions.get('updateMemberCount').execute(client), 900000);

  setInterval(() => client.functions.get('checkCh').execute(client), 15000);

  setInterval(() => client.functions.get('checkMuted').execute(client, db), 30000);

  setInterval(() => client.functions.get('checkBanned').execute(client, db), 30000);

  setInterval(() => {
    if (crazyTime > 0) crazyTime -= 1;
  }, 1000);

  setInterval(() => {
    var date = new Date();
    if (date.getHours() == 7 && date.getMinutes() == 0) APOD();
  }, 60000);

  setTimeout(() => setInterval(nextLaunch, 900000), 60000);

  setTimeout(() => setInterval(events, 900000), 90000);

  setInterval(checkStreaks, 3600000);

  console.log('Setting up slash commands');
  var commands = [];
  client.commands.forEach((value, key) => {
    if (value.slash) {
      commands.push({
        name: value.name,
        description: value.description,
        options: value.options
      });
    }
  });
  client.application.commands.set(commands, config.guildId);
  console.log('Finished setting up slash commands');

  console.log(`Logged in as ${client.user.tag}`);
});

//Currency and commands
client.on('messageCreate', async (msg) => {

  if (msg.author.bot || msg.webhookId) return;

  var admins = getServerAdmins();
  var ignoredCh = getServerIgnoredCh();
  
  // //Dm commands
  if (msg.channel.type == 'DM') {
    const guild = client.guilds.cache.get('830495072876494879');
    const member = guild.members.cache.get(msg.author.id);

    if (!member.roles.cache.get('830496065366130709')) return msg.channel.send('Sorry only owners can run core commands!');

    if (msg.content == '!update') {
      client.user.setAvatar(guild.iconURL());
      msg.channel.send('Ran the following updates\nPfP');
    }
    if (msg.content == '!test') {
      checkStreaks();
    }
  }

  if (msg.channel.type != 'GUILD_TEXT') return;

  if (msg.channelId == '830661661991632907') counting();

  if (msg.content.toLowerCase().includes('crazy') && crazyTime == 0) {
    var time = 0;
    var crazy = ['Crazy?', 'I was crazy once.', 'They put me in a rubber room.', 'A rubber room with rats!', 'The rats made me crazy!'];
    crazyTime = 60;
    for(let i = 0; i < crazy.length * 3; ++i) {
      time = time + 1350;
      setTimeout(() => {
        msg.channel.send(crazy[i % crazy.length]);
      }, time);
    }
  }

  // //Hate Speech
  punish(msg);

  // //Points
  const cooldown = getUserCooldown(msg.author.id);
  if (cooldown < Date.now()) {
    let amount = 5;
    if (msg.member.presence == null) return;
    var yes = false;
    if (msg.member.roles.cache.has('867226596103946250')) {
      amount = Math.floor(amount * 1.5);
      yes = true;
    }
    for (let i of msg.member.presence.activities) {
      if (i.type == 'CUSTOM_STATUS' && i.state != null && i.state.includes('discord.gg/Hja2gSnsAu') && !yes) {
        amount = Math.floor(amount * 1.5);
        break;
      }
    }
    addUserBalance(msg.author.id, amount);
    setUserCooldown(msg.author.id, Date.now() + 60000);
    log('830503210951245865', `+${amount}🦴 to ${msg.author} for sending a message`, '#baffc9');
  }

  updateStreak(msg.author.id, msg);

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

  client.commands.forEach((value, key) => {
    if (value.command && value.aliases.includes(command)) {
      try {
        if (value.slash) msg.channel.send('Hey we now have slash commands! Eventually text commands will be removed so please use the slash version of this command next time.');
        value.execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, client.commands, client.functions.get('updateLeaderboard').execute, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db/*longest is leaderboard*/);
      } catch (err) {
        msg.reply('there was an error trying to execute that command!');
        console.error(err);
      }
    }
  });
});

client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.emoji.name != '💀') return;
  if (reaction.count >= 3) {
    client.channels.cache.get('880999255622451270').messages.fetch({ limit: 10 }).then(messages => {
      var yes = false;
      messages.forEach(message => {
        if (message.embeds[0].footer.text == reaction.message.id && !yes) {
          yes = true;
          message.edit({ embeds: [ message.embeds[0].setTitle(`${reaction.count} 💀`) ] })
        }
      });
      if (!yes) {
        var embed = new MessageEmbed().setDescription(reaction.message.content).setColor('#9e9d9d').setFooter(reaction.message.id).setAuthor(reaction.message.member.displayName, reaction.message.author.avatarURL()).addField('Source', `<#${reaction.message.channelId}>`).setTitle(`${reaction.count} 💀`);
        if (reaction.message.attachments.size > 0) embed.setImage(reaction.message.attachments.first().url);
        const channel = client.channels.cache.get('880999255622451270')
        channel.send({ embeds: [ embed ] });
      }
    });
  }
});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    var admins = getServerAdmins();
    var ignoredCh = getServerIgnoredCh();
  
    client.commands.forEach((value, key) => {
      if (value.name == interaction.commandName && value.slash) {
        try {
          value.executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, client.commands, client.functions.get('updateLeaderboard').execute, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db/*longest is income*/);
        } catch (err) {
          interaction.reply('there was an error trying to execute that command!');
          console.error(err);
        }
      }
    });
  } else if (interaction.isSelectMenu()) {
    client.commands.forEach((value, key) => {
      if (value.name == interaction.customId && value.selectMenu) {
        try {
          value.executeSM(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, client.commands, client.functions.get('updateLeaderboard').execute, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db/*longest is income*/);
        } catch (err) {
          interaction.reply('there was an error trying to execute that command!');
          console.error(err);
        }
      }
    });
  } else if (interaction.isButton()) {
    client.commands.forEach((value, key) => {
      if (interaction.customId.includes(value.buttonId) && value.button) {
        try {
          value.executeB(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, client.commands, client.functions.get('updateLeaderboard').execute, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db/*longest is income*/);
        } catch (err) {
          interaction.reply('there was an error trying to execute that command!');
          console.error(err);
        }
      }
    });
  }
});

client.on('threadCreate', (thread) => {
  thread.join();
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
  client.guilds.cache.get(config.guildId).invites.fetch().then(guildInvites => {
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
  request(`https://pronoundb.org/api/v1/lookup?platform=discord&id=${member.user.id}`, { json: true }, (err, res, body) => {
    if (body.pronouns != null) {
      if (body.pronouns == 'other') return member.roles.add(client.guilds.cache.get('830495072876494879').roles.cache.get('869956623488143431'), 'https://pronoundb.org/ claims this member has these pronouns');
      if (body.pronouns == 'sh') return member.roles.add(client.guilds.cache.get('830495072876494879').roles.cache.get('854050147959701554'), 'https://pronoundb.org/ claims she has these pronouns');
      if (body.pronouns.includes('h')) member.roles.add(client.guilds.cache.get('830495072876494879').roles.cache.get('854050148425138186'), 'https://pronoundb.org/ claims he has these pronouns');
      if (body.pronouns.includes('i')) member.roles.add(client.guilds.cache.get('830495072876494879').roles.cache.get('869953400173899776'), 'https://pronoundb.org/ claims it has these pronouns');
      if (body.pronouns.includes('t')) member.roles.add(client.guilds.cache.get('830495072876494879').roles.cache.get('854050147519299594'), 'https://pronoundb.org/ claims they have these pronouns');
      if (body.pronouns.includes('any')) member.roles.add(client.guilds.cache.get('830495072876494879').roles.cache.get('854050146505195520'), 'https://pronoundb.org/ claims they have these pronouns');
      if (body.pronouns.includes('ask')) member.roles.add(client.guilds.cache.get('830495072876494879').roles.cache.get('854050146836021329'), 'https://pronoundb.org/ claims this member has these pronouns');
    }
  });
  log('837513841389862932', `${member}(${member.user.tag}) just joined the server`, '#9e9d9d');
});

client.on('guildMemberRemove', member => {log('837513841389862932', `${member}(${member.user.tag}) just left the server`, '#9e9d9d'); });

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
