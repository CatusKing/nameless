module.exports = {
	name: 'admin',
	description: 'Toggles admin mode',
  usage: `admin`,
	execute(msg, reply, setServerAdmins, admins) {
		if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759')) {
      if (admins.includes(msg.author.id)) {
        for (var i = 0; i < admins.length; i++) {

          if (admins[i] == msg.author.id) {
            admins.splice(i, 1);
            reply(msg.channel.id, `No longer ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
            break;
          }
        }
      } else {
        admins.push(msg.author.id);
        reply(msg.channel.id, `Ignoring you from auto mod\nid: ${msg.author.id}`, '#9e9d9d');
      }
      setServerAdmins(admins);
			return admins;
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
	},
};