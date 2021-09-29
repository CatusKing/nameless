const { CommandInteraction, Client } = require("discord.js");
const { icoe } = require('../icoe.js');
const { get } = require('request');

module.exports = {
  name: 'uni',
  description: 'Searches for university',
  slash: true,
  options: [
    {
      name: 'query',
      type: 'STRING',
      description: 'Searches for a university with the inputted name',
      required: true
    },
    {
      name: 'country',
      type: 'STRING',
      description: 'The country you\'re aiming for',
      required: false
    }
  ],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    var country = ('&country=' + interaction.options.getString('country', true)) || '';
    get(`http://universities.hipolabs.com/search?name=${interaction.options.getString('query')}${country}`, { json: true }, (err, res, body) => {
      console.log(body);
    });
  },
}