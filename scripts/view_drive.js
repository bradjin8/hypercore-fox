const MESSAGE = {
  READ_DRIVE_DIR: 'READ_DRIVE_DIR',
  READ_DRIVE_FILE: 'READ_DRIVE_FILE',
  CREATE_FILE: 'CREATE_FILE',
  DELETE_FILE: 'DELETE_FILE',
  UPDATE_FILE: 'UPDATE_FILE'
}

const LABEL = {
  CREATE_FILE: "Create a new file",
  EDIT_FILE: "Edit as text editor"
}

const MODE = {
  js: "javascript",
  json: {
    name: "javascript",
    json: true
  },
  html: "text/html",
  php: "php"
}

async function loadDrive(name, path = "/") {
  return new Promise(async resolve => {
    let sending = browser.runtime.sendMessage(
      {
        type: MESSAGE.READ_DRIVE_DIR,
        name,
        path
      }
    )
    sending.then(res => {
      console.log('res-page', res)
      resolve(res);
    }, error => {
      console.log('err-page', error)
      resolve(null)
    })
  })
}

async function readFile(name, path) {
  return new Promise(async resolve => {
    let sending = browser.runtime.sendMessage(
      {
        type: MESSAGE.READ_DRIVE_FILE,
        name,
        path
      }
    )
    sending.then(res => {
      console.log('res-page', res)
      resolve(res);
    }, error => {
      console.log('err-page', error)
      resolve(null)
    })
  })
}

async function createFile(name, path) {
  return new Promise(async resolve => {
    let sending = browser.runtime.sendMessage(
      {
        type: MESSAGE.CREATE_FILE,
        name,
        path
      }
    )
    sending.then(res => {
      console.log('res-page', res)
      resolve(res);
    }, error => {
      console.log('err-page', error)
      resolve(null)
    })
  })
}

async function updateFile(name, path, data) {
  return new Promise(async resolve => {
    let sending = browser.runtime.sendMessage(
      {
        type: MESSAGE.UPDATE_FILE,
        name,
        path,
        data
      }
    )
    sending.then(res => {
      console.log('res-page', res)
      resolve(res);
    }, error => {
      console.log('err-page', error)
      resolve(null)
    })
  })
}

async function deleteFile(name, path) {
  return new Promise(async resolve => {
    let sending = browser.runtime.sendMessage(
      {
        type: MESSAGE.DELETE_FILE,
        name,
        path
      }
    )
    sending.then(res => {
      console.log('res-page', res)
      resolve(res);
    }, error => {
      console.log('err-page', error)
      resolve(null)
    })
  })
}

$(document).ready(async function () {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  console.log('params', params)
  if (!params.name) {
    window.location.href = '/my_library.html'
  }

  document.title = params.name
  // let provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
  //   endpointUrl: "https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images"
  // });

  let provider = new DevExpress.fileManagement.CustomFileSystemProvider({
    getItems: getItems,
    createDirectory: async (parentDir, name) => {
    },
    deleteItem: deleteItem
  })

  let fileManager = $("#file-manager").dxFileManager({
    name: "fileManager",
    rootFolderName: document.title,
    selectionMode: 'single',
    fileSystemProvider: provider,
    currentPath: "Widescreen",
    permissions: {
      // create: true,
      // copy: true,
      // move: true,
      delete: true,
      // rename: true,
      // upload: true,
      // download: true
    },
    itemView: {
      details: {
        columns: [
          "thumbnail",
          "name",
          "size",
          // {
          //   dataField: "dateCreated",
          //   dataType: "date",
          //   caption: "Created Date",
          //   alignment: 'right',
          //   width: 150,
          // },
          {
            dataField: "dateModified",
            dataType: "date",
            caption: "Modified Date",
            alignment: 'right',
            width: 150,
          }
        ]
      },
      showParentFolder: true,
    },
    toolbar: {
      items: [
        {
          name: "showNavPane",
          visible: true
        },
        "separator",
        {
          widget: "dxMenu",
          location: "before",
          options: {
            items: [
              {
                text: LABEL.CREATE_FILE,
                icon: "plus",
              }
            ],
            onItemClick: onItemClick
          }
        },
        // "refresh",
        {
          name: "separator",
          location: "after"
        },
        "switchView"
      ],
      fileSelectionItems: [
        "rename", "separator", "delete", "separator",
        "refresh", "clearSelection"
      ]
    },
    onSelectedFileOpened: onSelectedFileOpened,
    onContextMenuItemClick: onItemClick,
    contextMenu: {
      items: [
        "create",
        {
          text: LABEL.CREATE_FILE,
          icon: "plus",
        },
        {
          text: LABEL.EDIT_FILE,
          icon: "edit"
        },
        {
          name: "rename",
          beginGroup: true
        },
        "delete",
        "refresh"
      ]
    }
  }).dxFileManager("instance");

  $("#photo-popup").dxPopup({
    maxHeight: 600,
    closeOnOutsideClick: true,
    onContentReady: function (e) {
      let $contentElement = e.component.content();
      $contentElement.addClass("photo-popup-content");
    }
  });

  // file manager helpers
  async function tryCreateFile() {
    let text, fileName = prompt("Please enter your file name", "");

    if (fileName == null || fileName === "") {
      text = "user cancelled the prompt"
      console.log(text)
      return false;
    } else {
      text = `New file, ${fileName} should be created`
    }

    let filePath = fileManager.getCurrentDirectory().path + '/' + fileName;
    console.log('create-file-path', filePath)
    let res = await createFile(document.title, filePath)
    return res && res.success;
  }

  async function onItemClick(args) {
    console.log('args', args)
    let updated = false;

    if (args.itemData.text === LABEL.CREATE_FILE) {
      updated = await tryCreateFile();
    } else if (args.itemData.text === LABEL.EDIT_FILE) {
      //
      const {fileSystemItem} = args
      if (!fileSystemItem.isDirectory) {
        console.log('file', fileSystemItem.path)
        await openEditPopup(fileSystemItem.name, fileSystemItem.path)
      }
    }

    if (updated) {
      fileManager.refresh();
    }
  }


  async function getItems(pathInfo) {
    console.log('pathInfo', pathInfo)
    let res = await loadDrive(document.title, pathInfo.path)
    console.log('getItems', res)
    if (res) {
      if (res.success) {
        return res.data
      } else {
        alert(`"${document.title}" drive does not exist`)
        window.location.href = "/my_library.html"
      }
    } else {
      alert(`Can not get drive contents`)
    }
    return []
  }

  async function deleteItem(item) {
    console.log('pathInfo', item)

    let res = await deleteFile(document.title, item.path);
    console.log('deleteItem', res)
    if (res && res.success)
      fileManager.refresh()
  }

  async function onSelectedFileOpened(e) {
    let filePath = fileManager.getCurrentDirectory().parentPath + "/" + e.file.path
    console.log('file', filePath)

    await openEditPopup(e.file.name, filePath, true)
  }

  let myCodeMirror

  async function openEditPopup(name, filePath, readOnly = false) {
    let res = await readFile(document.title, filePath)
    console.log('res', res)

    let content
    if (res) {
      if (res.success) {
        content = res.data
      } else {
        content = 'Can not load the file.'
      }
    } else {
      content = 'File not found'
    }

    let popup = $("#edit-popup").dxPopup({
      height: function () {
        return window.innerHeight * 0.8
      },
      maxHeight: 700,
      closeOnOutsideClick: false,
      onContentReady: function (e) {
        var $contentElement = e.component.content();
        $contentElement.addClass("photo-popup-content");
      }
    }).dxPopup("instance")

    let extension = name.lastIndexOf(".") > 0 ? name.substring(name.lastIndexOf(".") + 1) : null
    let mode = MODE[extension]


    let content_html = `<textarea id="editor">${content}</textarea>`
    if (!readOnly) {
      content_html += `<div class="editor-controls"><div id="editor-save">Save</div><div id="editor-cancel">Cancel</div></div>`;// + content_html
    }
    let popupOption = {
      "title": name,
      "contentTemplate": content_html
    }
    if (!readOnly) {
    }
    popup.option(popupOption)
    popup.on('hidden', function () {
      popup.dispose()
      if (!readOnly)
        fileManager.refresh()
    })
    popup.on('contentReady', function () {
      console.log('cm', extension, mode, content)
      let editorElement = document.getElementById('editor')
      let cmOptions = {
        lineNumbers: true,
        // value: content,
        readOnly: readOnly,
        viewportMargin: Infinity,
      }
      if (mode) {
        cmOptions.mode = mode
      }
      // alert(mode)

      myCodeMirror = CodeMirror.fromTextArea(editorElement, cmOptions)
      // alert(myCodeMirror.doc.getValue())

      $('#editor-save').dxButton({
        icon: 'link',
        stylingMode: 'outlined',
        type: 'default',
        width: 120,
        height: 30,
        onClick: async function () {
          const data = myCodeMirror.doc.getValue()
          const _rs = await updateFile(document.title, filePath, data)
          if (_rs.success) {
            DevExpress.ui.notify('File was successfully saved', 'success', 600)
          } else {
            DevExpress.ui.notify('Failed to save', 'error', 600)
          }
          popup.hide()
          myCodeMirror.toTextArea()
        }
      })
      $('#editor-cancel').dxButton({
        stylingMode: 'contained',
        type: 'danger',
        width: 120,
        height: 30,
        onClick: async function () {
          popup.hide()
        }
      })
    })
    popup.show();
  }
})
