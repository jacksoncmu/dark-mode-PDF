chrome.storage.sync.get(["slider-state"], (items) => {
    const colorVal = items["slider-state"]; // May be undefined or a color value
    const darkDiv = document.getElementById("darkDiv");

    if (colorVal) {
        if (darkDiv) {
            // Update the background color if dark mode is already applied
            darkDiv.style.backgroundColor = colorVal;
        } else {
            // Create the dark mode overlay
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
                z-index: 9999;
            `;
            div.setAttribute("style", css);
            document.body.appendChild(div); // Apply dark mode
        }
    } else {
        // Remove dark mode if no color is set
        if (darkDiv) {
            darkDiv.remove();
        }
    }
});
