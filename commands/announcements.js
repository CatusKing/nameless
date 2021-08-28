const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'announcements',
	description: 'Run in the control panel',
  usage: ``,
  command: false,
  slash: false,
	execute(client, msg) {
    const announcementChannel = client.channels.cache.get('830506698908893235');
    const eventChannel = client.channels.cache.get('830506718164287498');
    const partnerChannel = client.channels.cache.get('846376197163581490');
    if (msg.channel.id == '830503569622827069' && msg.content.includes('!announce!')) {
      if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
      msg.channel.send(`\`Is this announcement ok?\nRespond yes or no\nImage will be included\`\n\n${msg.content.replace('!announce!', '')}`)
        .then(async () => {
          const filter = m => m.author.id == msg.author.id;
          msg.channel.awaitMessages({filter, max: 1, time: 15000, errors: ['time'] })
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
                  await webhook.send({ content: msg.content.replace('!announce!', ''), name: msg.guild.name, avatar: msg.guild.iconURL() });
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
          msg.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
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
                  await webhook.send({ content: msg.content.replace('!event!', ''), name: msg.guild.name, avatar: msg.guild.iconURL() });
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
                  await webhook.send({ content: `||<@&830554664373714994>||\n${msg.content.replace('!partner!', '')}`, name: msg.guild.name, avatar: msg.guild.iconURL() });
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