// Require the necessary discord.js classes
const { Client, Intents, Options, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const path = require('node:path');
const { Player } = require("discord-player");
require('dotenv').config()

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const player = new Player(client);

//handle the event when a track starts playing
//we will display the track
player.on("trackStart", (queue, track) => {
	queue.metadata.channel.send(`now playing **${track.title}`);
});

//handle the event when a track ends
//we will display the next track if there is one
player.on("trackEnd", (queue, track) => {
	if(queue.tracks[0]){
		queue.metadata.channel.send(`${track.title} is ending. Next Up: ${queue.tracks[0]}`);
	} else {
		queue.metadata.channel.send(`Queue is now empty, use /play to add another song`);
	}
});

//handle the event when the channel which the bot is connected to is empty
//so just stop the queue
player.on("channelEmpty", (queue) => {
		queue.metadata.channel.send(`Everyone Left, and now I am sad`);
		queue.stop();
});

//handle the event when the channel which the bot is connected to encounters a connection error
player.on("connectionError", (queue, error) => {
	console.log("Connection Error occured: ");
	// console.log(queue);
	console.log(error);
});

//handle the event when the channel which the bot is connected to encounters an error
player.on("error", (queue, error) => {
	console.log("Error occured: ");
	// console.log(queue);
	console.log(error);
});

const GUILD_ID = process.env.GUILD_ID;
const APP_ID = process.env.APP_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const guildManager = client.guilds;
const channelsManager = client.channels;

//load the command files located in /commands folder
//to create a new command file, save it in the /commands folder with extension .js
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter( file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

//main method here to handle the interactions i.e slash commands from users
//so get the command name from the slash command the user entered and run that command
//will have the same name as the command file in /commands
client.on('interactionCreate', async interaction => {
	// console.log(interaction);
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if(!command) return;

	try {
		await command.execute(interaction, player);
	} catch (error){
		console.log(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});

// Login to Discord with your client's token
client.login(DISCORD_TOKEN);