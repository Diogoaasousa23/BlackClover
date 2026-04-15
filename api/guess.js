import { CHARACTERS } from "../data/characters.js";

const CATEGORIES = ["squad","gender","magic","grimoire","origin","rank"];

function compare(guessChar, target) {
  return CATEGORIES.map(cat => {
    const g = guessChar[cat];
    const t = target[cat];

    if (g === t) return "correct";

    const gParts = g.split("/").map(s => s.trim());
    const tParts = t.split("/").map(s => s.trim());

    if (gParts.some(p => tParts.includes(p))) return "partial";

    return "wrong";
  });
}

export default function handler(req, res) {
  const { name } = req.body;

  const seed = Math.floor(Date.now() / 86400000);
  const target = CHARACTERS[seed % CHARACTERS.length];

  const guessChar = CHARACTERS.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );

  if (!guessChar) {
    return res.status(400).json({ error: "Invalid character" });
  }

  const result = compare(guessChar, target);

  res.status(200).json({
    correct: guessChar.name === target.name,
    result,
    data: guessChar
  });
}