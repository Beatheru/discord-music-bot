import { SearchResult, Track, useMainPlayer, useQueue } from "discord-player";
import { Message } from "discord.js";
import { Args, Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";
import { DiscordClient } from "../structures/DIscordClient";

/**
 * Checks if the query is a single track in a Youtube playlist (defined by the index parameter)
 * If it is, it will still be marked as a Playlist SearchResult so instead return the single Track object
 * Otherwise, return the original SearchResult unmodified
 */
const parseSearchResult = (
  search: SearchResult,
  query: string
): SearchResult | Track => {
  if (search.hasPlaylist()) {
    const singleTrackInPlaylistMatch = query.match(/index=(\d+)$/);
    if (singleTrackInPlaylistMatch) {
      const index = Number(singleTrackInPlaylistMatch[0].slice(6)) - 1;
      return search.tracks[index];
    }
  }

  return search;
};

export default {
  name: "play",
  description:
    "Search for a song to play or use a Youtube URL (playlists supported)",
  usage: `${config.prefix}play <url or search term>`,
  async run(message: Message, client: DiscordClient, additionalArgs?: Args) {
    if (!checkForVoice(message)) return;

    const player = useMainPlayer();
    const query = message.content.split(/\s+/).slice(1).join(" ");
    const search = await player.search(query);
    if (search.isEmpty()) {
      console.log("No results found");
      message.channel.send("No results found");
      return;
    }

    const result = parseSearchResult(search, query);

    const queue = useQueue(message.guild!.id);
    if (queue?.node.isPlaying() && additionalArgs?.top) {
      if (result instanceof SearchResult) {
        result.tracks.forEach((track) => {
          queue?.insertTrack(track, 0);
        });
      } else if (result instanceof Track) {
        queue?.insertTrack(result, 0);
      }

      return;
    }

    await player.play(message.member?.voice.channel!, result, {
      nodeOptions: {
        volume: 15
      },
      connectionOptions: {
        deaf: false
      }
    });
  }
} as Command;
