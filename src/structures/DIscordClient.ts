import { Client, ClientOptions, Collection, Events } from "discord.js";
import fs from "fs";
import path from "path";
import config from "../utils/Config";
import { Command } from "./Models";
import { Player } from "discord-player";

export class DiscordClient extends Client {
  public commands: Collection<string, Command> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
    if (!config.token) throw new Error("Add a token to the env file");
    this.login(config.token);
    this.registerCommands();
    const player = new Player(this);
    player.extractors.loadDefault();
    this.registerPlayerEvents(player);
    this.registerClientEvents();
  }

  private async registerCommands() {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => /.[jt]s$/.test(file));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      this.commands.set(command.default.name, command.default);
    }
  }

  private registerClientEvents() {
    this.once(Events.ClientReady, () => {
      console.log("Bot ready!");
    });

    this.on(Events.MessageCreate, async (message) => {
      if (message.content.startsWith(config.prefix)) {
        const commandName = message.content
          .split(/\s+/)[0]
          .toLowerCase()
          .substring(1);
        const command = this.commands.get(commandName);
        if (!command) {
          message.channel.send(
            `No command matching "${commandName}" was found.`
          );
          return;
        }

        try {
          message.delete();
          await command.run(message);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  private registerPlayerEvents(player: Player) {
    // Player events
    player.events.on("playerStart", (queue, track) => {
      // Emitted when the player starts to play a song
      console.log(`Playing "${track.title}" by ${track.author}`);
    });

    player.events.on("audioTrackAdd", (queue, track) => {
      // Emitted when the player adds a single song to its queue
      console.log(
        `Queued "${track.title}" by ${track.author} - ${track.duration} from ${track.raw.source?.toUpperCase()} `
      );
    });

    player.events.on("audioTracksAdd", (queue, track) => {
      queue.tracks.toArray().forEach((t) => {
        console.log(
          `Queued "${t.title}" by ${t.author} - ${t.duration} from ${t.raw.source?.toUpperCase()} `
        );
      });
    });

    // Error events
    player.events.on("error", (queue, error) => {
      // Emitted when the player queue encounters error
      console.log(`General player error event: ${error.message}`);
      console.log(error);
    });

    player.events.on("playerError", (queue, error) => {
      // Emitted when the audio player errors while streaming audio track
      console.log(`Player error event: ${error.message}`);
      console.log(error);
    });
  }
}
