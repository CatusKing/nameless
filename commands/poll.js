const { choicesEmojis } = require('../general/config.json');
const { icoe } = require('../icoe');
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
    {
      name: 'duration',
      type: 'INTEGER',
      description: 'The amount of minutes to run the poll',
      required: false
    },
  ],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    var footer = '', description = '', options = [], duration = interaction.options.getInteger('duration') || 1;
    if (duration < 1 || duration > 120) return interaction.reply('Polls cant be any longer then two hours');
    interaction.options.data.forEach((value) => {
      if (value.type == 'STRING' && value.name.startsWith('option')) {
        footer += `${options.length}-0,`;
        description += `${choicesEmojis[options.length]} - ${value.value}\n`;
        options.push(new MessageButton().setCustomId(`${options.length}^`).setEmoji(choicesEmojis[options.length]).setStyle('SECONDARY'));
      }
    });
    interaction.reply({ components: [new MessageActionRow().addComponents(options)], embeds: [new MessageEmbed().setDescription(`**${interaction.options.getString('question')}**\n\`\`\`${description}\`\`\``).setColor('#9e9d9d').setFooter(footer).setImage('https://823380896686014505.10.stop')] });
    setTimeout(() => {
      interaction.fetchReply().then(reply => {
        var greatest = ['-1', -1];
        reply.embeds[0].footer.text.split(',').forEach((value) => {
          if (Number.isNaN(Number(value.split('-')[1]))) {}
          else {
            if (Number(value.split('-')[1]) > greatest[1]) {
              greatest[0] = value.split('-')[0];
              greatest[1] = Number(value.split('-')[1]);
            }
          }
        });
        reply.edit({ embeds: [reply.embeds[0].setFooter('over').setTitle(`${choicesEmojis[greatest[0]]} wins!`)], components: [] })
      }).catch(err => icoe(err));
    }, duration * 1000);
  },
  button: true,
  buttonId: '^',
  executeB(client = new Client(), interaction = new ButtonInteraction()) {
    var footer = '';
    if (interaction.message.embeds[0].footer.text == 'over') return;
    var voted = false;
    console.log(interaction.message.embeds[0].image.url);
    interaction.message.embeds[0].image.url.replace('https://', '').replace('.stop', '').split('.').forEach((user) => {
      if (user.includes(interaction.member.id)) voted = user.split('#')[1];
    });
    interaction.message.embeds[0].footer.text.split(',').forEach((value) => {
      if (Number.isNaN(Number(value.split('-')[1]))) {}
      else {
        var temp;
        if (interaction.customId.startsWith(value.split('-')[0])) temp = `${value.split('-')[0]}-${Number(value.split('-')[1]) + 1},`;
        else temp = `${value},`;
        if (interaction.customId.startsWith(voted)) {
          footer += `${value},`;
        } else if (value.split('-')[0] == voted) {
          footer += `${value.split('-')[0]}-${Number(value.split('-')[1]) - 1},`;
        } else {
          footer += temp;
        }
      }
    });
    interaction.update({ embeds: [interaction.message.embeds[0].setFooter(footer).setImage(interaction.message.embeds[0].image.url.replace('.stop', `.${interaction.member.id}.stop`))] });
  }
};