import { useQueue } from "discord-player";
import { Message } from "discord.js";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "resume",
  description: "Resumes the bot",
  usage: `${config.prefix}resume`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;
    queue.node.setPaused(false);
  }
} as Command;
