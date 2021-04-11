const Discord = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');
const { Users } = require('./dbObjects');
const { Op } = require('sequelize');

const client = new Discord.Client();
const currency = new Discord.Collection();
const prefix = config.prefix;
var testing = false;
var status = 0;

Reflect.defineProperty(currency, 'addBalance', {
	/* eslint-disable-next-line func-name-matching */
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

Reflect.defineProperty(currency, 'addMessage', {
	/* eslint-disable-next-line func-name-matching */
	value: async function addMessage(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.messages += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, messages: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'setCooldown', {
	/* eslint-disable-next-line func-name-matching */
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

Reflect.defineProperty(currency, 'getCooldown', {
	/* eslint-disable-next-line func-name-matching */
	value: function getCooldown(id) {
		const user = currency.get(id);
		return user ? user.cooldown : 0;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

Reflect.defineProperty(currency, 'getMessages', {
	/* eslint-disable-next-line func-name-matching */
	value: function getMessages(id) {
		const user = currency.get(id);
		return user ? user.messages : 0;
	},
});

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
  setInterval(() => {
    client.channels.cache.get('830506017304477726').messages.fetch('830507916812353556')
      .then(message => {

        let description = '';
        currency.sort((a, b) => b.balance - a.balance)
          .filter(user => client.users.cache.has(user.user_id))
          .first(20)
          .forEach((user, position) => {
            let balance = round(user.balance);
            description += `\n(${position + 1}) ${balance}🍰 ${(client.users.cache.get(user.user_id))}`
          });
        var embed = new Discord.MessageEmbed().setColor('#ffffba').setDescription(description);
        message.edit(embed);
      })
      .catch(console.error);
  }, 120000);
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

  //Record message count
  currency.addMessage(msg.author.id, 1);
  
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
  
  //Curency Stuff
  if (!msg.content.startsWith(prefix) || msg.channel.type != 'text') return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'help') {
    let description = '';
    for(let i = 0; i < config.help.length; ++i) {
      description += `\n${prefix}${config.help[i]}`;
    }
    reply(msg.channel.id, description, '#ffffba');
  } else if (command == 'income') {
    reply(msg.channel.id, `Ok this is a quick explanation on how points are made on this server. As of when the server first started the two ways to make points goes as follows:\n1. You can make +5🍰 points per minute of messaging. This use's a cooldown system that starts a 1 minute cooldown on point gain.\n2. Spending 1 minute in vc will give you +2🍰 points. If you are not muted you will instead get a total of +5🍰 points. If you are not muted and use camera you will get a total +8🍰 points. If you can not use your camera you can instead screenshare while unmuted to get a total of +6🍰 points.\n3. also events may give points :D`, '#ffffba')
  } else if (command == 'balance' || command == 'bal') {
    const target = msg.mentions.users.first() || msg.author;
    return reply(msg.channel.id, `${target.tag} has ${currency.getBalance(target.id)}🍰`, '#ffffba');
  } else if (command == 'gamble' || command == 'g') {

    if (args[0] == 'help') return reply(msg.channel.id, 'Spend some 🍰 to earn some 🍰\nMiminal gamble amount: 500🍰\nPayout table: (:teddy_bear:= not 💎 / :space_invader:)\n💎 💎 💎 - 25x\n💎 💎 ❓ - 5x\n:teddy_bear: :teddy_bear: :teddy_bear: - 10x\n:teddy_bear: :teddy_bear: ❓ - 2x\n:space_invader: ❓ ❓ - 0x (cancels any winning)\n❓ ❓ ❓ - 0x', '#9e9d9d');
    const balance = await currency.getBalance(msg.author.id);
    const bank = await currency.getBalance('bank');
    var bet = 0;

    if (args[0] == 'all') bet = balance;
    else if (!isNaN(args[0]) && Math.floor(args[0]) >= 500) bet = Math.floor(args[0]);
    else return reply(msg.channel.id, `Hey sorry but you need to use the command like this ${prefix}gamble <all \\|\\| number \\|\\| help\nps. minimal gamble amount is 500🍰`, '#9e9d9d');
    
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
        .setDescription(`You Spent: ${bet}\nYou made: ${total}🍰 (${balance + outcome})\n${outcome}🍰 points taken from the bank(${bank + -outcome}🍰)`);
      log('830503210951245865', `+${outcome}🍰 to ${msg.author} from gambling ${bet}`, '#baffc9');
    } else {
      embed.setColor('#ff7784')
        .setDescription(`You Spent: ${bet}\nYou Made: ${total}🍰 (${balance + outcome})\n${-outcome}🍰 points added to the bank(${bank + -outcome}🍰)`);
      log('830503210951245865', `-${-outcome}🍰 to ${msg.author} from gambling ${bet}`, '#ff7784');
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
    for(let i = 0; i < config.shop.length; ++i) description += `\n${config.shop[i]}`;
    reply(msg.channel.id, description, '#9e9d9d');
  } else if (command == 'buy') {
    const balance = await currency.getBalance(msg.author.id);
    
    if (!args[0]) return reply(msg.channel.id, `You can use ${prefix}shop to see what you can buy`, '#9e9d9d');

    if (args[0].toLowerCase() == 'dj') {
      const role = msg.guild.roles.cache.get('830507721987194920');

      if (balance < 10000) return reply(msg.channel.id, `You don't have enough funds for the ${role} role\nYou need 10K🍰\nYou have ${balance}🍰`, '#9e9d9d');

      if (msg.member.roles.cache.has('830507721987194920')) return reply(msg.channel.id, `You already have ${role} you dumb`, '#9e9d9d');
      msg.member.roles.add(role);
      currency.addBalance(msg.author.id, -10000);
      currency.addBalance('bank', 10000);
      reply(msg.channel.id, `${msg.author} you are now a ${role}`, '#9e9d9d');
    } else {
      reply(msg.channel.id, 'That is not a valid item in the shop', '#9e9d9d');
    }
  } else if (command == 'badges') {
    const balance = await currency.getBalance(msg.author.id);
    let description = `Your balance: ${balance}\n(Smallest badge is worth 5k🍰)`;
    for(let i = 0; i < config.badges.names.length; ++i) {
      const role = msg.guild.roles.cache.get(config.badges.ids[i])
      if (config.badges.amounts[i] <= balance) {
        if (!msg.member.roles.cache.has(config.badges.ids[i])) msg.member.roles.add(role);
        description += `\n✅ - ${config.badges.names[i]}`;
      }
    }
    reply(msg.channel.id, description, '#ffffba');
  } else {
    reply(msg.channel.id, `You can use ${prefix}help to see the avalible commands`, '#9e9d9d');
  }
});

client.login(token.main);