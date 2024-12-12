document.addEventListener(
    "DOMContentLoaded",
    () => {
        chrome.storage.local.get(null, function(items) {
            const table = document.getElementById("happinessTable");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            Object.keys(items).forEach(item => {
                if (item.startsWith("rating_" + currentYear.toString())) {
                    const date = new Date(item.substring(7));
                    const month = date.getMonth();
                    const day = date.getDate();
                    const rating = items[item].rating;

                    const emoji = selectEmoji(rating);

                    // month row, day col
                    while (table.rows.length <= month) {
                        let row = table.insertRow();
                        for (let i = 0; i < 31; i++) row.insertCell();
                    }

                    // Set rating
                    table.rows[month].cells[day - 1].textContent = emoji;
                }
            })
        })

        function selectEmoji(rating) {
            switch (rating) {
                case 1: return "😭";
                case 2: return "😢";
                case 3: return "😐";
                case 4: return "😊";
                case 5: return "😁";
                default: return "";
            }
        }
    }
);