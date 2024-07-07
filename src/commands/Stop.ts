import { useQueue } from "discord-player";
import { Message } from "discord.js";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "stop",
  description: "Stops playing and disconnects the bot",
  usage: `${config.prefix}stop`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    queue?.delete();
  }
} as Command;
