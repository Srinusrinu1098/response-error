const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDbToServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server successfully running :http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbToServer();

app.get("/players/", async (request, response) => {
  const getDbQuery = `
    SELECT 
    *
    FROM 
    cricket_team;`;

  const playersDetails = await db.all(getDbQuery);
  response.send(playersDetails);
});

// now lets add a player

app.post("/player/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const getPlayer = `
  INSERT INTO 
    cricket_team (playerName, jerseyNumber, role) 
  VALUES 
  (
    '${playerName}',
    '${jerseyNumber}',
    '${role}'
  );`;

  const dbResponse = await db.run(getPlayer);
  const playerId = dbResponse.lastID;
  response.send({ playerId: playerId });
});
