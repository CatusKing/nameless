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
if (process.argv.includes('--testing') || process.argv.includes('-t')) testing = true;

Reflect.defineProperty(currency, 'addBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: async function addBalance(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount, cooldown: Date.now() });
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
		const newUser = await Users.create({ user_id: id, balance: 0, cooldown: amount }).catch(function(err) {
      console.log(err)
    });
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

client.once('ready', async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
  setInterval(() => {
    const guild = client.guilds.cache.get('765334473461465098');
    var description = '';
    guild.channels.cache.forEach(ch => {
      if (ch.type == 'voice' && ch.id != '765334475290443783') {
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
    if (description != '') log('824308505225199667', description, '#baffc9');
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
    let bank = await currency.getBalance('bank') + '';
    if (bank.length > 3 && bank.length < 7) bank = `${Math.round(bank / 100) / 10}k`;
    else if (bank.length > 6 && bank.length < 10) bank = `${Math.round(bank / 10000) / 100}m`;
    else if (bank.length > 9 && bank.length < 13) bank = `${Math.round(bank / 10000000) / 100}b`;
    client.user.setActivity(config.status[status]
      .replace('%bank%', bank)
      .replace('%prefix%', prefix)
      .replace('%top%', top)
    );
  }, 300000);
  console.log(`Logged in as ${client.user.tag}`);
});

//Non-currency stuff
client.on('message', async msg => {
  //Logs an channels
  const logChannel = client.channels.cache.get('823525965330251786');
  const announcementChannel = client.channels.cache.get('765334474090348588');

  if (msg.author.bot || msg.webhookID) return;

  //Dm commands
  if (msg.channel.type == 'dm') {
    const guild = client.guilds.cache.get('765334473461465098');
    const member = guild.members.cache.get(msg.author.id);
    if (!member.roles.cache.get('765334473499607073')) return msg.channel.send('Sorry only owners can run core commands!');
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
    log('824308505225199667', `+5🍰 to ${msg.author} for sending a message`, '#baffc9');
  }

  //Owner Stuff
  if (!msg.member.roles.cache.get('765334473499607073')) {
    let goOn = true;
    msg.mentions.members.forEach(member => {
      if (member.roles.cache.has('765334473499607073')) {
        var embed = new Discord.MessageEmbed()
          .setTitle('Ping to an owner')
          .setTimestamp()
          .setDescription(`From: ${msg.author}\nContent: ${msg.content}`)
          .setColor('#9e9d9d')
          .setFooter(msg.url);
        logChannel.send(embed);
        reply(msg.channel.id, `Hey ${msg.author} do you mind not pinning the owners. If you need anything you can always ping the staff.`, '#ff7784');
        goOn = false;
      }
      if (!goOn) return;
    });
  }
  if (msg.channel.id == '823549746836799508' && msg.content.includes('!announce!')) {
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
    reply(msg.channel.id, `Ok this is a quick explanation on how points are made on this server. As of when the server first started the two ways to make points goes as follows:\n1. You can make +5🍰 per minute of messaging. This use's a cooldown system that starts a 1 minute cooldown on point gain.\n2. Spending 1 minute in vc will give you +2🍰 point. If you are not muted you will instead get a total of +5🍰 points. If you are not muted and use camera you will get a total +8🍰 points. If you can not use your camera you can instead screenshare while unmuted to get a total of +6🍰 points.\n3. also events may give point eventually`, '#ffffba')
  } else if (command == 'balance' || command == 'bal') {
    const target = msg.mentions.users.first() || msg.author;
    return reply(msg.channel.id, `${target.tag} has ${currency.getBalance(target.id)}🍰`, '#ffffba');
  } else if (command == 'lb' || command == 'leaderboard') {
    var temp = 10;
    if (!isNaN(args[0])) {
      if (args[0] <= 20 && args[0] > 0) temp = Math.floor(args[0]);
      else if (args[0] > 20) temp = 20;
    }
    let description = '';
    currency.sort((a, b) => b.balance - a.balance)
      .filter(user => client.users.cache.has(user.user_id))
      .first(temp)
      .forEach((user, position) => {
        let balance = user.balance + '';
        if (balance.length > 3 && balance.length < 7) balance = `${Math.round(balance / 100) / 10}k`;
        else if (balance.length > 6 && balance.length < 10) balance = `${Math.round(balance / 10000) / 100}m`;
        else if (balance.length > 9 && balance.length < 13) balance = `${Math.round(balance / 10000000) / 100}b`;
        description += `\n(${position + 1}) ${(client.users.cache.get(user.user_id))}: ${balance}🍰`
      });
    reply(msg.channel.id, description, '#ffffba');
  } else if (command == 'gamble' || command == 'g') {
    if (args[0] == 'help') return reply(msg.channel.id, 'Spend some 🍰 to earn some 🍰\nMiminal gamble amount: 500🍰\nPayout table: (:teddy_bear:= not 💎 / :space_invader:)\n💎 💎 💎 - 25x\n💎 💎 ❓ - 5x\n:teddy_bear: :teddy_bear: :teddy_bear: - 10x\n:teddy_bear: :teddy_bear: ❓ - 2x\n:space_invader: ❓ ❓ - 0x (cancels any winning)\n❓ ❓ ❓ - 0x', '#9e9d9d');
    const balance = await currency.getBalance(msg.author.id);
    const bank = await currency.getBalance('bank');
    var bet = 0;
    if (args[0] == 'all') bet = balance;
    else if (!isNaN(args[0]) && Math.floor(args[0]) >= 500) bet = Math.floor(args[0]);
    else return reply(msg.channel.id, `Hey sorry but you need to use the command like this ${prefix}gamble <all \\|\\| number \\|\\| help\nps. minimal gamble amount is 500🍰`, '#9e9d9d');
    if (bet > balance || bet < 500) return reply(msg.channel.id, `Not enough funds! Your balance is ${balance}🍰`, '#9e9d9d');
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
    await currency.addBalance(msg.author.id, total - bet);
    await currency.addBalance('bank', bet - total);
    var embed = new Discord.MessageEmbed()
      .setTitle(`Slot Machine results: ${config.emojis[slot1]} ${config.emojis[slot2]} ${config.emojis[slot3]}`)
      .setFooter(`Use *${prefix}gamble help* for an explanation on the slot machine`);
    if (total > 0) {
      embed.setColor('#baffc9')
        .setDescription(`You Spent: ${bet}\nYou made: ${total}🍰 (${balance + total})\n${total - bet}🍰 points taken from the bank(${bank + bet - total})`);
    } else {
      embed.setColor('#ff7784')
        .setDescription(`You Spent: ${bet}\nYou made: ${total}🍰 (${balance + total})\n${bet - total}🍰 points added to the bank(${bank + total - bet})`);
    }
    msg.channel.send(embed);
  } else if (command == 'bank') {
    reply(msg.channel.id, `The bank currently has ${await currency.getBalance('bank')}🍰`, '#ffffba');
  }
});

if (testing) client.login(token.testing);
else client.login(token.main);