
let url = "http://localhost:7272"
//let url = "https://kebora.loca.lt"

document.addEventListener('DOMContentLoaded', function(){
  // creazione della tabella ordini
  fetch(url+'/getAllPolvere')
  .then(response => response.json())
  .then(data => {
    tabellaPolvere(data['data'])
  })
  // autocomplete Polvere
  fetch(url+'/polvere')
  .then(response => response.json())
  .then(data => {
    let polvere = document.getElementById("serch");
    let polveri = new Array(data.length);
    let i = 0;
    data['data'].forEach(function({Descrizione}){
      polveri[i] = Descrizione;
      i+=1;
    })
    autocomplete(polvere,polveri)
  })
  
})

//edit
document.querySelector('table tbody').addEventListener('click',function(event){ 
  if(event.target.className === 'edit-row-btn'){  
    let ok = confirm('You really want to edit the order with ID: '+event.target.dataset.id)
    if(ok){
      showEditRowById(event.target.parentNode.parentNode.rowIndex);
    }
  }
})

//triggered by table EDIT button inizializes the edit tiri tera
function showEditRowById(index){
  document.getElementById('edit').hidden = false;
  document.getElementById('add_btn').hidden = true;

  let value = document.querySelector('table tbody').rows[index-1];
  value = value.querySelectorAll('td');

  document.querySelector('#ID_polvere').value = value[0].innerHTML;
  document.querySelector('#ID_interno_polvere').value =  value[1].innerHTML;
  document.querySelector('#Descrizione').value =  value[2].innerHTML;
  document.querySelector('#Codice_fornitore').value =  value[3].innerHTML;
  document.querySelector('#Giacenza').value =  value[4].innerHTML;

}

//Decline button
function decline(){
  document.querySelector('#ID_polvere').value = '';
  document.querySelector('#ID_interno_polvere').value = '';
  document.querySelector('#Descrizione').value = '';
  document.querySelector('#Codice_fornitore').value = '';
  document.querySelector('#Giacenza').value = '';
  document.getElementById('edit').hidden = true;
  document.getElementById('add_btn').hidden = false;
  document.getElementById('edit_btn').hidden = false;
  document.querySelector('#ID_interno_polvere').disabled = true;
  document.getElementById('confirm_add_btn').hidden = true;
}

//add powder
function add(){
  document.getElementById('add_btn').hidden = true;
  document.getElementById('edit').hidden = false;
  document.getElementById('edit_btn').hidden = true;
  document.querySelector('#ID_interno_polvere').disabled = false;
  document.getElementById('confirm_add_btn').hidden = false;
}

function confirmAdd(){

  let ID_interno_polvere = document.querySelector('#ID_interno_polvere').value 
  let Descrizione = document.querySelector('#Descrizione').value 
  let Codice_fornitore = document.querySelector('#Codice_fornitore').value 
  let Giacenza = document.querySelector('#Giacenza').value

  if(Descrizione === ''){
    alert('Descrizione field cannot be empty')
    document.querySelector('#ID_polvere').value = '';
    document.querySelector('#ID_interno_polvere').value = '';
    document.querySelector('#ID_interno_polvere').disabled = true;
    document.querySelector('#Descrizione').value = '';
    document.querySelector('#Codice_fornitore').value = '';
    document.querySelector('#Giacenza').value = '';
    document.getElementById('edit').hidden = true;
    document.getElementById('add_btn').hidden = false;
    document.getElementById('edit_btn').hidden = false;
    document.getElementById('confirm_add_btn').hidden = true;
    return
  }

  let insert = {ID_interno_polvere, Descrizione, Codice_fornitore, Giacenza}

  fetch(url+'/insertPolvere',{
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(insert)
  })
  
  document.querySelector('#ID_polvere').value = '';
  document.querySelector('#ID_interno_polvere').value = '';
  document.querySelector('#ID_interno_polvere').disabled = true;
  document.querySelector('#Descrizione').value = '';
  document.querySelector('#Codice_fornitore').value = '';
  document.querySelector('#Giacenza').value = '';
  document.getElementById('edit').hidden = true;
  document.getElementById('add_btn').hidden = false;
  document.getElementById('edit_btn').hidden = false;
  document.getElementById('confirm_add_btn').hidden = true;
}
//fetches and closes EDIT
function closeEdit(){
  let ID_polvere = document.querySelector('#ID_polvere').value;
  let ID_interno_polvere = document.querySelector('#ID_interno_polvere').value 
  let Descrizione = document.querySelector('#Descrizione').value 
  let Codice_fornitore = document.querySelector('#Codice_fornitore').value 
  let Giacenza = document.querySelector('#Giacenza').value

  let insert = {ID_polvere, ID_interno_polvere, Descrizione, Codice_fornitore, Giacenza}

  fetch(url+'/updatePolvere/'+ID_polvere,{
    headers: {
      'Content-type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(insert)
  })
  .then(response => response.json())
  .then(data => {
    if(data.success){  
      fetch(url+'/getAllPolvere')
      .then(response => response.json())
      .then(data => tabellaPolvere(data['data']));
    }
  });
  document.querySelector('#ID_polvere').value = '';
  document.querySelector('#ID_interno_polvere').value = '';
  document.querySelector('#Descrizione').value = '';
  document.querySelector('#Codice_fornitore').value = '';
  document.querySelector('#Giacenza').value = '';
  document.getElementById('edit').hidden = true;
  document.getElementById('add_btn').hidden = false;
}

//creates the table from input data
function tabellaPolvere(data){
    const table = document.querySelector('table tbody');
    let tableHtml = "";
    data.forEach(function ({ID_polvere, ID_interno_polvere, Descrizione, Codice_fornitore,Giacenza}){
      tableHtml += "<tr>";
      tableHtml += '<td>'+ ID_polvere +'</td>';
      tableHtml += '<td>'+ ID_interno_polvere +'</td>';
      tableHtml += '<td>'+ Descrizione +'</td>';
      tableHtml += '<td>'+ Codice_fornitore +'</td>';
      tableHtml += '<td>'+ Giacenza +'</td>';
      tableHtml += '<td><button style = "margin-top: 10px; width: 200px; height: 50px;" class="edit-row-btn" data-id='+ID_polvere+'>Edit</td>'
      tableHtml += '</tr>'
    });
    table.innerHTML = tableHtml;
}

//serch
function serch(){
    let cerca = document.querySelector('#serch').value.trim().toUpperCase();
    let values = document.querySelector('#tab-ordini tbody').rows
    if(cerca==''){
      for(i=1;i<values.length;i++){
        var row = values[i];
        row.style.display = '';
      }
    }else{
      for(i=0;i<values.length;i++){
        let row = values[i];
        let cols = values[i].getElementsByTagName('td');
        for(j=0;j<cols.length;j++){
          if(cols[j].innerHTML.toString().toUpperCase().includes(cerca)){
            row.style.display = '';
            break         
          }else{
            row.style.display = 'none';
          }
        }
      }
    }
}

//resets the serch process
function delSerch(){
    document.querySelector('#serch').value = '';
    serch('');
}

//AUTOCOMPLETE
function autocomplete(inp,arr){
    var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
    
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  
}