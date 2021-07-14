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
	execute(client, msg) {
    const cpu_emoji = client.emojis.cache.get("864314312028979250");
    const pc_emoji = client.emojis.cache.get("864314369856634901");
    const hdd_emoji = client.emojis.cache.get("864314422586245130");
    const ram_emoji = client.emojis.cache.get("864314342450397204");
    const ping_emoji = client.emojis.cache.get("864314397529866261");
    const nameless_emoji = client.emojis.cache.get("864319487746113557");
    const core = os.cpus()[0];
    const embed = new MessageEmbed().setColor('#ffffba')
      .addField('General', [
        `**❯ ${nameless_emoji}** ${client.user.tag} (${client.user.id})`,
        `**❯ ${pc_emoji}** ${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}hr ${Math.floor(client.uptime / 60000) % 60}min ${Math.floor(client.uptime / 1000) % 60}sec`,
        '\u200b'
      ])
      .addField('System', [
        `**❯ ${ping_emoji}:** ${Math.round(client.ws.ping)}ms ws ping`,
        `**❯ ${hdd_emoji}:** ${os.platform()},${os.release()}`,
        `**❯ ${cpu_emoji}:**`,
        `\u3000 ${core.model}`,
        `\u3000 ${os.cpus().length} x ${core.speed}MHz`,
        `**❯ ${ram_emoji}:** ${Math.floor(((os.freemem()) / 10000000)) / 100}GiB/${Math.floor(((os.totalmem()) / 10000000)) / 100}GiB`,
        `**❯ Dependencies:**`,
        `\u3000 Node.js: ${process.version}`,
        `\u3000 Discord.js: v${version1}`,
        `\u3000 os: v0.1.1`,
        `\u3000 quick.db: v${version2}`,
        `\u3000 Request: v2.88.2`,
        `\u3000 googleapis: v71.0.0`,
        '\u200b'
      ])
      .addField('Current Apis', apis)
      .setTimestamp();
    msg.channel.send(embed);
  }
};