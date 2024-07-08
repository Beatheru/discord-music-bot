import { Message } from "discord.js";
import { DiscordClient } from "./DiscordClient";

export interface Command {
  name: string;
  description: string;
  usage: string;
  run(
    message: Message,
    client: DiscordClient,
    additionalArgs?: Args
  ): Promise<void>;
}

export interface Args {
  top?: boolean;
}
