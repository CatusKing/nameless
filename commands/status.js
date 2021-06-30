module.exports = {
	name: 'status',
	description: 'Updates the bots status',
  usage: `status`,
	execute(msg, reply, updateStatus) {
    if (msg.member.roles.cache.has('830496065366130709')) {
      updateStatus();
      reply(msg.channel.id, `Updated the status`, `#9e9d9d`);
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
  }
};