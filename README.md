# Discord-Youtube-Bot
A Discord bot that utilizes discord.js and discord-player.js libraries to play music from YouTube, Spotify and SoundCloud streams only.

It features the newer slash commands for user to interact with the bot
Such commands include:
  Jump (skip to the track you want to play)
  Pause (pauses the currently playing song)
  Play (takes a search parameter and fetchs that song to play)
  Remove (removes a track from the queue)
  Resume (resumes a track)
  Show Queue (shows the state of all tracks in the queue)
  Shuffle (shuffles all the tracks in the queue in random order)
  Skip (skips the currently playing track)
  Stop (stops the bot from playing any tracks and clears the queue)
  
 Setup Instructions:
 
install Node.js v 18
https://nodejs.org/en/

install python
https://www.python.org/downloads/

 clone or download this repo
 
 If you dont already have an application created in the Discord Developer Portal, do so here
 https://discord.com/developers/applications
 
 Documentation for basic bot setup
 https://discord.com/developers/docs/intro

To create the bot, go to the Bot tab and click on create Bot
Click on Rest Token and copy this value in a notepad for later use

Create a file called .env in the root folder in the project
in the .env file, create an entry called DISCORD_TOKEN=The Token You copied earlier

Repeat this process for the APP_ID and GUILD_ID

Add the bot to the discord server by going to the discord developer portal under OAuth2 and click URL Generator
pick bot
then pick the following Bot Permissions
Manager Channels, Manage Webhooks, Read Messages/ View Channels, Manage Events, Send Messages, Use Slash Commands, Connect, Move Members, Use Voice Activity, Speak

A url will be generated, copy this link to your web browser to add this bot to one of your discord servers

now where you downloaded this project, run the following command in the command line

npm install

If everything works correctly, you should be able to start up the bot by typing "npm start" without quotes and the bot it will say "Ready!" once its up and running
