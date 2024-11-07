class Section {
  constructor(name) {
    this.name = name;
    this.addListeners();
  }

  /**
   * adds event listeners to the section's elements the first time it is loaded (to prevent duplicate listeners)
   */
  addListeners() {}

  /**
   * shows the section and hides all others
   */
  load() {
    // hide all sections
    document.querySelectorAll("section").forEach((section) => {
      section.classList.add("hidden");
    });

    // show the specified section
    const section = document.querySelector(`#${this.name}-section`);
    if (section) {
      section.classList.remove("hidden");
    }

    // activate all header buttons
    document.querySelectorAll(".header-btn").forEach((button) => {
      button.classList.add("active");
    });

    // deactivate the specified section's header button
    const button = document.querySelector(`#to-${this.name}-button`);
    if (button) {
      try{var type = document.querySelector(`#to-board-button-${type}`);}catch{}
      button.classList.remove("active");
    }
  }
}

export default Section;
