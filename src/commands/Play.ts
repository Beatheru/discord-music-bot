import {
  QueryType,
  SearchQueryType,
  SearchResult,
  Track,
  useMainPlayer,
  useQueue
} from "discord-player";
import { Message } from "discord.js";
import fs from "fs";
import path from "path";
import { findBestMatch } from "string-similarity";
import { DiscordClient } from "../structures/DiscordClient";
import { Args, Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "play",
  description:
    "Search for a song to play or use a url. Optionally specify the search engine. Supports youtube, spotify, soundcloud, and file for uploaded files",
  usage: `${config.prefix}play <url or search term> @<search engine>`,
  async run(message: Message, client: DiscordClient, additionalArgs?: Args) {
    if (!checkForVoice(message)) return;

    const player = useMainPlayer();
    const args = message.content.split("@");
    const engine = findBestMatch(args[1], Object.values(QueryType)).bestMatch
      .target as SearchQueryType;
    let query = args[0].split(/\s+/).slice(1).join(" ");
    if (engine === QueryType.FILE) {
      const files: string[] = [];
      const paths: string[] = [];
      const getFilesRecursively = (directory: string) => {
        const filesInDirectory = fs.readdirSync(directory);
        for (const file of filesInDirectory) {
          const absolute = path.join(directory, file);
          if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
          } else {
            files.push(file);
            paths.push(absolute);
          }
        }
      };

      getFilesRecursively(path.join(__dirname, "..", "..", "uploads"));
      const file = findBestMatch(query, files).bestMatch.target;
      if (!file) {
        console.log("No results found");
        message.channel.send("No results found");
        return;
      }

      query = path.join(__dirname, "..", "..", "uploads", file);
    }

    const search = await player.search(query, {
      searchEngine: engine || "auto"
    });
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
