const os = require('os');
const { MessageEmbed } = require('discord.js');
const { apis, dependencies } = require('../general/config.json');
module.exports = {
	name: 'bot',
	description: 'Displays information on the bot',
  command: false,
  slash: true,
  options: [
    {
      name: 'option',
      type: 'STRING',
      description: 'The Information you want',
      required: true,
      choices: [
        {
          name: 'Apis',
          value: 'apis'
        },
        {
          name: 'System',
          value: 'system'
        },
        {
          name: 'General Information',
          value: 'gen'
        }
      ]
    }
  ],
  executeI(client, interaction) {
    const cpu_emoji = client.emojis.cache.get("864314312028979250");
    const pc_emoji = client.emojis.cache.get("864314369856634901");
    const hdd_emoji = client.emojis.cache.get("864314422586245130");
    const ram_emoji = client.emojis.cache.get("864314342450397204");
    const ping_emoji = client.emojis.cache.get("864314397529866261");
    const nameless_emoji = client.emojis.cache.get("864319487746113557");
    const core = os.cpus()[0];
    let api = '';
    for(let i of apis) {
      api += `- ${i}\n`;
    }
    let dep = '';
    for(let i of dependencies) {
      dep += `${i[0]}: ${i[1]}\n\u3000`;
    }
    const embed = new MessageEmbed().setColor('#ffffba').setTimestamp();
    if (interaction.options.getString('option') == 'apis') {
      embed.setDescription(`**Current Apis**\n\n${api}`)
    } else if (interaction.options.getString('option') == 'system') {
      embed.setDescription(`**System**\n\n**❯ ${ping_emoji}:** ${Math.round(client.ws.ping)}ms ws ping\n**❯ ${hdd_emoji}:** ${os.platform()},${os.release()}\n**❯ ${cpu_emoji}:**\n\u3000 ${core.model}\n\u3000 ${os.cpus().length} x ${core.speed}MHz\n**❯ ${ram_emoji}:** ${Math.floor(((os.freemem()) / 10000000)) / 100}GiB/${Math.floor(((os.totalmem()) / 10000000)) / 100}GiB\n**❯ Dependencies:**\n\u3000Node.js: ${process.version}\n\u3000${dep}`)
    } else {
      embed.setDescription(`**General**\n\n**❯ ${nameless_emoji}** ${client.user.tag} (${client.user.id})\n**❯ ${pc_emoji}** ${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}hr ${Math.floor(client.uptime / 60000) % 60}min ${Math.floor(client.uptime / 1000) % 60}sec\n\u200b`)
    }
    interaction.reply({ embeds: [embed] });
  }
};