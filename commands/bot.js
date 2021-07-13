const os = require('os');
const { MessageEmbed, version } = require('discord.js');
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
    const embed = new MessageEmbed().setColor('#ffffba')
      .addField('General', [
        `**❯ ${nameless_emoji}** ${client.user.tag} (${client.user.id})`,
        `**❯ ${pc_emoji}** ${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}hr ${Math.floor(client.uptime / 60000) % 60}min ${Math.floor(client.uptime / 1000) % 60}sec`,
        '\u200b'
      ])
      .addField('System', [
        `**❯ ${ping_emoji}:** ${Math.round(client.ws.ping)}ms`,
        `**❯ ${hdd_emoji}:** ${os.platform()},${os.release()}`,
        `**❯ ${cpu_emoji}:**`,
        `\u3000 ${os.cups()[0].model}`,
        `\u3000 ${os.cpus().length} x ${core.speed}MHz`,
        `**❯ ${ram_emoji}:** ${Math.floor(((os.freemem()) / 10000000)) / 100}GiB/${Math.floor(((os.totalmem()) / 10000000)) / 100}GiB`,
        `**❯ Bot:**`,
        `\u3000 Node.js: ${process.version}`,
        `\u3000 Discord.js: v${version}`,
      ])
      .setTimestamp();
    msg.channel.send(embed);
  }
};