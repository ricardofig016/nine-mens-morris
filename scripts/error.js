import Toast from "./toast.js";

function error(message) {
  //const audio = new Audio("./assets/audio/wrong-choice.wav");
  const toast = new Toast(message);
  //audio.play();
  toast.show();
}

export default error;
