import { GatewayIntentBits } from "discord.js";
import { DiscordClient } from "./structures/DIscordClient";

export const Client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});
