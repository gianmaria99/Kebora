
let url = "http://localhost:7272"
//let url = "https://kebora.loca.lt"

document.addEventListener('DOMContentLoaded', function(){
  // creazione della tabella ordini
  fetch(url+'/getAllOrdini')
  .then(response => response.json())
  .then(data => tabellaOrdini(data['data']))

  // autocomplete Clienti
  fetch(url+'/clienti')
  .then(response => response.json())
  .then(data => {
    let cliente = document.getElementById("cliente");
    let clienti = new Array(data.length);
    let i = 0;
    data['data'].forEach(function({nome}){
      clienti[i] = nome;
      i+=1;
    })
    autocomplete(cliente,clienti)
  })

  // autocomplete Polvere
  fetch(url+'/polvere')
  .then(response => response.json())
  .then(data => {
    let polvere = document.getElementById("polvere");
    let polveri = new Array(data.length);
    let i = 0;
    data['data'].forEach(function({Descrizione}){
      polveri[i] = Descrizione;
      i+=1;
    })
    autocomplete(polvere,polveri)
  })
  
})

//EDIT AND DELETE
document.querySelector('table tbody').addEventListener('click',function(event){
  if(event.target.className === 'delete-row-btn'){
    let ok = confirm('You really want to delete the order with ID: '+event.target.dataset.id)
    if(ok){
      let ok = confirm(`CONFIRM DELETE ROW WITH ID: ${event.target.dataset.id}`)
      if(ok){
        deleteRowById(event.target.dataset.id);
      }
    }
  }
  if(event.target.className === 'edit-row-btn'){
    let ok = confirm('You really want to edit the order with ID: '+event.target.dataset.id)
    if(ok){
      showEditRowById(event.target.parentNode.parentNode.rowIndex);
    }
  }
})

//NEW ORDER listener to the button that starts a new insert in the table
document.querySelector('#start-new-order-btn').onclick = function () {
  document.getElementById('edit').hidden = false;
  document.querySelector('#start-new-order-btn').hidden = true;
  document.querySelector('#add-name-btn').hidden = false;

  document.querySelector('#table').style.height='500px';
}

//DECLINE
document.querySelector('#btn-decline').onclick = function () {
  document.getElementById('edit').hidden = true;
  document.querySelector('#start-new-order-btn').hidden = false
  document.querySelector('#edit-btn').hidden = true

  document.querySelector('#table').style.height='750px';
  
  document.querySelector('#id').value = '';
  document.querySelector('#cliente').value = '';
  document.querySelector('#referenza').value = '';
  document.querySelector('#data_referenza').value = '';
  document.querySelector('#colore').value = '';
  document.querySelector('#polvere').value = '';
  document.querySelector('#barre_presunte').value = '';
}

// confirm edit
document.querySelector('#edit-btn').onclick = function() {
  let ID_ordine = document.querySelector('#id').value;
  let Cliente = document.querySelector('#cliente').value;
  let Referenza = document.querySelector('#referenza').value;
  let Data_referenza = document.querySelector('#data_referenza').value;
  let Colore = document.querySelector('#colore').value;
  let Polvere = document.querySelector('#polvere').value;
  let Barre_presunte = document.querySelector('#barre_presunte').value;
  
  if(Cliente===''){
    alert('Nessun Cliente inserito, INSERIMENTO NON POSSIBILE')
    return
  }
  const insert = {ID_ordine,Cliente,Referenza,Data_referenza,Colore,Polvere,Barre_presunte};

  document.querySelector('#id').value = '';
  document.querySelector('#cliente').value = '';
  document.querySelector('#referenza').value = '';
  document.querySelector('#data_referenza').value = '';
  document.querySelector('#colore').value = '';
  document.querySelector('#polvere').value = '';
  document.querySelector('#barre_presunte').value = '';

  
  fetch(url+'/updateOrdini/'+ID_ordine,{
    headers: {
      'Content-type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(insert)
  })
  .then(response => response.json())
  .then(data => {
    if(data.success){
      
      fetch(url+'/getAllOrdini')
      .then(response => response.json())
      .then(data => tabellaOrdini(data['data']));
    }
  });

  document.getElementById('edit').hidden = true;
  document.querySelector('#table').style.height='750px';
  document.querySelector('#edit-btn').hidden = true;
  document.querySelector('#start-new-order-btn').hidden = false;
  

}

// button that appies new entry
document.querySelector('#add-name-btn').onclick = function () {
  
  let Cliente = document.querySelector('#cliente').value;
  let Referenza = document.querySelector('#referenza').value;
  let Data_referenza = document.querySelector('#data_referenza').value;
  let Colore = document.querySelector('#colore').value;
  let Polvere = document.querySelector('#polvere').value;
  let Barre_presunte = document.querySelector('#barre_presunte').value;
  
  if(Cliente===''){
    alert('Nessun Cliente inserito, INSERIMENTO NON POSSIBILE')
    return
  }
  document.querySelector('#cliente').value = '';
  document.querySelector('#referenza').value = '';
  document.querySelector('#data_referenza').value = '';
  document.querySelector('#colore').value = '';
  document.querySelector('#polvere').value = '';
  document.querySelector('#barre_presunte').value = '';
  
  const insert = {Cliente,Referenza,Data_referenza,Colore,Polvere,Barre_presunte};
  
  fetch(url+'/insertOrdini',{
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(insert)
  })
  .then(response => response.json())
  .then(data => insertRowIntoTable(data));

  document.getElementById('edit').hidden = true;
  document.querySelector('#start-new-order-btn').hidden = false
  document.querySelector('#table').style.height='750px';

}

//del button of the serch bar
document.querySelector('#del-serch').addEventListener('click', function(){
  document.querySelector('#serch').value = '';
  serch('');
})

//funzione che cerca nella tabella e filtra 
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
// called by the listener in the table body when the button edit is pressed 
function showEditRowById(index){
  document.getElementById('edit').hidden = false;
  document.querySelector('#table').style.height='500px';
  document.querySelector('#start-new-order-btn').hidden = true;
  document.querySelector('#add-name-btn').hidden = true;
  document.querySelector('#btn-decline').hidden = false;
  document.querySelector('#edit-btn').hidden = false;

  let value = document.querySelector('table tbody').rows[index-1];
  value = value.querySelectorAll('td');

  document.querySelector('#id').value = value[0].innerHTML;
  document.querySelector('#cliente').value =  value[1].innerHTML;
  document.querySelector('#referenza').value =  value[2].innerHTML;
  document.querySelector('#data_referenza').value =  value[3].innerHTML;
  document.querySelector('#colore').value =  value[4].innerHTML;
  document.querySelector('#polvere').value =  value[5].innerHTML;
  document.querySelector('#barre_presunte').value =  value[6].innerHTML;

}

// called by the listener in the table body when the button delete is pressed
function deleteRowById(id){
  fetch(url+'/deleteOrdini/'+id,{
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    if(data.success){
      
      fetch(url+'/getAllOrdini')
      .then(response => response.json())
      .then(data => tabellaOrdini(data['data']));
    }
  })
}

// insert the data into the table after the fetch to the DB has gone well
function insertRowIntoTable(data){
  
  const table = document.querySelector('table tbody');
  
  let tableHtml = "<tr>";
  
  tableHtml += "<td>"+ data.insertId+"</td>";
  tableHtml += '<td>'+ data.Cliente +'</td>';
  tableHtml += '<td>'+ data.Referenza +'</td>';
  tableHtml += '<td>'+ data.Data_referenza +'</td>';
  tableHtml += '<td>'+ data.Colore +'</td>';
  tableHtml += '<td>'+ data.Polvere +'</td>';
  tableHtml += '<td>'+ data.Barre_presunte +'</td>'
  tableHtml += '<td>'+ data. Data_inserimento +'</td>'
  tableHtml += '<td><button style = "margin-top: 10px; width: 200px; height: 50px;" class="delete-row-btn" data-id='+data.insertId+'>Delete</td>'
  tableHtml += '<td><button style = "margin-top: 10px; width: 200px; height: 50px;" class="edit-row-btn" data-id='+data.insertId+'>Edit</td>'
  
  tableHtml+="</tr>"
  const newRow = table.insertRow();
  newRow.innerHTML = tableHtml;
}

//creates the table after the page has rendered
function tabellaOrdini(data){
  const table = document.querySelector('table tbody');
  let tableHtml = "";
  data.forEach(function ({ID_ordine, Cliente, Referenza, Data_referenza,Colore,Polvere, Barre_presunte,Data_inserimento}){
    tableHtml += "<tr>";
    tableHtml += '<td>'+ ID_ordine +'</td>';
    tableHtml += '<td>'+ Cliente +'</td>';
    tableHtml += '<td>'+ Referenza +'</td>';
    tableHtml += '<td>'+ Data_referenza +'</td>';
    tableHtml += '<td>'+ Colore +'</td>';
    tableHtml += '<td>'+ Polvere +'</td>';
    tableHtml += '<td>'+ Barre_presunte +'</td>'
    tableHtml += '<td>'+ new Date(Data_inserimento).toLocaleString() +'</td>'
    tableHtml += '<td ><button style = "margin-top: 10px; width: 200px; height: 50px;" class="delete-row-btn" data-id='+ID_ordine+'>Delete</td>'
    tableHtml += '<td><button style = "margin-top: 10px; width: 200px; height: 50px;" class="edit-row-btn" data-id='+ID_ordine+'>Edit</td>'
    tableHtml += '</tr>'
  });
  table.innerHTML = tableHtml;
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
      console.log(arr[1].substr(0,1))
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
