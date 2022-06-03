 const onPaste = (e, cb) => {
    let pastedText = '';
    if (window.clipboardData && window.clipboardData.getData) { // IE
        pastedText = window.clipboardData.getData('Text');
    } else if (e.clipboardData && e.clipboardData.getData) {
        pastedText = e.clipboardData.getData('text/plain');
    }
    // e.target.textContent = pastedText;
    e.preventDefault();
    document.execCommand('insertText', false, pastedText)
    cb && cb();
};

export default onPaste;