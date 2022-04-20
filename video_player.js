import { queue, add, remove} from './queue.js';
import { newError } from './error.js';
import { newVideo } from './video.js';
import 'dotenv/config';

const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () =>{
    console.log("bot is ready");
});





client.login(process.env.DISCORD_TOKEN);