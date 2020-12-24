let user, inputNameUser, inputEmailUser, radiosGender, inputBirthDayUser
    , modalUser, userBox, inputHiddenRadio;


$(async function (){
    inputNameUser = $("#input-name-user");
    inputEmailUser = $("#input-email-user");
    inputBirthDayUser = $("#input-birthday");
    radiosGender = $("input:radio[name=gender]");
    inputHiddenRadio = $("#input-hidden-radio");
    modalUser = $("#modal-user");
    userBox = $("#user-box");
    saveUser();
})

function saveUser(){
    $("#btn-save-user").on("click", async function (){
        let name = inputNameUser.val();
        let gender = $("input:radio[name=gender]:checked").val();
        let birthday = inputBirthDayUser.val();
        let valid = true;
        if (name.length <= 0){
            valid = false;
            inputNameUser.addClass("is-invalid");
        }else{
            inputNameUser.removeClass("is-invalid");
        }
        if (gender === undefined){
            valid = false;
            inputHiddenRadio.addClass("is-invalid");
        }else{
            inputHiddenRadio.removeClass("is-invalid");
        }
        if (birthday === ""){
            valid = false;
            inputBirthDayUser.addClass("is-invalid");
        }else{
            inputBirthDayUser.removeClass("is-invalid");
        }
        if (valid){
            modalUser.modal("hide");
            let data = {
                name: name,
                gender: gender,
                birthday: birthday
            }
            await ajaxPut("users", data)
                .then(rs => {
                    alertInfo(true, "Update your info success");
                })
                .catch(e => {
                    alertInfo(false, "Update your info fail");
                })
            await getInfoUser();
            setDataUserBox();
        }
    })
}

async function getInfoUser(){
    await ajaxGet("users")
        .then(rs => {
            user = rs.data.data;
        })
        .catch(e => alertInfo(false, "Your are not login"))
}

function setDataUserBox(){
    let output = `<div class="d-flex shadow rounded mb-3 align-items-center pr-2" id="user-info">
                        <img src="${user.avatar}" width="50" class="border-2 border-success rounded"/>
                        <div class="ml-2">${user.name}</div>
                    </div>`;
    userBox.html(output);
    $("#user-info").on("click", function (){
        inputNameUser.val(user.name);
        inputEmailUser.val(user.email);
        if(user.birthday !== undefined) {
            inputBirthDayUser.val(user.birthday);
        }
        if (user.gender !== undefined){
            radiosGender.filter(`[value=${user.gender}]`).prop('checked', true);
        }
        modalUser.modal("show");
    })
}

async function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    data = {
        token: id_token
    }
    await ajaxPost("login", data)
        .then(rs => {
            let token = rs.data.data.token;
            $.ajaxSetup({
              headers: {
                  Authorization: token
              }
            });
        })
        .catch(e => {
            alertInfo(false, "Login fail");
        })
    await getInfoUser();
    setDataUserBox();
}