import { QueueRepeatMode, useQueue } from "discord-player";
import { Message } from "discord.js";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "loop",
  description: "Set the bot to loop the current song, the queue, or none",
  usage: `${config.prefix}loop <none | track | queue>`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;

    const loopMode = message.content.split(/\s+/)[1];

    switch (loopMode) {
      case "none":
        console.log("Setting loop to", loopMode);
        queue.setRepeatMode(QueueRepeatMode.OFF);
        break;
      case "track":
        console.log("Setting loop to", loopMode);
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        break;
      case "queue":
        console.log("Setting loop to", loopMode);
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        break;
      default:
        message.channel.send("Loop mode must be one of <none | track | queue>");
        break;
    }
  }
} as Command;
