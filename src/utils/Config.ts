import "dotenv/config";

export default {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX || "!"
};
