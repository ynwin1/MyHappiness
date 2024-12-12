document.addEventListener(
    "DOMContentLoaded",
    () => {
        const ratingButtons = document.querySelectorAll('.rating-button');
        const commentBox = document.getElementById("comment-box");
        const saveButton = document.getElementById("save-button");

        // Add selection mechanism for rating buttons
        ratingButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove selected class from all buttons
                ratingButtons.forEach(btn => btn.classList.remove('selected'));
                // Add selected class to clicked button
                button.classList.add('selected');
                saveButton.disabled = false;
            });
        });

        saveButton.addEventListener('click', () => {
            const rating = getSelectedRating();
            const comment = commentBox.value.trim();

            // Validate rating and comment
            if (!rating) {
                alert('Please select a rating');
                return;
            }

            if (comment.length > 100) {
                alert('Only up to 100 characters allowed');
                return;
            }

            chrome.runtime.sendMessage({rating, comment}, (response) => {
                console.log('Message sent', response);
                alert("You just rated your day! Thank you!");
                window.close();
            });
        });

        function isNewDay() {
            const date = new Date();
            const currentHour = date.getHours();
            return currentHour >= 17;
        }

        function getSelectedRating() {
            const selectedButton = document.querySelector('.rating-button.selected');
            return selectedButton ? selectedButton.value : null;
        }
    }
);