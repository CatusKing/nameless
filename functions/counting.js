module.exports = {
	execute(client, db, limitedEvaluate, log, addUserBalance, count, topCount) {
    const channel = client.channels.cache.get('830661661991632907');
    const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830904166007701504');
    channel.messages.fetch({limit: 10}, {force: true}).then((messages) => {
      var error = false;
      try {var number = limitedEvaluate(messages.first().content.toLowerCase());}
      catch (err) {
        db.set(`discord.count`, 0);
        count = 0;
        messages.first().react('❌');
        messages.first().channel.send(`\`\`\`\n${err}\`\`\``);
        messages.first().channel.send(`Why...\nReset back to 1...`);
        messages.first().member.roles.add(role);
        error = true;
      }
      if (error) return;
      if (number != count + 1) {
        messages.first().channel.send(`Ugh wrong number\nThe right number was ${count + 1} not ${number}\nReset back to 1...`);
        db.set(`discord.count`, 0);
        count = 0;
        messages.first().react('❌');
        messages.first().member.roles.add(role);
      } else {
        if (count == 0) {
          db.set('discord.count', count + 1);
          ++count;
          messages.first().react('✅');
          if (messages.first().member.roles.cache.has('867226596103946250')) var mult = 1.5;
          else var mult = 1;
          if (count > topCount) {
            db.set('discord.topCount', count);
            topCount = count;
            messages.first().react('🎉');
            addUserBalance(messages.first().author.id, Math.floor(50 * mult));
            log('830503210951245865', `+${Math.floor(50 * mult)}🦴 to ${messages.first().author} for getting a new high score in counting`, '#baffc9');
          } else {
            addUserBalance(messages.first().author.id, Math.floor(5 * mult));
            log('830503210951245865', `+${Math.floor(5 * mult)}🦴 to ${messages.first().author} for counting`, '#baffc9');
          }
        } else {
          if (messages.first().author.id == messages.first(2)[1].author.id) {
            db.set(`discord.count`, 0);
            count = 0;
            messages.first().react('❌');
            messages.first().channel.send(`Why... You cant go after yourself...\nReset back to 1...`);
            messages.first().member.roles.add(role);
          } else {
            db.set('discord.count', count + 1);
            ++count;
            messages.first().react('✅');
            if (messages.first().member.roles.cache.has('867226596103946250')) var mult = 1.5;
            else var mult = 1;
            if (count > topCount) {
              db.set('discord.topCount', count);
              topCount = count;
              messages.first().react('🎉');
              addUserBalance(messages.first().author.id, Math.floor(50 * mult));
              log('830503210951245865', `+${Math.floor(50 * mult)}🦴 to ${messages.first().author} for getting a new high score in counting`, '#baffc9');
            } else {
              addUserBalance(messages.first().author.id, Math.floor(5 * mult));
              log('830503210951245865', `+${Math.floor(5 * mult)}🦴 to ${messages.first().author} for counting`, '#baffc9');
            }
          }
        }
      }
      console.log(count)
      return count;
    });
  }
};