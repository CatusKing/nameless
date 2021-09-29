const { CommandInteraction, Client } = require("discord.js");
const { icoe } = require('../icoe.js');

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
      post('https://urlscan.io/api/v1/scan/', {
        json: true, headers: {
          'API-Key': apiKey2, data: {
            url: 'https://google.com',
            visibility: "public",
          }
        }
      }, (err, res, body) => {
        if (err) return icoe(err);
        console.log(body)
      })
    } else interaction.reply('No perms');
  },
}