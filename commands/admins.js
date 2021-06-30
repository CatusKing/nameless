module.exports = {
	name: 'admins',
	description: 'Displays the current members with admin mode',
  usage: `admins`,
	execute(client, msg, reply, admins) {
    var description = 'Admins\n';
    for (let i of admins) {
      description += `${client.users.cache.get(i).tag} - ${i}\n`
    }
    reply(msg.channel.id, description, '#9e9d9d');
	},
};