module.exports = {
	name: 'poll',
	description: 'Starts a poll',
	execute(msg, args, reply) {
    if (!args) return reply(msg.channel.id, `Can't start a poll with no arguments`, '#9e9d9d');
    const arguments = msg.content.slice(prefix.length).trim().split(' ');
    args.shift();
    let question = false;
    let choices = false;
    for(let i = 0; i < args.length; ++i) {
      if (args[i].endsWith('?')) {
        if (args[i + 1] == null) {
          question = false;
          break;
        }
        for(let j = i; i > -1; --j) {
          question = `${args[j]} ${question}`;
        }
        choices = args.splice(0, i + 1);
        console.log(choices);
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