module.exports = {
  execute(client, addUserBalance, log) {
    const guild = client.guilds.cache.get('830495072876494879');
    guild.channels.cache.forEach(ch => {
      
      if (ch.type == 'GUILD_VOICE' && ch.id != '830505700269883412') {
        ch.members.forEach(member => {
          
          if (!member.voice.deaf) {
            
            if (member.user.bot) return;
            let amount = 2;
            
            if (!member.voice.mute) {
              amount += 3;
              
              if (member.voice.selfVideo) amount += 3;
              else if (member.voice.streaming) amount += 1;
            }
            addUserBalance(member.id, amount, `sitting in vc`, true);
          }
        });
      }
    });
  }
}