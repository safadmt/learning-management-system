
function handleUiMessges(message, setState) {
    setState(message);
    setTimeout(() => {
        setState("")
    }, 4000);
}

export default handleUiMessges