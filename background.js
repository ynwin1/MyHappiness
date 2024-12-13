chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { rating, comment } = request;

    function toYYYDDMM() {
        const date = new Date();
        const pad = num => num.toString().padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // month is 0-indexed
        const day = pad(date.getDate());

        return `${year}-${month}-${day}`;
    }
    const formattedDate = toYYYDDMM();  // 'YYYY-MM-DD'

    // set comment only if it's not empty: retains previous non-empty comment
    const data = {
        rating: rating,
        comment: comment
    }

    const key = `rating_${formattedDate}`;
    let storageObject = {};
    storageObject[key] = data;

    // Store the rating in Chrome Storage
    chrome.storage.local.set(storageObject)
        .then(() => {
            console.log('Data saved:', storageObject);
            sendResponse({status: 'success'});
        })
        .catch((error) => {
            console.log("Error saving data: ", error);
            sendResponse({ status: 'error', message: error.toString()});
        });
    return true;
});