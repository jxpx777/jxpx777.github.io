class LivePhotoElement extends HTMLElement {
  static #scriptLoading = null;
  static extensionRegex = /\.\w+$/;

  connectedCallback() {
    const src = this.getAttribute("src");
    if (!src) {
      console.error("<live-photo> missing required `src` attribute.");
      return;
    }

    const videoSrc = src.replace(LivePhotoElement.extensionRegex, ".mov");
    const width = this.getAttribute("width") || "320px";
    const height = this.getAttribute("height") || "320px";

    // Create declarative Live Photo container
    const container = document.createElement("div");
    container.dataset.livePhoto = "";
    container.dataset.proactivelyLoadsVideo = "";
    container.dataset.photoSrc = src;
    container.dataset.videoSrc = videoSrc;
    container.style.width = width;
    container.style.height = height;

    // Optional: clear existing content to avoid duplication
    this.innerHTML = "";
    this.appendChild(container);

    // Load the LivePhotosKit script only once
    if (!LivePhotoElement.#scriptLoading) {
      LivePhotoElement.#scriptLoading = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.apple-livephotoskit.com/lpk/1/livephotoskit.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = () => {
          console.error("Failed to load LivePhotosKit JS.");
          reject();
        };
        document.head.appendChild(script);
      });
    }
  }
}

customElements.define("live-photo", LivePhotoElement);
