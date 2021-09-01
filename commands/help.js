const { MessageEmbed } = require('discord.js');
const { prefix } = require('../general/config.json');
const { readdirSync } = require('fs');

var choices = [];
var moreChoices = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  if (choices.length < 25) choices.push({ value: file.replace('.js', ''), name: file.replace('.js', '') });
  else moreChoices.push({ value: file.replace('.js', ''), name: file.replace('.js', '') });
}
module.exports = {
	name: 'help',
	description: 'Sends the current commands',
  usage: `help [command]`,
  command: false,
  slash: true,
  options: [
    {
      type: 'STRING',
      name: 'command',
      description: 'The command you want to see more information on',
      required: false,
      choices: choices
    },
    {
      type: 'STRING',
      name: 'moreCommands',
      description: 'The command you want to see more information on',
      required: false,
      choices: moreChoices
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var embed = new MessageEmbed().setColor('#9e9d9d')
    if ((commands.has(interaction.options.getString('command')) && commands.get(interaction.options.getString('command').toLowerCase()).command) || (commands.has(interaction.options.getString('moreCommands')) && commands.get(interaction.options.getString('moreCommands').toLowerCase()).command)) {
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
  }
};