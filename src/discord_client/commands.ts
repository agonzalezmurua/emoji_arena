import { Message } from "discord.js";
import * as executors from "./executors";

export const prefix = ">"

type Commands = {
  [k: string]: {
    matchExp: RegExp;
    exec: Function;
  };
};

const CHAT_COMMANDS: Commands = {
  "emojis": {
    matchExp: new RegExp(`${prefix}emojis`, "s"),
    exec: executors.listEmojis
  },
  "help": {
    matchExp: new RegExp(`${prefix}help`, "s"),
    exec: executors.help,
  },
  "register": {
    matchExp: new RegExp(`${prefix}register`, "s"),
    exec: executors.register
  }
}
export function getCommand(message: Message) {
  const result = Object.entries(CHAT_COMMANDS).find(([, { matchExp: reg }]) => reg.test(message.content))
  if (result !== undefined) {
    const [, { exec }] = result
    const [, ...args] = message.content.split(" ")
    exec(message, args)
  } else {
    message.channel.send(`Command not found, use ${prefix}help to get a list of available commands`)
  }
}