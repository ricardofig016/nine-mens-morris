class Toast {
  constructor(message, duration = 4000) {
    this.message = message;
    this.duration = duration;
    this.toastElement = null;
  }

  show() {
    this.toastElement = document.createElement("div");
    this.toastElement.className = "toast";
    this.toastElement.textContent = this.message;
    this.toastElement.addEventListener("click", () => {
      this.hide();
    });
    document.body.appendChild(this.toastElement);

    setTimeout(() => {
      this.toastElement.classList.add("show");
    }, 100);

    setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  hide() {
    if (this.toastElement) {
      this.toastElement.classList.remove("show");
      setTimeout(() => {
        if (this.toastElement) {
          document.body.removeChild(this.toastElement);
          this.toastElement = null;
        }
      }, 300);
    }
  }
}

export default Toast;
