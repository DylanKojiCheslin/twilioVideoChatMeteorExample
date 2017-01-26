import Video from 'twilio-video';

Template.videoChat.onDestroyed(function (event, template) {
  event.preventDefault();
  if (template.room) {
    template.room.disconnect();
  }
});

Template.videoChat.onCreated(function (){
   this.mutedVariable = new ReactiveVar(null);
   this.cameraDisabledVariable = new ReactiveVar(null);
});

Template.videoChat.onRendered(function (){
   this.mutedVariable.set(false);
   this.cameraDisabledVariable.set(false);
});

Template.videoChat.helpers({
  twilioVideoNotSupportedByBrowser: function(){
    return (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia)
  },
  theClientIsMuted: function(){
    return (Template.instance().mutedVariable.get())
  },
  theCameraIsDisabled: function(){
    return (Template.instance().cameraDisabledVariable.get())
  }
});

Template.videoChat.events({
  'submit #js-request-video-chat': function (event, template) {
    event.preventDefault();
    const target = event.target;
    const roomName = target.text.value;
    const userIdentifier = Random.id();
    let initAccessToken;
    let accessToken;

    initAccessToken = Meteor.call(
      "requestVideoChatAccess", roomName, userIdentifier,
      function requestVideoChatAccessCallback(error, result) {
        if (error) {
          console.log(error, error.reson);
        }
        if (result) {
          accessToken = result;
          template.client = new Video.Client(accessToken.token);
          room = template.client.connect({
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
              template.room = room;
            }
          )
        }
    })
  },
  "click #js-end-video-chat" : function (event, template){
    event.preventDefault();
    if (template.room) {
      template.room.disconnect();
    }
  },
  "click #js-mute-video-chat" : function (event, template) {
    event.preventDefault();
    if (template.room) {
      template.room.localParticipant.media.mute();
      if (template.room.localParticipant.media.isMuted) {
      template.mutedVariable.set(true);
      }
    }
  },
  "click #js-unmute-video-chat" : function (event, template){
    event.preventDefault();
    if (template.room) {
      template.room.localParticipant.media.unmute();
      if ( ! template.room.localParticipant.media.isMuted) {
      template.mutedVariable.set(false);
      }
    }
  },
  "click #js-disable-camera-video-chat": function (event, template) {
    event.preventDefault();
    if (template.room) {
      template.room.localParticipant.media.pause()
      if (template.room.localParticipant.media.isPaused) {
        template.cameraDisabledVariable.set(true);
      }
    }
  },
  "click #js-enable-camera-video-chat": function (event, template) {
    event.preventDefault();
    if (template.room) {
      template.room.localParticipant.media.unpause()
      if ( ! template.room.localParticipant.media.isPaused) {
        template.cameraDisabledVariable.set(false);
      }
    }
  }
});
