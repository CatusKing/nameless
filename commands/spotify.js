const { icoe } = require("../icoe");
const spotify = require('spotify-web-api-node');

module.exports = {
	name: 'spotify',
	description: 'Manage your spotify link',
  slash: true,
  options: [
    {
      name: 'link',
      type: 'SUB_COMMAND',
      description: 'Link your spotify',
      options: [
        {
          type: 'STRING',
          name: 'token',
          description: 'The access token our website provides you',
          required: false
        }
      ]
    }, 
    {
      name: 'unlink',
      type: 'SUB_COMMAND',
      description: 'Unlink your spotify'
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    db.set(`discord.users.spotify`, )
    
    
    
    // var spotifyApi = new SpotifyWebApi({
    //   clientId: token.spotifyId,
    //   clientSecret: token.spotifySecret,
    //   redirectUri: 'http://catusking.us.to:8888/callback'
    // });
    // spotifyApi.setAccessToken('token');
    // spotifyApi.getMyCurrentPlaybackState()
    //   .then(function(data) {
    //     // Output items
    //     if (data.body && data.body.is_playing) {
    //       console.log("User is currently playing something!");
    //     } else {
    //       console.log("User is not playing anything, or doing so in private.");
    //     }
    //   }, function(err) {
    //     console.log('Something went wrong!', err);
    //   });
      
  }
};