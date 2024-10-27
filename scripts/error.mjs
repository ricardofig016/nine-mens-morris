import Toast from "./toast.mjs";

function error(message) {
  var audio = new Audio('/assets/audio/wrong-choice.wav');
  const toast = new Toast(message);
  audio.play();
  toast.show();
  return false;
}

export default error;
