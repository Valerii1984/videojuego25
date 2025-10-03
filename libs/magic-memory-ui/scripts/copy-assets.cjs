// scripts/copy-assets.cjs
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src", "assets");
const DEST = path.join(ROOT, "dist", "assets");

// используем то, что у тебя уже есть
const PLACEHOLDER_IMG = path.join(SRC, "hero", "hero.webp"); // уже в репо
const PLACEHOLDER_AUD = path.join(SRC, "hero", "hero1", "hero.m4a"); // донор звука

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

function ensureFile(srcFallback, destFile, label) {
  if (fs.existsSync(destFile) && fs.statSync(destFile).size > 0) return;
  if (srcFallback && fs.existsSync(srcFallback)) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.copyFileSync(srcFallback, destFile);
    console.warn(
      `[copy-assets] Fallback ${label} → ${path.relative(DEST, destFile)}`
    );
  } else {
    console.warn(
      `[copy-assets] MISSING ${label}: ${path.relative(DEST, destFile)}`
    );
  }
}

// 1) копируем всё из src/assets → dist/assets
copyDir(SRC, DEST);

// 2) гарантим anim.webp и hero.m4a у всех героев
for (let i = 1; i <= 6; i++) {
  const heroDir = path.join(DEST, "hero", `hero${i}`);
  ensureFile(
    PLACEHOLDER_IMG,
    path.join(heroDir, "anim.webp"),
    `hero${i}/anim.webp`
  );
  ensureFile(
    PLACEHOLDER_AUD,
    path.join(heroDir, "hero.m4a"),
    `hero${i}/hero.m4a`
  );
}

console.log("[copy-assets] done");
