chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { rating, comment } = request;

    // Get date
    const date = new Date();
    const formattedDate = date.toDateString().split('T')[0];  // 'YYYY-MM-DD'

    const data = {
        rating: rating,
        comment: comment,
        lastSavedDate: date.toDateString()
    };

    const key = `rating_${formattedDate}`;
    let storageObject = {};
    storageObject[key] = data;

    // Store the rating and comment in Chrome Storage
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