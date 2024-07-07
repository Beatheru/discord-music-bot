import { EmbedBuilder, Message } from "discord.js";
import { DiscordClient } from "../structures/DIscordClient";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";
import { useQueue } from "discord-player";

export default {
  name: "queue",
  description: "Shows the current queue (up to 15 tracks)",
  usage: `${config.prefix}queue`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;

    const embed = new EmbedBuilder();
    const tracks = queue.tracks.toArray();

    if (queue.currentTrack) {
      embed.addFields({
        name: `Now playing: ${queue.currentTrack.title} - ${queue.currentTrack.duration}`,
        value: `${queue.currentTrack.url}`,
        inline: false
      });
    }

    if (tracks.length === 0) {
      return;
    }

    if (tracks.length > 15) {
      for (let i = 0; i < 15; i++) {
        embed.addFields({
          name: `${tracks[i].title} - ${tracks[i].duration}`,
          value: `${tracks[i].url}`,
          inline: false
        });
      }
    } else {
      for (const track of tracks) {
        embed.addFields({
          name: `${track.title} - ${track.duration}`,
          value: `${track.url}`,
          inline: false
        });
      }
    }

    message.channel.send({ embeds: [embed] });
  }
} as Command;
