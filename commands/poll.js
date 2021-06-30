const { prefix } = require('../general/config.json');
module.exports = {
	name: 'poll',
	description: 'Starts a poll',
	execute(msg, args, reply) {
    if (!args) return reply(msg.channel.id, `Can't start a poll with no arguments`, '#9e9d9d');
    const arguments = msg.content.slice(prefix.length).trim().split(' ');
    arguments.shift();
    let question = false;
    let choices = false;
    for(let i = 0; i < arguments.length; ++i) {
      if (arguments[i].endsWith('?')) {
        if (arguments[i + 1] == null) {
          question = false;
          break;
        }
        for(let j = i; j > -1; --j) {
          console.log(j);
          question = `${arguments[j]} ${question}`;
        }
        arguments.splice(0, i + 1)
        console.log(arguments.join(' '));
        break;
      }
    }
    /*
    TODO:
    - If the choices are <= 1 then questions = false
    */
    if (question == false) return reply(msg.channel.id, `You need a question and multiple options split with dashes`, '#9e9d9d');
  }
};