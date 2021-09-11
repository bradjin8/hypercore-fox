const MESSAGE = {
  GET_DRIVE_LIST: 'GET_DRIVE_LIST',
  DELETE_DRIVE: 'DELETE_DRIVE'
}
let listWidget, drives = []


$(function () {
  function fetchDrives() {
    let sending = browser.runtime.sendMessage(
      {
        type: MESSAGE.GET_DRIVE_LIST,
      }
    )
    sending.then(res => {
      console.log('res-page', res)
      drives = res.data
      redrawUI()
    }, error => {
      console.log('err-page', error)
    })
  }

  function deleteDrive(name) {
    let sending = browser.runtime.sendMessage(
      {
        type: MESSAGE.DELETE_DRIVE,
        name,
      }
    )
    sending.then(res => {
      console.log('res-page', res)
      fetchDrives()
    }, error => {
      console.log('err-page', error)
    })
  }

  function redrawUI() {
    let listWidget = $('#list').dxList({
      dataSource: drives,
      searchEnabled: false,
      height: 400,
      searchExpr: "name",
      itemTemplate: function (data) {
        return `<div>`
          + `<div class="item-name">${data.name}</div>`
          + `<div class="item-actions">`
          + `<a class="btn-visit" href="${data.url}" target="_blank">Visit</a>`
          + `<a class="btn-manage" href="/view.html?name=${data.name}">Manage</a>`
          + `<div class="btn-delete" data-drive-name="${data.name}">Remove</div>`
          + `</div>`
          + `</div>`
      }
    }).dxList("instance");

    $("#searchMode").dxSelectBox({
      dataSource: ["contains", "startswith", "equals"],
      value: "contains",
      onValueChanged: function (data) {
        listWidget.option("searchMode", data.value)
        formatButtons()
      }
    }).dxSelectBox("instance")

    function deleteDrive(name) {
      console.log('deleteDrive', name)
    }

    formatButtons()
  }

  fetchDrives()


  function formatButtons() {
    $(".btn-manage").dxButton({
      icon: 'link',
      // stylingMode: 'contained',
      type: 'default',
      width: 120,
      height: 30,
    })
    $(".btn-visit").dxButton({
      icon: 'eye',
      stylingMode: 'contained',
      type: 'success',
      width: 120,
      height: 30,
    })
    $(".btn-delete").dxButton({
      icon: 'eye',
      stylingMode: 'contained',
      type: 'danger',
      width: 120,
      height: 30,
    })

    $(".btn-delete").on('click', function (e) {
      const name = $(this).attr('data-drive-name')
      deleteDrive(name)
    })
  }

})
