const { CommandInteraction, Client } = require("discord.js");
const request = require("request");
const { icoe } = require('../icoe.js');
const {apiKey8} = require('../general/token.json');

module.exports = {
  name: 'test',
  description: 'Just a simple test command',
  command: true,
  execute(client, msg) {
    msg.send({ content: 'hi' })
  },
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    if (interaction.member.roles.cache.has('830496065366130709')) {
      request.get('https://api.gitter.im/v1/rooms', {headers: {Authorization: `Bearer ${apiKey8}`}}, (err, res, body) => {
        console.log(body);
      })
    } else interaction.reply('No perms');
  },
}