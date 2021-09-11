const END_POINT = 'http://127.0.0.1:8338'
const MESSAGE = {
  CREATE_NEW_DRIVE: 'CREATE_NEW_DRIVE',
  GET_DRIVE_LIST: 'GET_DRIVE_LIST',
  DELETE_DRIVE: 'DELETE_DRIVE',

  CREATE_DRIVE_DIR: 'CREATE_DRIVE_DIR',
  READ_DRIVE_DIR: 'READ_DRIVE_DIR',
  DELETE_DRIVE_DIR: 'DELETE_DRIVE_DIR',

  READ_DRIVE_FILE: 'READ_DRIVE_FILE',
  CREATE_FILE: 'CREATE_FILE',
  DELETE_FILE: 'DELETE_FILE',
  UPDATE_FILE: 'UPDATE_FILE',
  UPLOAD_FILE: 'UPLOAD_FILE'
}

const OPERATION = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  UPLOAD: 'UPLOAD'
}

const getDrives = async () => {
  let res = await axios.get(`${END_POINT}/manage`, {name})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}

const manageDrive = async (name, operation) => {
  let res = await axios.post(`${END_POINT}/manage`, {name, operation})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}


const manageDriveDir = async (name, path, operation = OPERATION.READ) => {
  let res = await axios.post(`${END_POINT}/manage/dir`, {name, path, operation})
  const {status, data, error} = res
  console.log('data', data)
  return data;
}

const uploadFile = async (name, path, file) => {
  const form_data = new FormData()
  form_data.append('data', file)
  form_data.append('name', name)
  form_data.append('path', path)

  let res = await axios.post(`${END_POINT}/manage/upload`, form_data, {
    'Content-Type': 'multipart/form-data'
  })

}

const manageDriveFile = async (name, path, operation = OPERATION.READ, payload = null) => {
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
    let res = await manageDrive(name, OPERATION.CREATE)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.GET_DRIVE_LIST) {
    let res = await getDrives()
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.DELETE_DRIVE) {
    let res = await manageDrive(name, OPERATION.DELETE)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.CREATE_DRIVE_DIR) {
    let res = await manageDriveDir(name, path, OPERATION.CREATE)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.READ_DRIVE_DIR) {
    let res = await manageDriveDir(name, path, OPERATION.READ)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.DELETE_DRIVE_DIR) {
    let res = await manageDriveDir(name, path, OPERATION.DELETE)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.CREATE_FILE) {
    let res = await manageDriveFile(name, path, OPERATION.CREATE)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.READ_DRIVE_FILE) {
    let res = await manageDriveFile(name, path, OPERATION.READ)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.UPDATE_FILE) {
    let res = await manageDriveFile(name, path, OPERATION.UPDATE, data)
    console.log('res', res)
    return res;
  } else if (type === MESSAGE.UPLOAD_FILE) {
    let res = await uploadFile(name, path, data)
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
