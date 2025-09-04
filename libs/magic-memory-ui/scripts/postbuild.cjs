const fs = require("fs");
const path = require("path");

const cjs = path.join(__dirname, "..", "dist", "index.cjs");
const js = path.join(__dirname, "..", "dist", "index.js");

if (fs.existsSync(cjs)) {
  fs.copyFileSync(cjs, js);
  console.log("postbuild: dist/index.js created from index.cjs");
}
