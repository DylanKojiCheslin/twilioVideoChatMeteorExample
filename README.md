# twilioVideoChatMeteorExample
twilio video chat in meteor

create a twilio account

clone this repo

run:

meteor npm install --save babel-runtime

meteor npm install --save twilio

meteor npm install --save twilio-video

you may need to run this depending on what version of meteor you have
it will say it needs it in the console

meteor npm install --save meteor-node-stubs


copy example-settings.json to settings.json

put your twilio account data into settings.json

run with

meteor --settings settings.json

if your confused about the settings file, refer to the config values in
https://github.com/TwilioDevEd/video-quickstart-node
