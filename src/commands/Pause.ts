import { useQueue } from "discord-player";
import { Message } from "discord.js";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "pause",
  description: "Pauses the bot",
  usage: `${config.prefix}pause`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;
    queue.node.setPaused(true);
  }
} as Command;
