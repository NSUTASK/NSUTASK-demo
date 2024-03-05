function toggleDebugView() {
    document.querySelector("#debug").style.display = 'none';
}

function toggleBoardmanView() {
    document.querySelectorAll(".boardman-spacer").forEach(e => e.classList.toggle('closed'));
    document.querySelector("#boardman-wrapper").classList.toggle('closed');
}

function openTaskmanView() {
    document.querySelectorAll(".taskman-spacer").forEach(e => e.classList.remove('closed'));
    document.querySelector("#taskman-wrapper").classList.remove('closed');
}

function closeTaskmanView() {
    document.querySelectorAll(".taskman-spacer").forEach(e => e.classList.add('closed'));
    document.querySelector("#taskman-wrapper").classList.add('closed');
}
