//In Case Of Emergency
const { post } = require('request');
module.exports = {
  execute(err = new Error('test')) {
    var params = {
      username: "SERVER ALERT",
      avatar_url: "",
      content: `<@473110112844644372> THE SERVER IS DYING HELP\n${error.message}`,
    }
    post(token.webhook, { method: 'POST', headers: {'Content-type': 'application/json'}, formData: JSON.stringify(params) });
  }
}
