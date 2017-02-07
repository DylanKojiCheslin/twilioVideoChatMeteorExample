import { AccessToken } from 'twilio';
const ConversationsGrant = AccessToken.ConversationsGrant;
Meteor.methods({
    'requestVideoChatAccess' : function(roomName){
        check(roomName, String);
        let token, response;
        let grant = new ConversationsGrant();
        const randomIdentifier = Random.id();

        token = new AccessToken(
        Meteor.settings.private.twilio.accountSid,
        Meteor.settings.private.twilio.apiKey,
        Meteor.settings.private.twilio.apiKeySecret
        );
        //assign identity to token
        token.identity = randomIdentifier;

        //grant access to Video
        grant.configurationProfileSid = Meteor.settings.private.twilio.configurationProfileSid;
        token.addGrant(grant);

        response = {
          identity: token.identity,
          token: token.toJwt()
        }
        return response;
    }
});
