import { Message, TextChannel } from "discord.js"
import client from "./"
import Guild from "#/models/guild"
import { getCommand } from "./commands";

const CHANNEL_NAME = "emoji-arena"

export default function registerChatEvents() {
  client.on("message", async (message: Message) => {
    if (message.author.bot) { // Ignore self messages
      return
    }
    const guild = await Guild.findOne({ guild_id: message.guild.id })
    if (guild !== null) {
      if (message.channel.id === guild.broadcast_channel) {
        getCommand(message)
      }
      // Ignore other channels
    }
  })
  client.on("guildCreate", async (guild) => {
    async function createChannel() {
      return guild.createChannel(CHANNEL_NAME, {
        type: "text",
        topic: "Emoji Arena, fight to the death! (not really)"
      })
    }
    let storedGuild = await Guild.findOne({ guild_id: guild.id })
    let channel: TextChannel | undefined = undefined

    if (storedGuild === null) { // First time in the guild
      channel = await createChannel() as TextChannel
      storedGuild = await new Guild({ broadcast_channel: channel.id, guild_id: guild.id }).save()
      return guild.owner.send(`Thanks for having me in, I took the liberty to set up my own channel called ${channel.name} in your server ${guild.name}`)
    } else { // Not first time in guild
      // Attempts to find already existing channel with previous stored ID
      channel = guild.channels.array().find(({ id }) => id === storedGuild!.broadcast_channel) as TextChannel

      if (channel === undefined) { // Channel was deleted or not found
        channel = await createChannel() as TextChannel
        storedGuild.broadcast_channel = channel.id
        await storedGuild.save()
        return guild.owner.send(`Thanks for having me in, I didn't found my old channel so I took the liberty to set up a new one called ${channel.name} in ${guild.name}`)
      } else { //Nothing changed except bot joining back
        return guild.owner.send(`Thanks for having me in your server ${guild.name}`)
      }
    }
    
  })
  console.log("Chat events registered")
}