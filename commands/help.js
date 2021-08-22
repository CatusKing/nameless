const { MessageEmbed } = require('discord.js');
const { prefix } = require('../general/config.json');
module.exports = {
	name: 'help',
	description: 'Sends the current commands',
  usage: `help [command]`,
  command: true,
  aliases: ['help'],
  slash: true,
  options: [
    {
      type: 'STRING',
      name: 'command',
      description: 'The command you want to see more information on',
      required: false
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var embed = new MessageEmbed().setColor('#9e9d9d')
    if (commands.has(interaction.options.getString('command')) && commands.get(interaction.options.getString('command').toLowerCase()).command) {
      embed.setTitle(commands.get(interaction.options.getString('command').toLowerCase()).name)
        .setDescription(`Description:\`\`\`\n${commands.get(interaction.options.getString('command').toLowerCase()).description}\n\`\`\`Aliases:\`\`\`\n${commands.get(interaction.options.getString('command').toLowerCase()).aliases}\`\`\`Usage:\`\`\`\n${prefix}${commands.get(interaction.options.getString('command').toLowerCase()).usage}\n\`\`\``);
    } else {
      let description = '\`\`\`';
      commands.forEach((value, key) => {
        if (value.command) description += `${value.name} - ${value.description}\n`;
      });
      description += `\`\`\``;
      embed.setTitle('Commands:').setDescription(description);
    }
    interaction.reply({ embeds : [embed] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands) {
    var embed = new MessageEmbed().setColor('#9e9d9d')
    if (commands.has(args[0]) && commands.get(args[0].toLowerCase()).command) {
      embed.setTitle(commands.get(args[0].toLowerCase()).name)
        .setDescription(`Description:\`\`\`\n${commands.get(args[0].toLowerCase()).description}\n\`\`\`Aliases:\`\`\`\n${commands.get(args[0].toLowerCase()).aliases}\`\`\`Usage:\`\`\`\n${prefix}${commands.get(args[0].toLowerCase()).usage}\n\`\`\``);
    } else {
      let description = '\`\`\`';
      commands.forEach((value, key) => {
        if (value.command) description += `${value.name} - ${value.description}\n`;
      });
      description += `\`\`\``;
      embed.setTitle('Commands:').setDescription(description);
    }
    msg.channel.send({ embeds : [embed] });
	},
};