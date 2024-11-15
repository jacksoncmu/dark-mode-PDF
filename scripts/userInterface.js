document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.storage.sync.get(["checkbox-state", "slider-state"], (items) => {
            const checkboxState = items["checkbox-state"];
            const selectedColor = items["slider-state"];

            // Update the checkbox state
            const checkbox = document.getElementById("auto-dark");
            if (checkboxState !== undefined) {
                checkbox.checked = checkboxState;
            }

            // Update button active state
            if (selectedColor) {
                const buttons = document.querySelectorAll("#color-buttons button");
                buttons.forEach((button) => {
                    if (button.getAttribute("data-color") === selectedColor) {
                        button.classList.add("uk-button-primary"); // Highlight the selected button
                    } else {
                        button.classList.remove("uk-button-primary");
                    }
                });
            }

            // Add event listeners for buttons
            const colorButtons = document.querySelectorAll("#color-buttons button");
            colorButtons.forEach((button) => {
                button.addEventListener("click", (e) => {
                    const color = e.target.getAttribute("data-color");
                    chrome.storage.sync.set({ "slider-state": color }, () => {
                        console.log("Color theme set to:", color);

                        // Update button states
                        colorButtons.forEach((btn) => btn.classList.remove("uk-button-primary"));
                        e.target.classList.add("uk-button-primary");
                    });
                });
            });

            checkbox.addEventListener("change", (e) => {
                chrome.storage.sync.set({ "checkbox-state": e.target.checked }, () => {
                    console.log("Auto dark mode set to:", e.target.checked);
                });
            });
        });
    });
    const colorButtons = document.querySelectorAll("#color-buttons button");

        colorButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const selectedColor = e.target.getAttribute("data-color");

                // Save the selected color in storage
                chrome.storage.sync.set({ "slider-state": selectedColor }, () => {
                    console.log("Color theme set to:", selectedColor);

                    // Apply dark mode immediately
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        const tabId = tabs[0].id;
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ["scripts/darkMode.js"]
                        });
                    });
                });
            });
        });
});
