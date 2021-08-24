const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'bored',
	description: 'Sends a random thing to do',
	usage: `bored`,
	command: false,
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('http://www.boredapi.com/api/activity/', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setDescription(`\`\`\`\ntype: ${body.type}\nparticipants: ${body.participants}\`\`\`\n${body.activity}`) ] });
    });
  },
};