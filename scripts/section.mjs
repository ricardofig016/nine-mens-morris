class Section {
  constructor(name) {
    this.name = name;
    this.addListeners();
  }

  addListeners() {}

  /**
   * shows the section and hides all others
   */
  load() {
    // hide all sections
    document.querySelectorAll("section").forEach((section) => {
      section.hidden = true;
    });

    // show the specified section
    const section = document.querySelector(`#${this.name}-section`);
    if (section) {
      section.hidden = false;
    }

    // activate all header buttons
    document.querySelectorAll(".header-btn").forEach((button) => {
      button.classList.add("active");
    });

    // deactivate the specified section's header button
    const button = document.querySelector(`#to-${this.name}-button`);
    if (button) {
      button.classList.remove("active");
    }
  }
}

export default Section;
