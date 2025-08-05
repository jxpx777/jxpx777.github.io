document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".gallery img, img.lightbox");
  if (images.length === 0) return;

  const createDialog = () => {
    const dialog = document.createElement("dialog");
    dialog.id = "lightbox";
    document.body.appendChild(dialog);
    return dialog;
  };

  const ensureDialog = () => {
    const existingDialog = document.getElementById("lightbox");
    if (existingDialog) {
      return existingDialog;
    }
    return createDialog();
  };

  const ensureDialogImg = (dialog) => {
    let img = dialog.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      dialog.appendChild(img);
    }
    return img;
  };

  const dialog = ensureDialog();
  const dialogImg = ensureDialogImg(dialog);

  images.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      dialogImg.src = img.currentSrc;
      dialogImg.alt = img.alt || "";
      dialog.showModal();
    });
  });

  dialog.addEventListener("click", () => dialog.close());
});
