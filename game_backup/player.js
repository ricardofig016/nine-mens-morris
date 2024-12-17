class Player {
  /**
   * Creates a new player.
   * @param {string} username - The name of the player.
   * @param {string} symbol - The symbol representing the player, should be "X" or "O".
   * @param {number} pieceAmount - The number of pieces the player has.
   */
  constructor(username, symbol, pieceAmount) {
    this.username = username;
    this.symbol = symbol;
    this.inHandPieces = pieceAmount;
    this.alivePieces = 0;
    this.takenPieces = 0;
  }

  toString() {
    let str = `\t${this.username} (${this.symbol}):\n`;
    str += `\t\tIn hand: ${this.inHandPieces} pieces\n`;
    str += `\t\tAlive: ${this.alivePieces} pieces\n`;
    str += `\t\tDead: ${this.takenPieces} pieces\n`;
    return str;
  }
}

export default Player;
