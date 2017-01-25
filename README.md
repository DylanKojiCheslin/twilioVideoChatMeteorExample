# twilioVideoChatMeteorExample
twilio video chat in meteor  

create a twilio account  

clone this repo  

install node packages:

```
meteor npm install --save twilio
```  

```
meteor npm install --save twilio-video
```


may need to install babel-runtime or meteor-node-stubs depending on your version  
the meteor console will say if it needs it  

copy example-settings.json to settings.json

create a token for video chat using your twilio account

if your confused about the token or settings file, refer to the config values in  
https://github.com/TwilioDevEd/video-quickstart-node

put your twilio account data into settings.json

run with:

```
meteor --settings settings.json
```

__turn your computers volume all the way down or you will hear loud feedback__  
go to localhost:3000  
enter a room number and hit enter  
allow video camera access in you browser if necessary  
make a new incognito window localhost:3000 on it  
type the same room number and hit enter  
video chat with your other browser instance  
mute/unmute  
then click the "end call" button  
