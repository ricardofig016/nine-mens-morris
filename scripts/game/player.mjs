class Player {
  /**
   * Creates a new player.
   * @param {string} username - The username of the player.
   * @param {string} symbol - The symbol representing the player (e.g., X or O).
   */
  constructor(username, symbol) {
    this.username = username;
    this.symbol = symbol;
  }
}

export default Player;
