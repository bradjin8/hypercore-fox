console.log('popup script');

function onNewDrive() {
    let createData = {
        url: "/new.html"
    }
    let creating = browser.tabs.create(createData)
}

function onMyLibrary() {
    let createData = {
        url: "/my_library.html"
    }
    let creating = browser.tabs.create(createData)
}

window.onload = function () {
    document.getElementById('btnNewDrive').addEventListener('click', onNewDrive)
    document.getElementById('btnMyLib').addEventListener('click', onMyLibrary)
}
