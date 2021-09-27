//In Case Of Emergency
const { post } = require('request');
const { webhook } = require('./general/token.json')
module.exports = {
  icoe(error = new Error('test')) {
    var params = {
      username: "SERVER ALERT",
      avatar_url: "",
      content: `<@473110112844644372> THE SERVER IS DYING HELP\n${error.message}`,
    }
    post(webhook, { method: 'POST', headers: {'Content-type': 'application/json'}, body: JSON.stringify(params) });
    console.error(error);
  }
}
