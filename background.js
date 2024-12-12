chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { rating, comment } = request;

    // Store the rating and comment in Chrome Storage
    chrome.storage.local.set({ rating, comment })
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