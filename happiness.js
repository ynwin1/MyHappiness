document.addEventListener(
    "DOMContentLoaded",
    () => {
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const table = document.getElementById("happinessTable");
        initializeTable(table, months);

        let currentYear = new Date().getFullYear();

        renderYear(currentYear);

        const prevButton = document.getElementById("last-year");
        prevButton.addEventListener("click", () => {
            if (currentYear > new Date().getFullYear() - 2) {
                currentYear--;
                console.log("prev year: " + currentYear);
                renderYear(currentYear);
            }

            if (nextButton.disabled) {
                nextButton.disabled = false;
            }

            if (currentYear === new Date().getFullYear() - 2) {
                prevButton.disabled = true;
            }
        });

        const nextButton = document.getElementById("next-year");
        nextButton.addEventListener("click", () => {
            if (currentYear < new Date().getFullYear()) {
                currentYear++;
                console.log("next year: " + currentYear);
                renderYear(currentYear);
            }

            if (prevButton.disabled) {
                prevButton.disabled = false;
            }

            if (currentYear === new Date().getFullYear()) {
                nextButton.disabled = true;
            }
        });

        function renderYear(currentYear) {
            const title = document.getElementById("title-str");
            const summaryDataDiv = document.querySelector('.summary-data');

            // init title text
            title.textContent = "My Happiness in " + currentYear + " 🤗";

            // clear table contents
            clearTableContents(table);
            summaryDataDiv.innerHTML = "";

            chrome.storage.local.get(null, function(items) {
                const ratingsCount = new Array(6).fill(0);

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
                            if (comment != null && comment !== "") {
                                cell.title = months[month + 1] + " " + (day + 1) + ": " + comment;
                            }
                        }
                    }
                });

                // create summary at the top
                for (let i = 1; i < ratingsCount.length; i++) {
                    const ratingCount = ratingsCount[i];
                    const prefixString = getSummaryPrefixString(i.toString());
                    const dataString = prefixString + ratingCount;
                    addSummaryData(summaryDataDiv, dataString);
                }
            });
        }

        function initializeTable(table, months) {
            const dayRows = 32;
            const monthCols = 13;

            for (let i = 0; i < dayRows; i++) {
                let row = table.insertRow();
                for (let j = 0; j < monthCols; j++) {
                    row.insertCell();
                }
            }

            // Months header
            for (let j = 1; j < monthCols; j++) {
                table.rows[0].cells[j].textContent = months[j];
                table.rows[0].cells[j].style.fontWeight = "bold";
            }

            // Days header
            for (let i = 1; i < dayRows; i++) {
                table.rows[i].cells[0].textContent = i.toString();
                table.rows[i].cells[0].style.fontWeight = "bold";
            }
        }

        function clearTableContents(table) {
            for (let i = 1; i < table.rows.length; i++) {
                for (let j = 1; j < table.rows[i].cells.length; j++) {
                    const cell = table.rows[i].cells[j];
                    cell.textContent = "";
                    cell.style.backgroundColor = "";
                    cell.title = "";
                }
            }
        }

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