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
  'submit #js-request-video-chat': function (event) {
    event.preventDefault();
    const target = event.target;
    const roomName = target.text.value;
    let userIdendifer = Random.id();
    let initAccessToken;
    let accessToken;
    let client;
    let room;
    //client created and video accessed
    initAccessToken = Meteor.call(
      "requestVideoChatAccess", roomName, userIdendifer,
      function requestVideoChatAccessCallback(error, result) {
        if (error) {
          console.log(error, error.reson);
        }
        if (result) {
          accessToken = result;
          client = new Video.Client(accessToken.token);
          room = client.connect({
            to: roomName
          })
          .then(
            room => {
              room.localParticipant.media.attach('#local-media');
            }
          )
        }
    })
  }
});
