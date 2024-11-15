chrome.storage.sync.get(["slider-state"], (items) => {
    let colorVal = items["slider-state"] || "#d9d9d9"; // Default color if none is set
    const checkToggle = document.getElementById("darkDiv");

    if (checkToggle) {
        checkToggle.remove(); // Remove dark mode if already applied
    } else {
        const div = document.createElement("div");
        div.id = "darkDiv";

        const css = `
            position: fixed;
            pointer-events: none;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: ${colorVal};
            mix-blend-mode: difference;
            z-index: 1;
        `;
        div.setAttribute("style", css);
        document.body.appendChild(div); // Apply dark mode
    }
});
