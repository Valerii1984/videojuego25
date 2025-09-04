// scripts/copy-assets.cjs
const fs = require("fs");
const path = require("path");

const from = path.resolve(__dirname, "../src/assets");
const to1 = path.resolve(__dirname, "../dist/assets");
const to2 = path.resolve(__dirname, "../dist/lib/assets"); // <- важно для относительных путей из dist/lib/screens/*.js

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(from, to1);
copyDir(from, to2);

console.log("assets copied to dist/assets and dist/lib/assets");
