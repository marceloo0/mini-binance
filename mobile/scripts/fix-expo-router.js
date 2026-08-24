const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../node_modules/expo-router/build");
const prefixPattern = /\.pnpm\/expo-router@[^/]+\/node_modules\/expo-router\/src\//g;

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".d.ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (prefixPattern.test(content)) {
        content = content.replace(prefixPattern, () => {
          let rel = path.relative(dir, baseDir);
          if (!rel) rel = ".";
          if (!rel.startsWith(".")) rel = "./" + rel;
          return rel + "/";
        });
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(baseDir);
