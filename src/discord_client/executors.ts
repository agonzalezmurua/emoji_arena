import { Message } from "discord.js";
import Fighter from "#/models/fighter";
import { prefix } from "./commands"

type Executor = (message: Message, ...opts: string[]) => Promise<any> ;

export const listEmojis: Executor = async (message: Message) => {
  const fighters = await Fighter.find({ guild: message.guild.id });
  if (fighters.length === 0) {
    return message.channel.send("You have no fighters!, register one using `--register <emoji> <name>`")
  }

  const guildFighters = fighters.map(({ emoji_id, name }) => {
    const emoji = message.guild.emojis.find(({ id }) => id === emoji_id)
    return (`\t${emoji} **${name}**\n`)
  })
  message.channel.send(guildFighters.join("\t"))
}

export const help: Executor = (message: Message) => {
  return message.channel.send("Maybe I'll help");
}

export const register: Executor = async (message: Message, [emojiString, name]) => {
  if (emojiString === undefined || name === undefined) {
    // Answer something about arguments IDK
    return message.channel.send(`Invalid parameters... please use \`${prefix}register <:emoji:> <name>\``)
  }
  const emojiId = emojiString.match(/\d+/s)
  if (emojiId === null) {
    return message.channel.send("Dude, that's not an emoji I think")
  }
  const emoji = message.guild.emojis.find(({ id }) => id === emojiId[0])
  if (emoji === null) {
    return message.channel.send("I would love to accept external emojis but I'm afraid I cant")
  }

  const fighter = await Fighter.findOne({guild: message.guild.id })
    .or([{
      emoji: emoji.id
    }, {
      name: name
    }]).exec()

  if (fighter !== null) {
    return message.channel.send("That emoji/name is already used")
  }

  await new Fighter({
    name: name,
    emoji_id: emoji.id,
    guild: message.guild.id,
    damage: 10,
    health_points: 100,
  }).save()

  message.channel.sendMessage(`${name} ${emoji} joins the fray!`)
  
}
