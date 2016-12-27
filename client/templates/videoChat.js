import Video from 'twilio-video';

Template.videoChat.onDestroyed(function () {
  if (room) {
    room.disconnect();
  }
});

Template.videoChat.helpers({
  twilioVideoNotSupportedByBrowser: function(){
    return (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia)
  }
});

Template.videoChat.events({
  'submit #js-request-video-chat-access': function (event) {
    event.preventDefault();
    const target = event.target;
    const roomName = target.text.value;
    let userIdendifer = Random.id();
    let returnAccessToken;
    let accessToken;
    returnAccessToken = Meteor.call(
      "requestVideoChatAccess", roomName, userIdendifer,
      function requestVideoChatAccessCallback(error, result) {
        if (error) {
          console.log(error, error.reson);
        }
        else {
          accessToken = result;
          console.log('token Obj');
          console.log(accessToken);

          const client = new Video.Client(accessToken.token);
          console.log('client obj');
          console.log(client);
          const room = client.connect({
            to: roomName
          })
          // .then(room => {participant.media.attach('#media-view')})
        }
      });
    }
  });
