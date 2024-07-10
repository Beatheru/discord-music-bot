import { Message } from "discord.js";
import download from "download";
import fs from "fs";
import path from "path";
import { Command } from "../structures/Models";
import config from "../utils/Config";

const playableFiles = [".mp3", "mp4", ".webm", ".ogg"];

const checkFileType = (file: string) => {
  const ext = path.extname(file).toLowerCase();
  return playableFiles.includes(ext);
};

export default {
  name: "upload",
  description: `Upload a file to the server so that it could be played with the "${config.prefix}clip" command`,
  usage: `${config.prefix}upload`,
  async run(message: Message) {
    const file = message.attachments?.first();
    if (!file) {
      return;
    }

    if (!checkFileType(file.name)) {
      message.delete();
      return;
    }

    const filePath = path.join(__dirname, "..", "..", "uploads");
    if (fs.existsSync(path.join(filePath, file.name))) {
      console.log("File exists");
      message.delete();
      return;
    }

    await download(file.url, filePath);
    console.log("Download complete");
    message.delete();
  }
} as Command;
