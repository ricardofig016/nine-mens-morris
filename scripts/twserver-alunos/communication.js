import { BASE_URL } from "../index.js";
import error from "../error.js";

// Function to handle register request
export async function registerUser(nick, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nick, password })
  });
  const data = await response.json();
  if (data.error) {
    error(`Error registering user ${data.error}`);
  } else {
    error("User registered successfully");
  }
}

// Function to handle join request
export async function joinGame(group, nick, password, size) {
  const response = await fetch(`${BASE_URL}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ group, nick, password, size })
  });
  const data = await response.json();
  if (data.error) {
    error(`Error joining game: ${data.error}`);
    return null;

  } else {
    error(`Joined game successfully. Game ID: ${data.game}`);
    return data.game;
  }
}

// Function to leave the game
export async function leaveGame(nick, password, game) {
  const response = await fetch(`${BASE_URL}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nick, password, game })
  });
  const data = await response.json();
  if (data.error) {
    error(`Error leaving game: ${data.error}`);
  } else {
    error("Left game successfully");
  }
}

// Function to notify a move to the server
export async function notifyMove(nick, password, game, cell) {
  const response = await fetch(`${BASE_URL}/notify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nick, password, game, cell })
  });
  const data = await response.json();
  if (data.error) {
    error(`Error notifying move: ${data.error}`);
  } else {
    error("Move notified successfully");
  }
}

// Function to update game state
export async function updateGameState(nick, game) {
  const response = await fetch(`${BASE_URL}/update?nick=${nick}&game=${game}`, {
    method: "GET",
  });
  const data = await response.json();
  if (data.error) {
    error(`Error updating game state: ${data.error}`);
  } else {
    error("Game state updated: ${data}");
  }
}

// Function to fetch the game ranking
export async function getRanking(group, size) {
  const response = await fetch(`${BASE_URL}/ranking?group=${group}&size=${size}`);
  const data = await response.json();
  if (data.error) {
    error(`Error fetching ranking: ${data.error}`);
  } else {
    error("Game Ranking: ${data.ranking}");
  }
}

// Function to simulate a move
export async function makeMove(nick, password, game, square, position) {
  const cell = { square, position };
  await notifyMove(nick, password, game, cell);
}

/* // Example of usage
async function playGame() {
  const group = 99;
  const nick1 = "zp";
  const nick2 = "jpleal";
  const password1 = "secret";
  const password2 = "another";
  const size = 3;

  // Register users (if needed)
  await registerUser(nick1, password1);
  await registerUser(nick2, password2);

  // Join game
  await joinGame(group, nick1, password1, size);
  await joinGame(group, nick2, password2, size);

  // Update game state
  const gameId = "fa93b40";  // Example game ID, should be returned by joinGame
  await updateGameState(nick1, gameId);
  
  // Notify move
  await makeMove(nick1, password1, gameId, 0, 0);  // Example move

  // Get ranking
  await getRanking(group, size);

  // Leave game
  await leaveGame(nick1, password1, gameId);
  await leaveGame(nick2, password2, gameId);
}

playGame();*/