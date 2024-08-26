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

// get the single player

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getSinglePlayer = `
    SELECT 
    *
    FROM
        cricket_team
    WHERE 
        player_id = ${playerId};`;
  const dbResponse = await db.get(getPlayerQuery);
  response.send(dbResponse);
});

//update player

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const getSinglePlayer = `
    UPDATE 
        cricket_team 
    SET 
        playerName = ${playerName},
        jerseyNumber = ${jerseyNumber},
        role = ${role}
  
    WHERE 
        player_id = ${playerId};`;
  await db.run(getSinglePlayer);
  response.send("Player Details Updated");
});

//delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deleteSinglePlayer = `
    DELETE FROM
        cricket_team 
    WHERE 
        player_id = ${playerId};`;
  await db.run(deleteSinglePlayer);
  response.send("Player Removed");
});

module.exports = app;
