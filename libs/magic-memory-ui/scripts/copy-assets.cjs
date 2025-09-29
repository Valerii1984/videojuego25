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

const heroIndexJS = path.join(DEST, "hero", "index.js");
if (fs.existsSync(heroIndexJS)) {
  const content = fs.readFileSync(heroIndexJS, "utf8");
}
