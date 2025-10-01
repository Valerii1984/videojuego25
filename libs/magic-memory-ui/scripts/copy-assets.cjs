/* eslint-disable */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src", "assets");
const DEST = path.join(__dirname, "..", "dist", "assets");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyDir(SRC, DEST);

// sanity-check
const mustFiles = [
  path.join(DEST, "hero", "hero1", "anim.webp"),
  path.join(DEST, "assets-exists.txt"), // опционально, если захотите класть маркер
  path.join(DEST, "sounds", "background-music.wav"),
].filter(Boolean);

for (const f of mustFiles) {
  if (!fs.existsSync(f)) {
    console.warn("[copy-assets] Missing after copy:", path.relative(DEST, f));
  }
}
