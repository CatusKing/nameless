const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'announcements',
	description: 'Run in the control panel',
  usage: ``,
  command: false,
  aliases: [],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned) {
    const announcementChannel = client.channels.cache.get('830506698908893235');
    const eventChannel = client.channels.cache.get('830506718164287498');
    const partnerChannel = client.channels.cache.get('846376197163581490');
    if (msg.channel.id == '830503569622827069' && msg.content.includes('!announce!')) {
      if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
      msg.channel.send(`\`Is this announcement ok?\nRespond yes or no\nImage will be included\`\n\n${msg.content.replace('!announce!', '')}`)
        .then(async () => {
          const filter = m => m.author.id == msg.author.id;
          msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(async collected => {
  
              if (collected.first().content.toLowerCase().includes('yes')) {
                try {
                  const webhooks = await announcementChannel.fetchWebhooks();
                  const webhook = webhooks.first();
  
                  if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                  var embeds = [];
                  for (let i of msg.attachments) {
                    embeds.push(new MessageEmbed().setImage(i[1].url).setColor('#9e9d9d'));
                  }
                  await webhook.send(msg.content.replace('!announce!', ''), {
                    username: msg.guild.name,
                    avatarURL: msg.guild.iconURL(),
                    embeds: embeds,
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
      msg.channel.send(`\`Is this event ok?\nRespond yes or no\nImage will be included\`\n\n${msg.content.replace('!event!', '')}`)
        .then(async () => {
          const filter = m => m.author.id == msg.author.id;
          msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(async collected => {
  
              if (collected.first().content.toLowerCase().includes('yes')) {
                try {
                  const webhooks = await eventChannel.fetchWebhooks();
                  const webhook = webhooks.first();
  
                  if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                  var embeds = [];
                  for (let i of msg.attachments) {
                    embeds.push(new MessageEmbed().setImage(i[1].url).setColor('#9e9d9d'));
                  }
                  await webhook.send(msg.content.replace('!event!', ''), {
                    username: msg.guild.name,
                    avatarURL: msg.guild.iconURL(),
                    embeds: embeds,
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
    if (msg.channel.id == '830503569622827069' && msg.content.includes('!partner!')) {
      if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
      msg.channel.send(`\`Is this partner message ok?\nRespond yes or no\nImage will be included\`\n\n${msg.content.replace('!partner!', '')}`)
        .then(async () => {
          const filter = m => m.author.id == msg.author.id;
          msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(async collected => {
  
              if (collected.first().content.toLowerCase().includes('yes')) {
                try {
                  const webhooks = await partnerChannel.fetchWebhooks();
                  const webhook = webhooks.first();
  
                  if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                  var embeds = [];
                  for (let i of msg.attachments) {
                    embeds.push(new MessageEmbed().setImage(i[1].url).setColor('#9e9d9d'));
                  }
                  await webhook.send(`||<@&830554664373714994>||\n${msg.content.replace('!partner!', '')}`, {
                    username: msg.guild.name,
                    avatarURL: msg.guild.iconURL(),
                    embeds: embeds,
                  });
                } catch (error) {
                  console.warn(error);
                }
              } else {
                msg.channel.send('Partner message canceled!');
              }
            }).catch(() => {
              msg.channel.send('No response :(');
            });
        });
    }
  }
};