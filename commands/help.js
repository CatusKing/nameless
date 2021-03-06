const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');

var choices = [];
var moreChoices = [];
var evenMoreChoices = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  if (choices.length < 25) choices.push({ value: file.replace(/\.js$/, ''), name: file.replace(/\.js$/, '') });
  else if (moreChoices.length < 25) moreChoices.push({ value: file.replace(/\.js$/, ''), name: file.replace(/\.js$/, '') });
  else evenMoreChoices.push({ value: file.replace(/\.js$/, ''), name: file.replace(/\.js$/, '') })
}
module.exports = {
	name: 'help',
	description: 'Sends the current commands',
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
      name: 'more-commands',
      description: 'The command you want to see more information on',
      required: false,
      choices: moreChoices
    },
    {
      type: 'STRING',
      name: 'even-more-commands',
      description: 'The command you want to see more information on',
      required: false,
      choices: evenMoreChoices
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const embed = new MessageEmbed().setColor('#9e9d9d');
    if (interaction.options.getString('command') || interaction.options.getString('more-commands') || interaction.options.getString('even-more-commands')) {
      const command = interaction.options.getString('command') || interaction.options.getString('more-commands') || interaction.options.getString('even-more-commands');
      embed.setTitle(commands.get(command).name)
        .setDescription(`Description:\`\`\`\n${commands.get(command).description}\n\`\`\``);
    } else {
      let description = '\`\`\`';
      commands.forEach((value, key) => {
        if (value.command || value.slash) description += `${value.name} - ${value.description}\n`;
      });
      description += `\`\`\``;
      embed.setTitle('Commands:').setDescription(description);
    }
    interaction.reply({ embeds : [embed] });
  }
};