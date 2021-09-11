const END_POINT = 'http://127.0.0.1:8338'
const MESSAGE = {
  CREATE_NEW_DRIVE: 'CREATE_NEW_DRIVE',
  READ_DRIVE_DIR: 'READ_DRIVE_DIR',
  READ_DRIVE_FILE: 'READ_DRIVE_FILE',
  CREATE_FILE: 'CREATE_FILE',
  DELETE_FILE: 'DELETE_FILE',
  UPDATE_FILE: 'UPDATE_FILE',
  GET_DRIVE_LIST: 'GET_DRIVE_LIST',
  DELETE_DRIVE: 'DELETE_DRIVE'
}

const OPERATION = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

const getDrives = async () => {
  let res = await axios.get(`${END_POINT}/manage`, {name})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}

const newDrive = async (name) => {
  let res = await axios.post(`${END_POINT}/manage`, {name, operation: OPERATION.CREATE})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}

const deleteDrive = async (name) => {
  let res = await axios.post(`${END_POINT}/manage`, {name, operation: OPERATION.DELETE})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}


const readDriveDir = async (name, path) => {
  let res = await axios.post(`${END_POINT}/manage/readdir`, {name, path})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}

const manageDriveFile = async (name, path, operation = 'READ', payload = null) => {
  let res = await axios.post(`${END_POINT}/manage/file`, {name, path, operation, data: payload})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}

async function handleMessage(message, sender, sendResponse) {
  // console.log('handleMessage', message, sender, sendResponse)
  const {type, name, path, data} = message
  console.log('msg-payload', type, name, path, data)
  if (type === MESSAGE.CREATE_NEW_DRIVE) {
    let res = await newDrive(name)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.GET_DRIVE_LIST) {
    let res = await getDrives()
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.DELETE_DRIVE) {
    let res = await deleteDrive(name)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.READ_DRIVE_DIR) {
    let res = await readDriveDir(name, path)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.READ_DRIVE_FILE) {
    let res = await manageDriveFile(name, path, OPERATION.READ)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.CREATE_FILE) {
    let res = await manageDriveFile(name, path, OPERATION.CREATE)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.UPDATE_FILE) {
    let res = await manageDriveFile(name, path, OPERATION.UPDATE, data)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.DELETE_FILE) {
    let res = await manageDriveFile(name, path, OPERATION.DELETE)
    console.log('res', res)
    return res;
  } else {
    sendResponse(null)
  }
  // return true;
}

if (!browser.runtime.onMessage.hasListener(handleMessage)) {
  browser.runtime.onMessage.addListener(handleMessage);
  console.log('handle message added')
}

console.log('hypercore-fox-extension loaded');
