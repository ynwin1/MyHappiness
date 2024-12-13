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

            // Validate rating
            if (!rating) {
                alert('Please select a rating');
                return;
            }

            if (comment.length > 200) {
                alert('Only up to 200 characters allowed');
                return;
            }

            chrome.runtime.sendMessage({rating, comment}, (response) => {
                console.log('Message sent', response);
                alert(selectMessage(rating));
                window.close();
            });
        });

        function selectMessage(rating) {
            let s;
            if (rating == 1) {
                s = "Unfortunate. Tomorrow will be better!";
            } else if (rating <= 3) {
                s = "It's alright. Do your best tomorrow!";
            } else {
                s = "I'm glad you had a great day!";
            }
            return s;
        }

        function getSelectedRating() {
            const selectedButton = document.querySelector('.rating-button.selected');
            return selectedButton ? selectedButton.value : null;
        }
    }
);