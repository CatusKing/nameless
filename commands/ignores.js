module.exports = {
	name: 'ignores',
	description: 'Displays the current channels ignored from auto-mod',
  usage: `ignores`,
	execute(msg, reply, ignoredCh) {
    if (msg.member.roles.cache.has('830496065366130709')) {
      var description = 'Ignored channels\n';
      for (let i of ignoredCh) {
        description += `${client.channels.cache.get(i).name} - ${i}\n`
      }
      reply(msg.channel.id, description, '#9e9d9d');
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
	},
};