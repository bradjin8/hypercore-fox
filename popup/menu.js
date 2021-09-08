console.log('popup script');

function onNewDrive() {
    let createData = {
        url: "/new"
    }
    let creating = browser.tabs.create(createData)
}

function onMyLibrary() {
    let createData = {
        url: "/pages/my_library.html"
    }
    let creating = browser.tabs.create(createData)
}

window.onload = function () {
    document.getElementById('btnNewDrive').addEventListener('click', onNewDrive)
    document.getElementById('btnMyLib').addEventListener('click', onMyLibrary)
}
