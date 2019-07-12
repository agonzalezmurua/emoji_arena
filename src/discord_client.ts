import Discord from "discord.js"
import ms = require("ms");
import Fighter from "models/fighter";

const client = new Discord.Client()

client.login(process.env.DISCORD_TOKEN)

export default client
