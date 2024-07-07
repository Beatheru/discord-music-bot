import { useQueue } from "discord-player";
import { Message } from "discord.js";
import { DiscordClient } from "../structures/DIscordClient";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "skip",
  description: "Skip the current song",
  usage: `${config.prefix}skip`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    queue?.node.skip();
  }
} as Command;
