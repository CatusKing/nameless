const os = require('os');
const { version: version2 } = require('quick.db');
const { MessageEmbed, version: version1 } = require('discord.js');
const { apis } = require('../general/config.json');
module.exports = {
	name: 'bot',
	description: 'Displays information on the bot',
  usage: `bot`,
  command: true,
  aliases: ['bot'],
  slash: true,
  options: [],
  executeI(client, interaction) {
    const cpu_emoji = client.emojis.cache.get("864314312028979250");
    const pc_emoji = client.emojis.cache.get("864314369856634901");
    const hdd_emoji = client.emojis.cache.get("864314422586245130");
    const ram_emoji = client.emojis.cache.get("864314342450397204");
    const ping_emoji = client.emojis.cache.get("864314397529866261");
    const nameless_emoji = client.emojis.cache.get("864319487746113557");
    const core = os.cpus()[0];
    var api = '';
    for(let i of apis) {
      api += `${i}\n`;
    }
    const embed = new MessageEmbed().setColor('#ffffba')
      .addField('General', `**❯ ${nameless_emoji}** ${client.user.tag} (${client.user.id})\n**❯ ${pc_emoji}** ${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}hr ${Math.floor(client.uptime / 60000) % 60}min ${Math.floor(client.uptime / 1000) % 60}sec\n\u200b`)
      .addField('System', `**❯ ${ping_emoji}:** ${Math.round(client.ws.ping)}ms ws ping\n**❯ ${hdd_emoji}:** ${os.platform()},${os.release()}\n**❯ ${cpu_emoji}:**\n\u3000 ${core.model}\n\u3000 ${os.cpus().length} x ${core.speed}MHz\n**❯ ${ram_emoji}:** ${Math.floor(((os.freemem()) / 10000000)) / 100}GiB/${Math.floor(((os.totalmem()) / 10000000)) / 100}GiB\n**❯ Dependencies:**\n\u3000 Node.js: ${process.version}\n\u3000 Discord.js: v${version1}\n\u3000 os: v0.1.1\n\u3000 quick.db: v${version2}\n\u3000 Request: v2.88.2\n\u3000 googleapis: v71.0.0\n\u200b`)
      .addField('Current Apis', api)
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  },
	execute(client, msg) {
    const cpu_emoji = client.emojis.cache.get("864314312028979250");
    const pc_emoji = client.emojis.cache.get("864314369856634901");
    const hdd_emoji = client.emojis.cache.get("864314422586245130");
    const ram_emoji = client.emojis.cache.get("864314342450397204");
    const ping_emoji = client.emojis.cache.get("864314397529866261");
    const nameless_emoji = client.emojis.cache.get("864319487746113557");
    const core = os.cpus()[0];
    var api = '';
    for(let i of apis) {
      api += `${i}\n`;
    }
    const embed = new MessageEmbed().setColor('#ffffba')
      .addField('General', `**❯ ${nameless_emoji}** ${client.user.tag} (${client.user.id})\n**❯ ${pc_emoji}** ${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}hr ${Math.floor(client.uptime / 60000) % 60}min ${Math.floor(client.uptime / 1000) % 60}sec\n\u200b`)
      .addField('System', `**❯ ${ping_emoji}:** ${Math.round(client.ws.ping)}ms ws ping\n**❯ ${cpu_emoji}:**\n\u3000 ${core.model}\n\u3000 ${os.cpus().length} x ${core.speed}MHz\n**❯ ${ram_emoji}:** ${Math.floor(((os.freemem()) / 10000000)) / 100}GiB/${Math.floor(((os.totalmem()) / 10000000)) / 100}GiB\n**❯ Dependencies:**\n\u3000 Node.js: ${process.version}\n\u3000 Discord.js: v${version1}\n\u3000 os: v0.1.1\n\u3000 quick.db: v${version2}\n\u3000 Request: v2.88.2\n\u3000 googleapis: v71.0.0\n\u200b`)
      .addField('Current Apis', api)
      .setTimestamp();
    msg.channel.send({ embeds: [embed] });
  }
};