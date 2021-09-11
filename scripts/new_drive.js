const MESSAGE = {
  CREATE_NEW_DRIVE: 'CREATE_NEW_DRIVE'
}

async function createNew() {
  let text;
  let driveName = prompt("Please enter your drive name", "");
  if (driveName == null || driveName === "") {
    text = "user cancelled the prompt"
    window.location.href = '/my_library.html'
  } else {
    text = `New drive, ${driveName} will be created in a few seconds.`
  }
  $('#res').html(text);
  try {
    let res = browser.runtime.sendMessage(
      {
        type: MESSAGE.CREATE_NEW_DRIVE,
        name: driveName
      }
    )
    res.then((res)=>{
      console.log('res-page', res)
      window.location.href = `/view.html?name=${driveName}`
    }, (e) => {
      console.log('SendMessageError', e.message)
    })
  } catch (e) {
    console.log('SendMessageError', e.message)
  }
}


$(document).ready(function () {
  createNew();
})
