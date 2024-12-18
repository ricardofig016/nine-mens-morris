const fs = require("fs");

const ranking = (req, res, { group, size }) => {
  if (!group || !size) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Missing group or size" }));
  }

  const rankings = JSON.parse(fs.readFileSync("./data/ranking.json", "utf-8") || "[]");
  const filteredRankings = rankings
    .filter((r) => r.group == group && r.size == size)
    .sort((a, b) => b.victories - a.victories)
    .slice(0, 10);

  res.statusCode = 200;
  res.end(JSON.stringify({ ranking: filteredRankings }));
};

module.exports = ranking;
