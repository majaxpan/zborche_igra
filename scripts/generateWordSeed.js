
const path = require("path");
const fs = require("fs");

const file = fs.readFileSync("C:\\Users\\panos\\PROJECTS\\zborche_igra\\src\\data\\words.js", "utf8");

const words = [...file.matchAll(/"([^"]+)"/g)].map(match => match[1]);

console.log("Total:", words.length);
console.log("Unique:", [...new Set(words)].length);

const uniqueWords = [...new Set(words)];

const sqlValues = uniqueWords
    .map(word => `('${word.toUpperCase()}', true)`)
    .join(",\n");

const sql = `
INSERT INTO words (word, daily_eligible)
VALUES
${sqlValues}
ON CONFLICT (word) DO NOTHING;
`;

fs.writeFileSync(
    path.join(__dirname, "../database/005_seed_words.sql"),
    sql,
    "utf8"
);

console.log("Seed file generated!");