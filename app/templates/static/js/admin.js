let inputNamePlace, checkboxVip, inputNameSite, inputDesctiptionSite, inputLatitudeSite
    , inputLongitudeSite, selectPlace, selectPlaceImportFile, dataPlaces, dataSites
    , deleteBtnModalDelete, submitBtnModalPlace, submitBtnModalSite
    , modalDelete, modalPlace, modalSite
    , modalImportFile, inputFile, selectNameSite
    , selectDescriptionSite, selectLatitudeSite, selectLongitudeSite
    , btnUploadFile, btnAcceptImportFile, selectPlaceSiteTable;
let place, site;
let name_file_upload, headers_file = [];
let isPlace = true; isInsert = true;
let list_places = [], list_sites = [];

$(async function (){
    inputNamePlace = $("#input-name-place");
    checkboxVip = $("#checkbox-vip");
    inputNameSite = $("#input-name-site");
    inputDesctiptionSite = $("#input-description-site");
    inputLatitudeSite = $("#input-latitude");
    inputLongitudeSite = $("#input-longitude");
    selectPlace = $("#select-place");
    selectPlaceImportFile = $("#select-place-import-site");
    dataPlaces = $("#data-place");
    dataSites = $("#data-site");
    deleteBtnModalDelete = $("#delete-btn-modal-delete");
    submitBtnModalPlace = $("#submit-btn-modal-place");
    submitBtnModalSite = $("#submit-btn-modal-site");
    modalDelete = $("#modal-delete");
    modalPlace = $("#modal-place");
    modalSite = $("#modal-site");
    modalImportFile = $("#modal-import-file");
    inputFile = $("#input-file");
    selectNameSite = $("#select-name-site");
    selectDescriptionSite = $("#select-description-site");
    selectLatitudeSite = $("#select-latitude-site");
    selectLongitudeSite = $("#select-longitude-site");
    btnUploadFile = $("#btn-upload-file");
    btnAcceptImportFile = $("#submit-btn-modal-import-file");
    selectPlaceSiteTable = $("#select-place-site-table")
    viewLoading(4, dataPlaces);
    viewLoading(7, dataSites);
    list_places = await getPlaces();
    setDataPlaceTable();
    setDataSelectPlace();
    setTimeout(async function (){
        place = list_places[0];
        list_sites = await getSitesByPlaceId(place._id.$oid);
        setDataSiteTable();
    }, 1000)
    acceptDeleteItem();
    acceptSubmitModalPlace();
    acceptSubmitModalSite();
    uploadFile();
    acceptImportFile();
});

function viewLoading(colspanNumber,element){
    let loading = `<tr><td colspan='${colspanNumber}'>
                        <div class="spinner-border text-warning" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                    </td></tr>`;
    element.html(loading);
}

function deleteItem(is_place, index){
    if (is_place){
        place = list_places[index];
        isPlace = true;
    }else{
        site = list_sites[index];
        isPlace = false;
    }
    modalDelete.modal("show");
}

function acceptDeleteItem(){
    deleteBtnModalDelete.on("click", async function (){
        modalDelete.modal("hide");
        if (isPlace){
            viewLoading(4, dataPlaces);
            viewLoading(7, dataSites);
            await ajaxDelete('places/' + place._id.$oid)
                .then(rs => {
                    if (rs.status == 200){
                        alertInfo(true, "Delete place success");
                    }
                })
                .catch(e => alertInfo(false, "Delete place unsuccess"));
            list_places = await getPlaces();
            setDataPlaceTable();
            setDataSelectPlace();
            place = list_places[0];
            list_sites = await getSitesByPlaceId(place._id.$oid);
            setDataSiteTable();
        }else{
            viewLoading(7, dataSites);
            await ajaxDelete('sites/' + site._id.$oid)
                .then(rs => {
                    if (rs.status == 200){
                        alertInfo(true, "Delete place success");
                    }
                })
                .catch(e => alertInfo(false, "Delete place fail"));
            list_sites = await getSites(place._id.$oid);
            setDataSiteTable();
        }
    });
}

function editPlace(index){
    place = list_places[index];
    inputNamePlace.val(place.name);
    if(place.vip){
        checkboxVip.prop("checked", true);
    }else{
        checkboxVip.prop("checked", false);
    }
    isInsert = false;
    modalPlace.modal("show");
}

function createPlace(){
    isInsert = true;
    modalPlace.modal("show");
}

function acceptSubmitModalPlace(){
    submitBtnModalPlace.on("click", async function (){
        let namePlace = inputNamePlace.val();
        if (namePlace.length > 0){
            inputNamePlace.removeClass("is-invalid");
            modalPlace.modal("hide");
            viewLoading(4, dataPlaces);
            viewLoading(7, dataSites);
            data = {
                name: namePlace,
                vip: checkboxVip.is(":checked")
            }
            if (isInsert){
                await ajaxPost("places", data)
                    .then(rs => {
                        if (rs.status == 200){
                            alertInfo(true, "Create new place success");
                        }
                    })
                    .catch(e => alertInfo(false, "Create new place fail"))
            }else{
                await ajaxPut("places/" + place._id.$oid, data)
                    .then(rs => {
                        alertInfo(true, "Update place success");
                    })
                    .catch(e => alertInfo(false, "Update place fail"))
            }
            list_places = await getPlaces();
            setDataPlaceTable();
            setDataSelectPlace();
            place = list_places[0];
            list_sites = await getSitesByPlaceId(place._id.$oid);
            setDataSiteTable();
        }else{
            inputNamePlace.addClass("is-invalid");
        }
    })
}

function setDataPlaceTable(){
    let output = list_places.map((place, index) => {
        return `<tr>
                    <th scope="row">${index + 1}</th>
                    <td>${place.name}</td>
                    <td><span class="badge badge-${place.vip ? 'success' : 'danger'}">${place.vip ? 'Yes' : 'No'}</span></td>
                    <td width="200">
                        <button class="btn btn-warning" onclick="editPlace(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteItem(true ,${index})">Delete</button>
                    </td>
                </tr>`;
    }).join('');
    dataPlaces.html(output);
}

function setDataSelectPlace(){
    let output = list_places.map((place, index) => {
        return `<option value="${index}">${place.name}</option>`
    }).join('');
    selectPlaceImportFile.html(output);
    selectPlace.html(output);
    selectPlaceSiteTable.html(output);
}

function createSite(){
    isInsert = true;
    modalSite.modal("show");
}

function editSite(index){
    site = list_sites[index];
    inputNameSite.val(site.name);
    inputLatitudeSite.val(site.latitude);
    inputLongitudeSite.val(site.longitude);
    inputDesctiptionSite.val(site.description);
    list_places.find((place, index) => {
        if(place._id.$oid === site.place_id){
            selectPlace.val(index);
            return true;
        }else{
            return false;
        }
    })
    isInsert = false;
    modalSite.modal("show");
}

function acceptSubmitModalSite(){
    submitBtnModalSite.on("click", async function (){
        let name = inputNameSite.val();
        let latitude = inputLatitudeSite.val();
        let longitude = inputLongitudeSite.val();
        let description = inputDesctiptionSite.val();
        let place_id = list_places[parseInt(selectPlace.val())]._id.$oid;
        let valid = true;
        if(name.length <= 0){
            valid = false;
            inputNameSite.addClass("is-invalid");
        }else{
            inputNameSite.removeClass("is-invalid");
        }
        if(isNaN(latitude) || latitude.length <= 0){
            valid = false;
            inputLatitudeSite.addClass("is-invalid");
        }else{
            latitude = parseFloat(latitude);
            inputLatitudeSite.removeClass("is-invalid");
        }
        if(isNaN(longitude) || longitude.length <= 0){
            valid = false;
            inputLongitudeSite.addClass("is-invalid");
        }else{
            longitude = parseFloat(longitude);
            inputLongitudeSite.removeClass("is-invalid");
        }
        if (valid){
            modalSite.modal("hide");
            viewLoading(7, dataSites);
            data = {
                name: name,
                latitude: latitude,
                longitude: longitude,
                description: description,
                place_id: place_id
            }
            if (isInsert){
                await ajaxPost("sites", data)
                    .then(rs => {
                        if (rs.status == 200){
                            alertInfo(true, "Create new site success");
                        }
                    })
                    .catch(e => alertInfo(false, "Create new site fail"))
            }else{
                await ajaxPut("sites/" + site._id.$oid, data)
                    .then(rs => {
                        alertInfo(true, "Update site success");
                    })
                    .catch(e => alertInfo(false, "Update site fail"))
            }
            list_sites = await getSitesByPlaceId(place._id.$oid);
            setDataSiteTable();
        }
    });
}

async function reloadTableSite(){
    place = list_places[selectPlaceSiteTable.val()];
    list_sites = await getSitesByPlaceId(place._id.$oid);
    setDataSiteTable();
}

function setDataSiteTable(){
    let output = list_sites.map((site, index) => {
        return `<tr>
                    <th scope="row">${index + 1}</th>
                    <td>${site.name}</td>
                    <td>
                        <p>${site.description}</p>
                    </td>
                    <td><span class="badge badge-info">${site.latitude}</span></td>
                    <td><span class="badge badge-info">${site.longitude}</span></td>
                    <td><span class="badge badge-primary">${list_places.find(place => place._id.$oid === site.place_id).name}</span></td>
                    <td width="200">
                        <button class="btn btn-warning" onclick="editSite(${index})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteItem(false ,${index})">Delete</button>
                    </td>
                </tr>`;
    }).join('');
    dataSites.html(output);
}

// IMPORT FILE
function importFile(){
    modalImportFile.modal("show");
}

function loadingUploadFile(){
    let result = `<div class="spinner-grow text-success" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>`;
    $("#message-upload-file").html(result);
}

function showMessageUploadFile(isSuccess, text){
    let result = `<div class="alert alert-${isSuccess ? "success" : "danger"}">
                    <strong>!</strong> ${text}
                  </div>`;
    $("#message-upload-file").html(result);
}

function uploadFile(){
    btnUploadFile.on("click", async function (){
        file_upload = document.getElementById("input-file").files[0];
        if (file_upload == undefined){
            inputFile.addClass("is-invalid");
        }else{
            loadingUploadFile();
            inputFile.removeClass("is-invalid");
            await ajaxUploadFile("files/upload", file_upload)
                .then(rs => {
                    showMessageUploadFile(true, "Upload file success");
                    data = rs.data.data;
                    name_file_upload = data.filename;
                    headers_file = data.headers;
                    let output = headers_file.map((item, index) => {
                        return `<option value="${index}">${item}</option>`
                    }).join('');
                    selectNameSite.html(output);
                    selectDescriptionSite.html(output);
                    selectLatitudeSite.html(output);
                    selectLongitudeSite.html(output);
                })
                .catch(e => {
                    showMessageUploadFile(false, "Upload file fail");
                    console.log(e);
                })
        }
    })
}

function acceptImportFile(){
    btnAcceptImportFile.on("click", async function (){
        let name = selectNameSite.val();
        let description = selectDescriptionSite.val();
        let latitude = selectLatitudeSite.val();
        let longitude = selectLongitudeSite.val();
        let place_id = list_places[parseInt(selectPlaceImportFile.val())]._id.$oid;
        if (name == null){
            showMessageUploadFile(false, "Please, Upload file befor you import file");
        }else{
            modalImportFile.modal("hide");
            viewLoading(7, dataSites);
            data = {
                filename: name_file_upload,
                name: headers_file[parseInt(name)],
                description: headers_file[parseInt(description)],
                latitude: headers_file[parseInt(latitude)],
                longitude: headers_file[parseInt(longitude)],
                place_id: place_id
            }
            await ajaxPost("files/import", data)
                .then(rs => {
                    if (rs.status == 200){
                        alertInfo(true, "Import file success");
                    }
                }).catch(e => {
                    console.log(e);
                    alertInfo(false, "Import file fail");
                })
            list_sites = await getSitesByPlaceId(place._id.$oid);
            setDataSiteTable();
        }
    })
}


