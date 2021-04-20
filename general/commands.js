const Discord = require('discord.js');
const config = require('./config.json');

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

const announcements = (client = Discord.Client,msg = Discord.Message) => {
  const announcementChannel = client.channels.cache.get('830506698908893235');
  const eventChannel = client.channels.cache.get('830506718164287498');
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
};

const help = (msg = Discord.Message, reply) => {
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
};

exports.dmCommands = dmCommands;
exports.announcements = announcements;
exports.help = help;