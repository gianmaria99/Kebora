
let url = "http://localhost:7272"
//let url = "https://kebora.loca.lt"

document.getElementById('auth-btn').addEventListener('click',function(){
    let name = document.getElementById('name').value;
    let password = document.getElementById('pass').value;
    document.getElementById('name').value = '';
    document.getElementById('pass').value = '';
    fetch(url+'/auth',{
        headers: {
          'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name , password})
      })
      /*
      .then(response => response.json())
      .then(data => {
        const {success} = data;
        if(!success){
          document.getElementById('wrong').hidden=false;
        }else{
          fetch(url+'/menu')
          .then(response=>console.log(response.body))
        }
      })
      */
    })