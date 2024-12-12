chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { rating, comment } = request;

    // Store the rating and comment in Chrome Storage
    chrome.storage.local.set({ rating, comment }, () => {
        console.log('Data saved:', { rating, comment });
    });
});