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
   this.previewVariable = new ReactiveVar(null);
   this.callStartedVariable = new ReactiveVar(null);
   this.mediaAttachedVarirable =  new ReactiveVar(null);
});

Template.videoChat.onRendered(function (){
   this.mutedVariable.set(false);
   this.cameraDisabledVariable.set(false);
   this.previewVariable.set(false);
   this.callStartedVariable.set(false);
   this.mediaAttachedVarirable.set(false);
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
  },
  inPreviewMode: function () {
    return (Template.instance().previewVariable.get())
  },
  theCallStarted: function(){
    return (Template.instance().callStartedVariable.get())
  },
  theMediaIsAttached: function(){
    return (Template.instance().mediaAttachedVarirable.get())
  }
});

Template.videoChat.events({
  'submit #js-request-video-chat': function (event, template) {
    event.preventDefault();
    const target = event.target;
    const roomName = target.text.value;
    let initAccessToken;
    let accessToken;

    initAccessToken = Meteor.call(
      "requestVideoChatAccess", roomName,
      function requestVideoChatAccessCallback(error, result) {
        let localMediaPreview = null;
        if (error) {
          console.log(error, error.reson);
        }
        if (result) {
          accessToken = result;
          template.client = new Video.Client(accessToken.token);
          if (template.localMedia) {
            localMediaPreview = template.localMedia;
          }else {
            template.localMedia = new Video.LocalMedia();
            Video.getUserMedia().then(
              function (mediaStream) {
                template.localMedia.addStream(mediaStream);
                template.mediaAttachedVarirable.set(true);
              },
            function (error){
              console.log('LocalMedia error', error);
            })
          }
          room = template.client.connect({
            to: roomName,
            localMedia: localMediaPreview,
            audio: ( ! template.mutedVariable.get()),
            video: ( ! template.cameraDisabledVariable.get())
          })
          .then(
            room => {
              template.localMedia.attach('#local-media');

              room.participants.forEach(function(participant) {
                participant.media.attach('#remote-media');
              });

              room.on('participantConnected', function (participant) {
                participant.media.attach('#remote-media');
              });

              room.on('participantDisconnected', function(participant) {
                participant.media.detach();
              });

              room.on('disconnected', function () {
                room.localParticipant.media.detach();
                room.participants.forEach(function(participant) {
                  participant.media.detach();
                });
              });
              template.room = room;
              template.callStartedVariable.set(true);
            }
          )
        }
    })
  },
  "click #js-end-video-chat" : function (event, template){
    event.preventDefault();
    if (template.room) {
      template.room.disconnect();
      template.callStartedVariable.set(false);
    }
  },
  "click #js-mute-video-chat" : function (event, template) {
    event.preventDefault();
    template.localMedia.mute();
    if (template.localMedia) {
      template.localMedia.mute();
      if (template.localMedia.isMuted) {
      template.mutedVariable.set(true);
      }
    }
  },
  "click #js-unmute-video-chat" : function (event, template){
    event.preventDefault();
    template.localMedia.unmute();
    if (template.localMedia) {
      template.localMedia.unmute();
      if ( ! template.localMedia.isMuted) {
      template.mutedVariable.set(false);
      }
    }
  },
  "click #js-disable-camera-video-chat": function (event, template) {
    event.preventDefault();
    if (template.localMedia) {
      const localVideoTrack = template.localMedia.removeCamera();
      template.cameraDisabledVariable.set(true);
    }
  },
  "click #js-enable-camera-video-chat": function (event, template) {
    event.preventDefault();
    if (template.localMedia) {
      template.localMedia.addCamera().then(
        function(localVideoTrack){
          if (localVideoTrack.mediaStream.active) {
            template.cameraDisabledVariable.set(false);
          }
        },
        function (error){
          console.log('LocalMedia error', error);
        }
      )
    }
  },
  "click #js-preview-camera": function (event, template) {
    event.preventDefault();
    if( (! template.client) && ( ! template.localMedia)){
      template.localMedia = new Video.LocalMedia();
      Video.getUserMedia().then(
        function (mediaStream) {
          template.localMedia.addStream(mediaStream);
          template.localMedia.attach('#local-media');
          template.previewVariable.set(true);
          template.mediaAttachedVarirable.set(true);
        },
      function (error){
        console.log('LocalMedia error', error);
      })
    }
  }
});
