import Video from 'twilio-video';

Template.videoChat.onDestroyed(function () {
  const temp = this;
  if (temp.room) {
    temp.room.disconnect();
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
    const userIdendifer = Random.id();
    const temp = Template.instance();
    let initAccessToken;
    let accessToken;
    let room;

    initAccessToken = Meteor.call(
      "requestVideoChatAccess", roomName, userIdendifer,
      function requestVideoChatAccessCallback(error, result) {
        if (error) {
          console.log(error, error.reson);
        }
        if (result) {
          accessToken = result;
          temp.client = new Video.Client(accessToken.token);
          room = temp.client.connect({
            to: roomName
          })
          .then(
            room => {
              room.localParticipant.media.attach('#local-media');

              room.participants.forEach(function(participant) {
                participant.media.attach('#remote-media');
              });

              room.on('participantConnected', function (participant) {
                participant.media.attach('#remote-media');
              });

              room.on('disconnected', function () {
                room.localParticipant.media.detach();
                room.participants.forEach(function(participant) {
                  participant.media.detach();
                });
              });

              temp.room = room;
            }
          )
        }
    })
  },
  "click #js-end-video-chat" : function (event, Template){
    event.preventDefault();
    if (Template.room) {
      Template.room.disconnect();
    }
  }
});
