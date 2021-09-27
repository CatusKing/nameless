const { choicesEmojis } = require('../general/config.json');
const { MessageEmbed, CommandInteraction, Client, ButtonInteraction, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
  name: 'poll',
  description: 'Starts a poll',
  slash: true,
  options: [
    {
      name: 'question',
      type: 'STRING',
      description: 'The question for the poll',
      required: true
    },
    {
      name: 'option-1',
      type: 'STRING',
      description: 'The first option for the poll',
      required: true
    },
    {
      name: 'option-2',
      type: 'STRING',
      description: 'The second option for the poll',
      required: true
    },
    {
      name: 'option-3',
      type: 'STRING',
      description: 'The third option for the poll',
      required: false
    },
    {
      name: 'option-4',
      type: 'STRING',
      description: 'The fourth option for the poll',
      required: false
    },
    {
      name: 'option-5',
      type: 'STRING',
      description: 'The fifth option for the poll',
      required: false
    },
  ],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    var footer = '', description = '', options = [];
    interaction.options.data.forEach((value) => {
      if (value.type == 'STRING' && value.name.startsWith('option')) {
        footer += `${options.length}-0,`;
        description += `${choicesEmojis[options.length]} - ${value.value}\n`;
        options.push(new MessageButton().setCustomId(`${options.length}^`).setEmoji(choicesEmojis[options.length]).setStyle('SECONDARY'));
      }
    });
    interaction.reply({ components: [new MessageActionRow().addComponents(options)], embeds: [new MessageEmbed().setDescription(`**${interaction.options.getString('question')}**\n\`\`\`${description}\`\`\``).setColor('#9e9d9d').setFooter(footer)] });
    setTimeout(() => {
      interaction.followUp('wowie');
    }, 5000);
  },
  button: true,
  buttonId: '^',
  executeB(client = new Client(), interaction = new ButtonInteraction()) {
    var footer = '';
    interaction.message.embeds[0].footer.text.split(',').forEach((value) => {
      if (interaction.customId.startsWith(value.split('-')[0])) footer += `${value.split('-')[0]}-${Number(value.split('-')[1]) + 1},`;
      else footer += `${value},`;
    });
    interaction.update({ embeds: [interaction.message.embeds[0].setFooter(footer)] });
  }
};