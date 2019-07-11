import Discord from "discord.js"
const client = new Discord.Client()

client.login(process.env.DISCORD_TOKEN)

export default client
