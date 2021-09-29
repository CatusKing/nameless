const { CommandInteraction, Client } = require("discord.js");
const { icoe } = require('../icoe.js');
const { get } = require('request');

module.exports = {
  name: 'dadjokes',
  description: 'Sends a random dad joke :D',
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    var country;
    if (interaction.options.getString('country')) country = `&country=${interaction.options.getString('country')}`;
    get(`https://icanhazdadjoke.com/`, { json: true, headers: { 'Accept': 'application/json' } }, (err, res, body) => {
      if (err) icoe(err);
      console.log(body);
    });
  },
}