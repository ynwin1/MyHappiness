// At the top of your index.js file

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const ratingButtons = document.querySelectorAll('.rating-button');
        const commentBox = document.getElementById("comment-box");
        const saveButton = document.getElementById("save-button");

        ratingButtons.forEach(button => {
            button.addEventListener(
                'click',
                () => {
                    saveButton.disabled = false;
                });
        });

        saveButton.addEventListener('click',
            () => {
                const rating = getSelectedRating();
                const comment = commentBox.value;
                // Send the rating and comment to background script
                chrome.runtime.sendMessage({rating, comment});
            });

        function getSelectedRating() {
            const selectedButton = document.querySelector('.rating-button.selected');
            return selectedButton.value;
        }
    }
);