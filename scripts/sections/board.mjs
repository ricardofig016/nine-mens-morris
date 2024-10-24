import Section from "./section.mjs";

class Board extends Section {
  constructor() {
    if (Board.instance) {
      return Board.instance;
    }
    super("board");
    Board.instance = this;
  }

  addListeners() {}
}

export default Board;
