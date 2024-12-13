document.addEventListener(
    "DOMContentLoaded",
    () => {
        chrome.storage.local.get(null, function(items) {
            const table = document.getElementById("happinessTable");
            const title = document.getElementById("title-str");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            const currentDay = currentDate.getDate();

            // add year to the title
            title.textContent += currentYear;

            const dayRows = 32;
            const monthCols = 13;

            // init table
            for (let i = 0; i < dayRows; i++) {
                let row = table.insertRow();
                for (let j = 0; j < monthCols; j++) {
                    row.insertCell();
                }
            }

            // init header
            // months
            const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];  // Months array includes empty string for the first cell
            for (let j = 1; j < monthCols; j++) {
                table.rows[0].cells[j].textContent = months[j];
                table.rows[0].cells[j].style.fontWeight = 'bold';
            }

            // days
            for (let i = 1; i < dayRows; i++) {
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

            for (let j = 1; j <= currentMonth; j++) {
                let daysToFill;
                if (j == currentMonth) {
                    daysToFill = currentDay;
                } else {
                    daysToFill = dayRows;
                }
                for (let i = 1; i < daysToFill; i++) {
                    table.rows[i].cells[j].textContent = selectEmoji(0);
                    table.rows[i].cells[j].style.backgroundColor = selectColor(0);
                    table.rows[i].cells[j].title = "I was so busy or so lazy, I forgot if I was happy or sad!";
                }
            }
        })

        function selectColor(rating) {
            switch (rating) {
                case "1": return 'rgb(255,0,0)';
                case "2": return 'rgb(255, 140, 0)';
                case "3": return 'rgb(255, 255, 0)';
                case "4": return 'rgb(9,255,9)';
                case "5": return 'rgb(0,162,59)';
                default: return 'rgb(128, 128, 128)';
            }
        }

        function selectEmoji(rating) {
            switch (rating) {
                case "1": return "😭";
                case "2": return "😢";
                case "3": return "😐";
                case "4": return "😊";
                case "5": return "😁";
                default: return "🤔";
            }
        }
    }
);