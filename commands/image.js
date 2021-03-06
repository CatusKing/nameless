const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'image',
	description: 'Sends a random image',
	command: false,
  slash: true,
  options: [
    {
      type: 'BOOLEAN',
      name: 'grayscale',
      description: 'Whether to make the image grayscale',
      required: false
    },
    {
      type: 'INTEGER',
      name: 'blur',
      description: 'The level of blurring to the image',
      required: false,
      choices: [
        {
          name: '0',
          value: 0,
        },
        {
          name: '1',
          value: 1,
        },
        {
          name: '2',
          value: 2,
        },
        {
          name: '3',
          value: 3,
        },
        {
          name: '4',
          value: 4,
        },
        {
          name: '5',
          value: 5,
        },
      ]
    }
  ],
  executeI(client, interaction) {
    const seed = Math.floor(Math.random() * 5000);
    let blur = interaction.options.getInteger('blur') || 0;
    if (blur != 0) blur = `blur=${(blur * 2)}`;
    else blur = '';
    const input = interaction.options.getBoolean('grayscale') || false;
    let grayscale = '';
    if (input) grayscale = '&grayscale';
    interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(`https://picsum.photos/seed/${seed}/1920/1080?${blur}${grayscale}`) ] })
  }
};