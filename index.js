const {
    Client
} = require('discord.js');

// import {Client } from  'discord.js';
const dotenv = require('dotenv/config');

const bot = new Client();
const token = dotenv.process.env.DISCORD_TOKEN;
const PREFIX = '!';
const version = '1.2';





bot.on('ready', () => {
        console.log('Bot is online!')
});