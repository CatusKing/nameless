const Discord = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');
const { Users } = require('./dbObjects');
const { Op } = require('sequelize');

const client = new Discord.Client();
const currency = new Discord.Collection();
const prefix = config.prefix;
var testing = false;
if (process.argv.includes('--testing') || process.argv.includes('-t')) testing = true;

Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
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
            currency.add(m.id, 5);
            description += `\n+5💰 to ${m} for sitting in vc`;
          }
        })
      }
    });
    const moneyLogChannel = client.channels.cache.get('824308505225199667');
    var embed = new Discord.MessageEmbed().setDescription(description).setColor('#f7c9a3');
    moneyLogChannel.send(embed);
  }, 60000);
  client.user.setActivity(`${prefix}help`);
  console.log(`Logged in as ${client.user.tag}`);
});

//Non-currency stuff
client.on('message', async msg => {
  //Logs an channels
  const logChannel = client.channels.cache.get('823525965330251786');
  const announcementChannel = client.channels.cache.get('765334474090348588');
  const moneyLogChannel = client.channels.cache.get('824308505225199667');

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

  //Money
  const cooldown = currency.getCooldown(msg.author.id);
  if (cooldown < Date.now()) {
    await currency.add(msg.author.id, 5);
    await currency.setCooldown(msg.author.id, Date.now() + 60000);
    var embed = new Discord.MessageEmbed().setDescription(`+5💰 to ${msg.author} for sending a message`).setColor('#baffc9');
    moneyLogChannel.send(embed);
  }

  //Owner Stuff

  if (!msg.member.roles.cache.get('765334473499607073')) {
    msg.mentions.members.forEach(member => {
      for(let i = 0; i < config.ownerRoles.length; ++i) {
        if (member.roles.cache.has(config.ownerRoles[i])) {
          var embed = new Discord.MessageEmbed();
          embed.setTitle('Ping to an owner');
          embed.setTimestamp();
          embed.setDescription(`From: ${msg.author}\nContent: ${msg.content}`);
          logChannel.send(embed);
          msg.channel.send(`Hey ${msg.author} do you mind not pinning the owners. If you need anything you can always ping the staff.`);
          msg.delete();
        }
      }
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
      description += `\n${prefix}${config.help[i]}`
    }
    var embed = new Discord.MessageEmbed().setDescription(description).setColor('#ffffba');
    msg.channel.send(embed);
  } else if (command == 'balance') {
    const target = msg.mentions.users.first() || msg.author;
    return msg.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
  } else if (command == 'lb' || command == 'leaderboard') {
    var temp = 10
    if (!isNaN(args[0]) && Math.floor(args[0]) < 20) temp = Math.floor(args[0]);
    return msg.channel.send(
      currency.sort((a, b) => b.balance - a.balance)
        .filter(user => client.users.cache.has(user.user_id))
        .first(temp)
        .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
        .join('\n'),
      { code: true },
    );
  }
});

if (testing) client.login(token.testing);
else client.login(token.main);