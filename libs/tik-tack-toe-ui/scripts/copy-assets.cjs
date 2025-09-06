const fs = require("fs");
const path = require("path");

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dst, entry);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// копируем обе папки с ассетами, если они есть
const root = process.cwd();
const targets = [
  path.join(root, "assets"),
  path.join(root, "src", "lib", "assets"),
];

for (const src of targets) {
  if (fs.existsSync(src)) {
    copyDir(src, path.join(root, "dist", path.relative(root, src)));
    copyDir(
      src,
      path.join(
        root,
        "dist",
        "lib",
        path.relative(path.join(root, "src", "lib"), src) || "assets"
      )
    );
  }
}
console.log("assets copied to dist/assets and dist/lib/assets");
