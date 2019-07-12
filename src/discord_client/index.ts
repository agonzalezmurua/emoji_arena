import Discord from "discord.js"
import registerChatEvents from "./chat_events";

const client = new Discord.Client()

client.login(process.env.DISCORD_TOKEN)
client.once("ready", () => {
  registerChatEvents()
})

export default client
