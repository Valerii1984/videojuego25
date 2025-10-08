const fs = require("fs");
const path = require("path");

const allGamesPath = path.join(__dirname, "../package.json");

// Список пакетів, версії яких потрібно підставити
const internalPackages = ["@game/magic-memory-ui", "@game/tic-tac-toe-ui"];

// Функція для читання package.json
function readPackageJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Функція для запису package.json
function writePackageJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// Читаємо all-games
const allGames = readPackageJson(allGamesPath);

// Оновлюємо dependencies на workspace:*
internalPackages.forEach((pkgName) => {
  try {
    if (!allGames.dependencies) allGames.dependencies = {};
    allGames.dependencies[pkgName] = "workspace:*";
    console.log(`Updated ${pkgName} -> "workspace:*"`);
  } catch (err) {
    console.warn(`Failed to update ${pkgName}: ${err.message}`);
  }
});

writePackageJson(allGamesPath, allGames);

console.log("All dependencies updated successfully!");
