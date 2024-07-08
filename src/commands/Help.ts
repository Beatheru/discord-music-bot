import { EmbedBuilder, Message } from "discord.js";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { DiscordClient } from "../structures/DIscordClient";

export default {
  name: "help",
  description: "Shows list of commands",
  usage: `${config.prefix}help`,
  async run(message: Message, client: DiscordClient) {
    const commands = client.commands;
    const embed = new EmbedBuilder();

    for (const [name, command] of commands) {
      embed.addFields({
        name: `${config.prefix}${name}`,
        value: `${command.description} \n Usage: ${command.usage}`,
        inline: false
      });
    }

    message.channel.send({ embeds: [embed] });
  }
} as Command;
