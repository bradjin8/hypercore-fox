const END_POINT = 'http://127.0.0.1:8338'
const MESSAGE = {
    CREATE_NEW_DRIVE: 'CREATE_NEW_DRIVE',
    READ_DRIVE: 'READ_DRIVE'
}
const newDrive = async (name) => {
    let res = await axios.put(`${END_POINT}/manage`, {name})
    const {status, data, error} = res
    console.log('data', data)
    return data
}

async function handleMessage(message, sender, sendResponse) {
    console.log('handleMessage', message, sender, sendResponse)
    const {type, name} = message
    console.log('name', name)
    if (type === MESSAGE.CREATE_NEW_DRIVE) {
        const res = await newDrive(name)
        return sendResponse(res)
    }
    else if (type === MESSAGE.READ_DRIVE) {

        return sendResponse(true)
    }
    sendResponse(null)
}

if (!browser.runtime.onMessage.hasListener(handleMessage)) {
    browser.runtime.onMessage.addListener(handleMessage);
    console.log('handle message added')
}

console.log('hypercore-fox-extension loaded');
