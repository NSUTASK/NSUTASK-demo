function toggleDebugView() {
    document.querySelector("#debug").style.display = 'none';
}

function toggleBoardmanView() {
    document.querySelectorAll(".boardman-spacer").forEach(e => e.classList.toggle('closed'));
    document.querySelector("#boardman").classList.toggle('closed');
}

function openTaskmanView() {
    document.querySelectorAll(".taskman-spacer").forEach(e => e.classList.remove('closed'));
    document.querySelector("#taskman").classList.remove('closed');
}

function closeTaskmanView() {
    document.querySelectorAll(".taskman-spacer").forEach(e => e.classList.add('closed'));
    document.querySelector("#taskman").classList.add('closed');
}
