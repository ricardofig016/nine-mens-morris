import Toast from "./toast.mjs";

function error(message) {
  const toast = new Toast(message);
  toast.show();
  return false;
}

export default error;
