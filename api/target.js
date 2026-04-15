import { CHARACTERS } from "../data/characters.js";

export default function handler(req, res) {
  const seed = Math.floor(Date.now() / 86400000);
  const target = CHARACTERS[seed % CHARACTERS.length];

  res.status(200).json({
    hint: `This character belongs to ${target.squad}`
  });
}