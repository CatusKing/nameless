const Discord = require('discord.js');
const token = require('./general/token.json');
const config = require('./general/config.json');

const client = new Discord.Client();
var testing = false;
if (process.argv.includes('--testing') || process.argv.includes('-t')) testing = true;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  if (msg.author.bot) return;
  const logChannel = client.channels.cache.get('823385901258375198');
  msg.mentions.members.forEach(member => {
    for(let i = 0; i < config.ownerRoles.length; ++i) {
      if (member.roles.cache.has(config.ownerRoles[i])) {
        var embed = new Discord.MessageEmbed();
        embed.setDescription(`From: ${msg.author}\nContent: ${msg.content}`);
        logChannel.send(embed);
        msg.channel.send(`Hey ${msg.author} do you mind not pinning the owners. If you need anything you can always ping the staff.`);
        msg.delete();
      }
    }
  });
});

if (testing) client.login(token.testing);
else client.login(token.main);