import { Message, Emoji, User, ReactionCollector, MessageReaction, Collection } from "discord.js";
import Fighter from "#/models/fighter";
import Guild from "#/models/guild";
import { prefix, confirmationEmoji, rejectionEmoji } from "./commands"
import { isArray } from "util";
import ms = require("ms");

type Executor = (message: Message, ...opts: string[]) => Promise<any>

/**
 * Attempts to recover a specific emoji in the server
 * @param message 
 * @param emojiString 
 */
async function findGuildEmoji(message: Message, emojiString: string): Promise<Emoji | null> {
  const emojiId = emojiString.match(/\d+/s)
  if (emojiId === null) {
    return null
  }
  const emoji = message.guild.emojis.find(({ id }) => id === emojiId[0])
  return emoji
}

/**
 * Lists all emojis registered on the server
 * @param message 
 */
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

/**
 * Lists all available commands
 * 
 * TODO: Make this actually work
 */
export const help: Executor = (message: Message) => {
  return message.channel.send("Maybe I'll help");
}

/**
 * Registers a new emoji for the guild
 * @param message 
 * @param param1 
 */
export const register: Executor = async (message: Message, [emojiString, name]) => {
  if (emojiString === undefined || name === undefined) {
    // Answer something about arguments IDK
    return message.channel.send(`Invalid parameters... please use \`${prefix}register <:emoji:> <name>\``)
  }
  const [emoji, guild, emojicount] = await Promise.all([
    findGuildEmoji(message, emojiString),
    Guild.findOne({ guild_id: message.guild.id }),
    Fighter.find({ guild: message.guild.id, in_service: true }).count()
  ])

  if (emoji === null) {
    return message.channel.send("I wasn't able to find the emoji you requested")
  }
  
  if (guild!.max_fighters <= emojicount) {
    return message.channel.send(`Your server has reached the maximum active fighters (${guild!.max_fighters})`)
  }

  const fighter = await Fighter.findOne({ guild: message.guild.id })
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
    guild: message.guild.id
  }).save()

  return message.channel.sendMessage(`${name} ${emoji} joins the fray!`)
}

/**
 * Retires a emoji from the guild
 * @param message 
 * @param param1 
 */
export const retire: Executor = async (message: Message, [name]) => {
  const issuer = message.author.id
  const fighter = await Fighter.findOne({ guild: message.guild.id, name: name })
  if (fighter === null) {
    // TODO: NotExist message
    return
  }
  const emoji = await findGuildEmoji(message, fighter.emoji_id)
  const confirmationMessage = await message.reply(`Are you sure you want to retire ${name} ${emoji}`)

  if (!isArray(confirmationMessage))  {
    await Promise.all([
      confirmationMessage.react(confirmationEmoji),
      confirmationMessage.react(rejectionEmoji)
    ])
    try {
      const collected = await confirmationMessage.awaitReactions((reaction, user: User) => {
        return [confirmationEmoji, rejectionEmoji].includes(reaction.emoji.name) && user.id === issuer
      }, {
          max: 1,
          time: ms("5s"),
          maxEmojis: 2,
          errors: ["time"]
        })

      const reaction = collected.first()

      switch (reaction.emoji.toString()) {
        case confirmationEmoji:
          fighter.in_service = false
          Promise.all([
            message.channel.send(`${fighter.name} ${emoji} is now retired`),
            fighter.save()
          ])
          break
        case rejectionEmoji:
          break
      }

    } catch (error) {
      message.channel.send("You didn't answered my question, let's pretend this never happened...")
    }
  }
}
