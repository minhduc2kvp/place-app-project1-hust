

// ALERT
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