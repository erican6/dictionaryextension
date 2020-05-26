chrome.runtime.onMessage.addListener(received);

window.word = '';

function received(request) {
    window.word = request.text;
};