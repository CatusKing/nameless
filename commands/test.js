const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: 'test',
  description: 'Just a simple test command',
  command: true,
  execute(client, msg) {
    msg.send({ content: 'hi' })
  },
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {},
}