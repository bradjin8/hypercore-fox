const MESSAGE = {
    CREATE_NEW_DRIVE: 'CREATE_NEW_DRIVE'
}

async function createNew() {
    let text;
    let driveName = prompt("Please enter your drive name", "");
    if (driveName == null || driveName === "") {
        text = "user cancelled the prompt"
    } else {
        text = `New drive, ${driveName} should be created`
    }
    $('#res').html(text);
    try {
        let res = await browser.runtime.sendMessage(
            {
                type: MESSAGE.CREATE_NEW_DRIVE,
                name: driveName
            }
        )
        console.log('res-page', res)
    } catch (e) {
        console.log('SendMessageError', e.message)
    }
}


$(document).ready(function () {
    createNew();
})