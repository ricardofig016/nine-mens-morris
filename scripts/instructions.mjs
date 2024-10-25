// Função para abrir o painel com as instruções
export function showInstructions() {
  const modal = document.getElementById("instructions-modal");
  modal.style.display = "block"; // show
}

// Função para fechar o painel de instruções
export function closeInstructions() {
  const modal = document.getElementById("instructions-modal");
  modal.style.display = "none"; // hide
}

// Função para fechar o modal ao clicar fora da área
export function closeOnOutsideClick(event) {
  const modal = document.getElementById("instructions-modal");
  if (event.target == modal) {
    modal.style.display = "none"; // Fecha o modal se clicar fora da caixa
  }
}

// Função para inicializar os eventos de clique do modal
export function initializeInstructionsModal() {
  // Associar o evento de click ao botão para dar show
  const showInstructionsBtn = document.getElementById("show-instructions-btn");
  if (showInstructionsBtn) {
    showInstructionsBtn.addEventListener("click", showInstructions);
  }

  // Associar o evento de click ao botão "X" para fechar
  const closeModalBtn = document.getElementById("close-modal-btn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeInstructions);
  }

  // Fechar o modal ao clicar fora da caixa de conteúdo
  window.addEventListener("click", closeOnOutsideClick);
}
