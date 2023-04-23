require('dotenv').config();
const express = require('express');
const app = express();
const Discord = require('discord.js');
const bodyParser = require("body-parser");

const { connectToMindsDBCloud,analyzeSpamDetection } = require("./dispatcher/mindsdb.js")


const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent
]})


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Discord bot is running!');
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!spam')) {
    const query = message.content.slice(5).trim();
    await connectToMindsDBCloud();

    const response = await analyzeSpamDetection(query);

    console.log("result----->",response);
 
    message.reply(JSON.stringify(response.rows[0]));
  }
});

client.login(process.env.TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app is listening on port ${PORT}!`);
});
