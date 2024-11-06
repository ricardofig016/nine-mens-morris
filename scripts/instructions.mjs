
export function showInstructions() {
  const modal = document.getElementById("instructions-modal");
  modal.style.display = "block"; // show
}

export function closeInstructions() {
  const modal = document.getElementById("instructions-modal");
  modal.style.display = "none"; // hide
}

export function closeOnOutsideClick(event) {
  const modal = document.getElementById("instructions-modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
export function initializeInstructionsModal() {
  const showInstructionsBtn = document.getElementById("show-instructions-btn");
  if (showInstructionsBtn) {
    showInstructionsBtn.addEventListener("click", showInstructions);
  }
  const closeModalBtn = document.getElementById("close-modal-btn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeInstructions);
  }
  window.addEventListener("click", closeOnOutsideClick);
}
