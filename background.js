chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { rating, comment } = request;

    // Get date
    const date = new Date();
    let day = date.getDay();
    let month = date.getMonth() + 1;  // Months are 0-indexed
    let year = date.getFullYear();

    // Store the rating and comment in Chrome Storage
    chrome.storage.local.set({ day, month, year, rating, comment})
        .then(() => {
            console.log('Data saved:', {rating, comment});
            sendResponse({status: 'success'});
        })
        .catch((error) => {
            console.log("Error saving data: ", error);
            sendResponse({ status: 'error', message: error.toString()});
        });
    return true;
});