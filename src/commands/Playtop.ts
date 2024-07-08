import { Message } from "discord.js";
import Play from "../commands/Play";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { DiscordClient } from "../structures/DiscordClient";

export default {
  name: "playtop",
  description:
    "If the bot is already playing, queue the next song at the front of the queue",
  usage: `${config.prefix}playtop <url or search term>`,
  async run(message: Message, client: DiscordClient) {
    Play.run(message, client, { top: true });
  }
} as Command;
