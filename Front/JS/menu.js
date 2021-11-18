
let url = "http://localhost:7272";
//let url = "https://kebora.loca.lt"

$('#ordini').on('click',function(){
    let token = document.getElementById('token').value
    let form = document.getElementById('formordini')
    form.submit();
});

$(document).ready(function() { 
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    var headers = req.getAllResponseHeaders().toLowerCase();
    console.log(headers)
})