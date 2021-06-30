const request = require('request');
module.exports = {
	name: 'advice',
	description: 'Gives funky advice',
  usage: `advice`,
	execute(msg, reply) {
    request(`https://api.adviceslip.com/advice`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      reply(msg.channel.id, body.slip.advice, '#9e9d9d');
    });
  }
};