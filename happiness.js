document.addEventListener(
    "DOMContentLoaded",
    () => {
        chrome.storage.local.get(null, function(items) {
            const table = document.getElementById("happinessTable");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            // init table
            for (let i = 0; i < 32; i++) {
                let row = table.insertRow();
                for (let j = 0; j < 13; j++) {
                    row.insertCell();
                }
            }

            // init header
            // months
            const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];  // Months array includes empty string for the first cell
            for (let j = 1; j < 13; j++) {
                table.rows[0].cells[j].textContent = months[j];
                table.rows[0].cells[j].style.fontWeight = 'bold';
            }

            // days
            for (let i = 1; i < 32; i++) {
                table.rows[i].cells[0].textContent = i.toString();
                table.rows[i].cells[0].style.fontWeight = 'bold';
            }

            Object.keys(items).forEach(item => {
                if (item.startsWith("rating_" + currentYear.toString())) {
                    const date = new Date(item.substring(7));
                    const month = date.getMonth();
                    const day = date.getDate();
                    const rating = items[item].rating;
                    const comment = items[item].comment;

                    const emoji = selectEmoji(rating);
                    const cellColor = selectColor(rating);

                    if (table.rows[day] && table.rows[day].cells[month]) {
                        const cell = table.rows[day + 1].cells[month + 1];
                        cell.textContent = emoji;
                        cell.style.backgroundColor = cellColor;
                        cell.title = comment;
                    }
                }
            })
        })

        function selectColor(rating) {
            const scale = rating - 1;

            const red = 255 * (1 - scale / 4);
            const green = 255 * (scale / 4);
            const blue = 0;

            return `rgb(${Math.round(red)}, ${Math.round(green)}, ${blue})`;
        }

        function selectEmoji(rating) {
            switch (rating) {
                case "1": return "😭";
                case "2": return "😢";
                case "3": return "😐";
                case "4": return "😊";
                case "5": return "😁";
                default: return "";
            }
        }
    }
);