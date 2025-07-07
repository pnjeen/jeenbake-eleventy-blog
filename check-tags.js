const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BASE_DIR = path.join(__dirname, 'src');

function isInvalidTags(tags) {
  return tags && typeof tags !== 'string' && !Array.isArray(tags);
}

function scanDirForMdFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirForMdFiles(fullPath); // recursive
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const data = matter(content).data;
      if (isInvalidTags(data.tags)) {
        console.log(`❌ Invalid 'tags' in file: ${fullPath}`);
        console.log(`   tags =`, data.tags);
      }
    }
  }
}

scanDirForMdFiles(BASE_DIR);
