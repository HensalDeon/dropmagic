function setupDragAndDrop(dropRegionId, statusTextId, optionsBtnId, uploadBtnId, overlayId, successBtnId, pendingBtnId) {
    const dropRegion = document.getElementById(dropRegionId);
    const statusText = document.getElementById(statusTextId);
    const optionsBtn = document.getElementById(optionsBtnId);
    const uploadBtn = document.getElementById(uploadBtnId);
    const overlay = document.getElementById(overlayId);
    const successBtn = document.getElementById(successBtnId);
    const pendingBtn = document.getElementById(pendingBtnId);
    const deleteBtn = optionsBtn.querySelector(".deleteBtn");
    const viewBtn = optionsBtn.querySelector(".viewBtn");
    const closeBtn = document.getElementById("viewModalClose");
    const fileInput = document.createElement("input");
    let formObject, fileData;
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // drag and drop functionality
    dropRegion.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropRegion.classList.add("active");
    });

    dropRegion.addEventListener("dragleave", () => {
        dropRegion.classList.remove("active");
    });

    dropRegion.addEventListener("drop", (e) => {
        e.preventDefault();
        dropRegion.classList.remove("active");
        formObject = dropRegion.closest("form");

        const files = e.dataTransfer.files;

        if (files.length > 0) {
            handleFiles(files);
        }
    });
    // upload files using button triggering
    uploadBtn.addEventListener("click", function () {
        fileInput.click();
        formObject = uploadBtn.closest("form");
    });

    // image upload funcitonality for drag and drop
    fileInput.addEventListener("change", function () {
        const files = this.files;
        if (files.length > 0) {
            handleFiles(files);
            this.value = "";
        }
    });

    // delete button functionality
    deleteBtn.addEventListener("click", () => {
        formObject = deleteBtn.closest("form");
        const formData = new FormData(formObject);
        formData.append("fileDetails", JSON.stringify(fileData));
        formData.append("action", "delete");

        fetch(`${formObject.action}`, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                dropRegion.style.backgroundImage = "";
                overlay.classList.remove("gradient");
                uploadBtn.style.display = "block";
                statusText.style.display = "block";
                optionsBtn.style.display = "none";
                successBtn.style.display = "none";
                pendingBtn.style.display = "block";
                fileInput.value = "";
                console.log("Image deleted successfully:", data);
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
            });
    });

    // Modal funcitonality including view/close
    let uploadedImageDataUrl = null;
    viewBtn.addEventListener("click", () => {
        const viewModal = document.getElementById("viewModal");
        const viewImage = document.getElementById("viewImage");
        viewImage.src = uploadedImageDataUrl;
        viewModal.style.display = "block";
    });
    closeBtn.addEventListener("click", () => {
        const viewModal = document.getElementById("viewModal");
        const viewImage = document.getElementById("viewImage");
        viewImage.src = "";
        viewModal.style.display = "none";
    });

    const handleFiles = (files) => {
        const imageFile = files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            // Store the image data URL
            uploadedImageDataUrl = e.target.result;

            const formData = new FormData(formObject);
            formData.append("file", imageFile);

            fetch(`${formObject.action}`, {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    dropRegion.style.backgroundImage = "url(" + uploadedImageDataUrl + ")";
                    overlay.classList.add("gradient");
                    uploadBtn.style.display = "none";
                    statusText.style.display = "none";
                    optionsBtn.style.display = "block";
                    successBtn.style.display = "block";
                    pendingBtn.style.display = "none";
                    console.log("Image uploaded successfully:", data);
                    fileData = data;
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                });
        };

        reader.readAsDataURL(imageFile);
    };
}
window.setupDragAndDrop = setupDragAndDrop;

