const MESSAGE = {
    READ_DRIVE: 'READ_DRIVE'
}

async function loadDrive(name) {
    try {
        let res = await browser.runtime.sendMessage(
            {
                type: MESSAGE.READ_DRIVE,
                name
            }
        )
        console.log('res-page', res)
        return res;
    } catch (e) {
        console.log('SendMessageError', e.message)
    }
}

$(document).ready(async function () {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    console.log('params', params)
    if (!params.name) {
        window.location.href = '/my_library.html'
    }

    document.title = params.name
    await loadDrive(params.name)
    var provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
        endpointUrl: "https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images"
    });

    $("#file-manager").dxFileManager({
        name: "fileManager",
        fileSystemProvider: provider,
        currentPath: "Widescreen",
        permissions: {
            create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true,
            download: true
        },
        onSelectedFileOpened: function(e) {
            var popup = $("#photo-popup").dxPopup("instance");
            popup.option({
                "title": e.file.name,
                "contentTemplate": "<img src=\"" + e.file.dataItem.url + "\" class=\"photo-popup-image\" />"
            });
            popup.show();
        }
    });

    $("#photo-popup").dxPopup({
        maxHeight: 600,
        closeOnOutsideClick: true,
        onContentReady: function(e) {
            var $contentElement = e.component.content();
            $contentElement.addClass("photo-popup-content");
        }
    });

})