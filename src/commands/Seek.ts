import { useQueue } from "discord-player";
import { Message } from "discord.js";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "seek",
  description: "Seek to the position of the track in seconds",
  usage: `${config.prefix}seek <seconds>`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;

    const position = parseInt(message.content.split(/\s+/)[1]);
    queue.node.seek(position * 1000);
  }
} as Command;
