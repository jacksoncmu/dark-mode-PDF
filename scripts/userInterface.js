// popup.js

document.addEventListener("DOMContentLoaded", () => {
    const colorButtons = document.querySelectorAll(".color-button"); // Updated selector to target color buttons by class

    // Function to apply dark mode with the specified color
    const applyDarkMode = (color) => {
        chrome.storage.sync.set({ "slider-state": color }, () => {
            console.log("Color theme set to:", color);
            // Update button styles to reflect the active selection
            setActiveButton(color);
            // Apply dark mode immediately by executing darkMode.js
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) return; // No active tab
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["scripts/darkMode.js"]
                });
            });
        });
    };

    // Function to remove dark mode
    const removeDarkMode = () => {
        chrome.storage.sync.set({ "slider-state": null }, () => {
            console.log("Dark mode disabled");
            // Remove active state from all buttons
            clearActiveButtons();
            // Remove dark mode by executing darkMode.js
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) return; // No active tab
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["scripts/darkMode.js"]
                });
            });
        });
    };

    // Function to set the active button based on the selected color
    const setActiveButton = (color) => {
        colorButtons.forEach((button) => {
            if (button.getAttribute("data-color") === color) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    };

    // Function to clear the active state from all buttons
    const clearActiveButtons = () => {
        colorButtons.forEach((button) => {
            button.classList.remove("active");
        });
    };

    // Initialize dark mode on load
    chrome.storage.sync.get("slider-state", (data) => {
        const currentColor = data["slider-state"];
        if (currentColor) {
            applyDarkMode(currentColor);
        } else {
            // Apply default dark mode if no color is set
            const defaultColor = "#121212"; // You can choose any default color
            applyDarkMode(defaultColor);
        }
    });

    // Handle color button clicks
    colorButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const selectedColor = e.target.getAttribute("data-color");

            chrome.storage.sync.get("slider-state", (data) => {
                const currentColor = data["slider-state"];

                if (selectedColor === currentColor) {
                    // User clicked the active color button again; disable dark mode
                    removeDarkMode();
                } else {
                    // Switch to the selected color theme
                    applyDarkMode(selectedColor);
                }
            });
        });
    });
});
