module.exports = {
  execute(client) {
    const videoOnlyCh = client.channels.cache.get('831347288710316032');
    const generalCh = client.channels.cache.get('830495073430929472');
    const smallRoomCh = client.channels.cache.get('832047338456612885');
    const schoolCh = client.channels.cache.get('886267507743268964');
    const schoolVc = client.channels.cache.get('886267705286619167');
    const noMic = client.channels.cache.get('830496530091606056');
    const eventsNoMic = client.channels.cache.get('925594606677151844');
    const stageChat = client.channels.cache.get('925588565184888932');
    const date = new Date();
    let vcInUse = false;
    videoOnlyCh.members.forEach(m => {
      if (!m.voice.selfVideo && !m.user.bot) {
        m.voice.setChannel(generalCh, 'Video not enabled in the video only channel');
      }
    });
    client.guilds.cache.get('830495072876494879').members.cache.forEach((member) => {
      if (member.voice.channel != null) {
        vcInUse = true;
        if (!member.roles.cache.has('859270541713211422')) {
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('859270541713211422');
          member.roles.add(role);
        }
        if (!member.roles.cache.has('925588591609012224') && member.voice.channel.type == 'GUILD_STAGE_VOICE') {
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('925588591609012224');
          member.roles.add(role);
        }
      } else if (member.roles.cache.has('859270541713211422') || member.roles.cache.has('925588591609012224')) {
        const role1 = client.guilds.cache.get('830495072876494879').roles.cache.get('859270541713211422');
        member.roles.remove(role1);
        const role2 = client.guilds.cache.get('830495072876494879').roles.cache.get('925588591609012224');
        member.roles.remove(role2);
      }
    });
    let limit = 2;
    smallRoomCh.members.forEach((m) => {
      let yes = true;
      m.roles.cache.forEach(r => {
        if ((r.id == '866842219985502239' || r.id == '833449708013223978') && yes) {
          yes = false;
          ++limit;
        }
      });
    });
    smallRoomCh.setUserLimit(limit, 'Update because member with a keycard left or joined').then(r => {});
    if (date.getHours() + 1 >= 7 && date.getHours() + 1 <= 15  && date.getDay() != 0 && date.getDay() != 6) {
      if (schoolCh.name.includes('homework-help')) schoolCh.setName(schoolCh.name.replace('homework-help', 'school'), 'School time!');
    } else if (schoolCh.name.includes('school')) {
      schoolCh.setName(schoolCh.name.replace('school', 'homework-help'), 'No longer school time');
    }
    if (date.getHours() + 1 >= 7 && date.getHours() + 1 <= 15  && date.getDay() != 0 && date.getDay() != 6) {
      if (schoolVc.name.includes('homework')) schoolVc.setName(schoolVc.name.replace('homework', 'school'), 'School time!');
    } else if (schoolVc.name.includes('school')) {
      schoolVc.setName(schoolVc.name.replace('school', 'homework'), 'No longer school time :D');
    }
    if (!vcInUse) {
      noMic.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          message.delete();
        });
      });
      eventsNoMic.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          message.delete();
        });
      });
      stageChat.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          message.delete();
        });
      });
    }
  }
};