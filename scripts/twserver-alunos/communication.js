import { BASE_URL } from "../index.js";
import say from "../say.js";

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
    say(`Error registering user: ${data.error}`);
  } else {
    say("User registered successfully");
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
    say(`Error joining game: ${data.error}`);
    return null;

  } else {
    say(`Joined game successfully. Game ID: ${data.game}`);
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
    say(`Error leaving game: ${data.error}`);
  } else {
    say("Left game successfully");
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
    say(`Error notifying move: ${data.error}`);
  } else {
    say("Move notified successfully");
  }
}

// Function to update game state
export async function updateGameState(nick, game) {
  try {
    const response = await fetch(`${BASE_URL}/update?nick=${nick}&game=${game}`, {
      method: "GET",
    });

    const data = await response.json();

    console.log("Game state successfully updated:", data);
    return data;
  } catch (err) {
    return null;
  }
}


// Function to fetch the game ranking
export async function getRanking(group, size) {
  const response = await fetch(`${BASE_URL}/ranking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ group,size })
  });
  const data = await response.json();
  if (data.error) {
    say(`Error fetching ranking: ${data.error}`);
    throw new Error(data.error);
  }
  return data;
}

// Function to simulate a move
export async function makeMove(nick, password, game, square, position) {
  const cell = { square, position };
  await notifyMove(nick, password, game, cell);
}