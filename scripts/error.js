import Toast from "./toast.js";
import Board from "./sections/board.js";

function error(message) {
  console.log("Board autoPlayer:", Board.autoPlayer);
  if (Board.isAutoPlaying) {
    return false;
  }

  const audio = new Audio("./assets/audio/wrong-choice.wav");
  const toast = new Toast(message);
  audio.play();
  toast.show();
}

export default error;
