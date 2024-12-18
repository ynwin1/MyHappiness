document.addEventListener(
    "DOMContentLoaded",
    () => {
        chrome.storage.local.get(null, function(items) {
            const table = document.getElementById("happinessTable");
            const title = document.getElementById("title-str");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            // add year to the title
            title.textContent += currentYear + " 🤗";

            const ratingsCount = new Array(6).fill(0);

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

            // fill the table with ratings from storage
            Object.keys(items).forEach(item => {
                if (item.startsWith("rating_" + currentYear.toString()) && item.length > 7) {
                    const date = new Date(item.substring(7));
                    // check if date is valid
                    if (isNaN(date.getTime())) {
                        return;
                    }
                    const month = date.getMonth();
                    const day = date.getDate();
                    const rating = items[item].rating;
                    const comment = items[item].comment;

                    const emoji = selectEmoji(rating);
                    const cellColor = selectColor(rating);

                    ratingsCount[rating] += 1;

                    if (table.rows[day] && table.rows[day].cells[month]) {
                        const cell = table.rows[day + 1].cells[month + 1];
                        cell.textContent = emoji;
                        cell.style.backgroundColor = cellColor;
                        if (comment != null && comment != "") {
                            cell.title = months[month + 1] + " " + (day + 1) + ": " + comment;
                        }
                    }
                }
            });

            // create summary at the top
            const summaryDataDiv = document.querySelector('.summary-data');
            for (let i = 1; i < ratingsCount.length; i++) {
                const ratingCount = ratingsCount[i];
                const prefixString = getSummaryPrefixString(i.toString());
                const dataString = prefixString + ratingCount;
                addSummaryData(summaryDataDiv, dataString);
            }
        });

        // function daysToFill(j, currentYear, currentMonth, currentDay) {
        //     let days = 0;
        //     // 30 days (Sept, Apr, Jun, Nov)
        //     if (j == 9 || j == 4 || j == 6 || j == 11) {
        //         days = 30 + 1; // + 1 because index starts from 1
        //     } else if (j == 2) {
        //         // check leap year
        //         if (currentYear % 4 == 0) {
        //             // leap year
        //             days = 29 + 1;
        //         } else {
        //             days = 28 + 1;
        //         }
        //     } else if (j == currentMonth) {
        //         days = currentDay;
        //     } else {
        //         days = 31 + 1;
        //     }
        //     return days;
        // }

        function addSummaryData(div, content) {
            const summaryElm = document.createElement('h3');
            summaryElm.textContent = content;
            div.appendChild(summaryElm);
        }

        function getSummaryPrefixString(index) {
            switch(index) {
                case "1": return '😭 (Very Sad) = ';
                case "2": return '😢 (Sad) = ';
                case "3": return '😐 (OK) = ';
                case "4": return '😊 (Happy) = ';
                case "5": return '😁 (Very Happy) = ';
                default: return '🤔 (IDK) = ';
            }
        }

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