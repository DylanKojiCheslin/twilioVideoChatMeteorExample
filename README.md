# twilioVideoChatMeteorExample
twilio video chat in meteor

create a twilio account

clone this repo

run:

meteor npm install --save babel-runtime
meteor npm install --save meteor-node-stubs

may need to install babel-runtime/meteor-node-stubs depending on your version
in the meteor console will say if it needs it

meteor npm install --save twilio

meteor npm install --save twilio-video

copy example-settings.json to settings.json

put your twilio account data into settings.json

run with

meteor --settings settings.json

if your confused about the settings file, refer to the config values in
https://github.com/TwilioDevEd/video-quickstart-node

go to localhost:3000
enter a room number and hit enter
allow video camera access in you browser if necessary
make a new incognito window go to localhost:3000 on it
mute your volume or you will hear a lot of feedback
enter the same room number
video chat with your self then click the "end call" button when your done
