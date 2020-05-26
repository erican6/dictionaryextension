window.addEventListener('mouseup', select);

function select() {
    let selected = window.getSelection().toString();
    if(selected.length>0) {
        let message = {
            text: selected
        };
        chrome.runtime.sendMessage(message);
    };
};