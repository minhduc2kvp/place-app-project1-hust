const BASE_URL = 'api/'

async function ajaxGet(url){
    let rs = null;
    await $.ajax({
        type: 'GET',
        dataType: 'json',
        url: BASE_URL + url,
        timeout: 30000,
        cache: false,
        success: function (result, textStatus, xhr){
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

async function ajaxPost(url, data) {
    let rs = null;
    await $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: BASE_URL + url,
        timeout: 30000,
        contentType: "application/json",
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

async function ajaxPut(url, data) {
    let rs = null;
    await $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        // headers: {
        //     "Authorization": ss_lg
        // },
        url: BASE_URL + url,
        timeout: 30000,
        contentType: "application/json",
        success: function (result) {
            rs = result
        }
    })
    return rs;
}

async function ajaxDelete(url, data) {
    let rs = null;
    await $.ajax({
        type: 'DELETE',
        data: JSON.stringify(data),
        // headers: {
        //     "Authorization": ss_lg
        // },
        url: BASE_URL + url,
        timeout: 30000,
        contentType: "application/json",
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    })
    return rs;
}

async function ajaxUploadFile(url, file) {
    let formData = new FormData();
    formData.append("file", file);
    let rs = null;
    await $.ajax({
        type: "POST",
        url: BASE_URL + url,
        data: formData,
        cache: false,
        contentType: false,
        enctype: "multipart/form-data",
        processData: false,
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

function alertInfo(isSuccess,text){
    let result = `<div class="alert alert-${isSuccess ? "success" : "danger"} animate-report">
                    <strong>!</strong> ${text}
                  </div>`;
    $("#alert-report").prepend(result);
    let firstElement = $("#alert-report").children().first();
    setTimeout(function (){
        firstElement.remove();
    },3000);
}