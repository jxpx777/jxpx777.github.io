document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("lightbox");
  const dialogImg = dialog.querySelector("img");

  document.querySelectorAll(".gallery img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      dialogImg.src = img.currentSrc; // uses the image actually rendered
      dialogImg.alt = img.alt;
      dialog.showModal();
    });
  });
});
