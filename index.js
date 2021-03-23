const Discord = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');

const client = new Discord.Client();
var testing = false;
if (process.argv.includes('--testing') || process.argv.includes('-t')) testing = true;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async msg => {
  if (msg.author.bot || msg.webhookID) return;
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
  const logChannel = client.channels.cache.get('823525965330251786');
  const announcementChannel = client.channels.cache.get('765334474090348588');
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
});

if (testing) client.login(token.testing);
else client.login(token.main);