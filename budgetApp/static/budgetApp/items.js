var page = 1;
document.addEventListener('DOMContentLoaded', function() {
    const userId = document.querySelector('#custId').value;
    document.querySelector('#newItem').addEventListener('click', () => load_newItem(userId));
    document.querySelector('#goBack').addEventListener('click', () => load_items(userId));
    document.querySelector('#createItem').addEventListener('click', () => create_Item(userId));
    load_items(userId);
});

function load_newItem(userID){
  document.querySelector('#button-create').style.display = 'none';
  document.querySelector('#button-back').style.display = 'block';
  document.querySelector('#new-view').style.display = 'block';
  document.querySelector('#items-view').style.display = 'none';
  document.querySelector('#typeProduct').innerHTML = '';
  document.querySelector('#unitProduct').innerHTML = '';
  get_types(userID);
  get_units(userID);
}

function load_items(userID){
  document.querySelector('#button-create').style.display = 'block';
  document.querySelector('#button-back').style.display = 'none';
  document.querySelector('#new-view').style.display = 'none';
  document.querySelector('#items-view').style.display = 'block';
  document.querySelector('tbody').innerHTML = '';
  get_items(userID);
  
}

function get_items(userID){
  fetch('/getItems', {
    method: 'POST',
    body: JSON.stringify({
        userID: userID
    })
  })
  .then(response => response.json())
  .then(results => {
  results.forEach(element => {
    row_item(element);
  })
  });
}

function get_types(userID){
  fetch('/types', {
    method: 'POST',
    body: JSON.stringify({
        userID: userID
    })
  })
  .then(response => response.json())
  .then(results => {
    results.forEach(element => {
      load_types(element);
    })
  });
};

function get_units(userID){
  fetch('/units', {
    method: 'POST',
    body: JSON.stringify({
        userID: userID
    })
  })
  .then(response => response.json())
  .then(results => {
    results.forEach(element => {
      load_units(element);
      console.log(element)
    })
  });
};

function load_types(element){

  const tipo_nombre  = document.createElement('option');
  tipo_nombre.innerHTML = element.name
  document.querySelector('#typeProduct').append(tipo_nombre);

};

function load_units(element){

  const unidad_nombre  = document.createElement('option');
  unidad_nombre.innerHTML = element.name
  document.querySelector('#unitProduct').append(unidad_nombre);

};

function row_item(element){

  const fila = document.createElement('tr');

  const nombre     = document.createElement('td')
  nombre.innerHTML = element.name
  const tipo       = document.createElement('td')
  tipo.innerHTML = element.type
  const unidades   = document.createElement('td')
  unidades.innerHTML = element.units
  const costo_unid = document.createElement('td')
  costo_unid.innerHTML = element.cost
  const eliminar = document.createElement('td')
  const boton = document.createElement('button')
  boton.className = "btn btn-danger";
  boton.innerHTML = "Delete";
  boton.addEventListener('click', () => delete_item(element.user, element.name));
  eliminar.append(boton)

  fila.append(nombre)
  fila.append(tipo)
  fila.append(unidades)
  fila.append(costo_unid)
  fila.append(eliminar)

  document.querySelector('tbody').append(fila);

};

function create_Item(userID){
  
  const name     = document.querySelector('#nameProduct').value;
  const tipo     = document.querySelector('#typeProduct').value;
  const unidades = document.querySelector('#unitProduct').value;
  const cost     = document.querySelector('#costProduct').value;

  fetch('/create_item', {
    method: 'POST',
    body: JSON.stringify({
        user: userID,
        name: name,
        type: tipo,
        units: unidades,
        cost: cost
      })
  })
  var delayInMilliseconds = 300
  setTimeout(function() {
    load_items(userID);
  }, delayInMilliseconds);

  return false
};

function delete_item(user, name){
  fetch('/delete_item', {
    method: 'POST',
    body: JSON.stringify({
        user: user,
        name: name
      })
  })
  var delayInMilliseconds = 300
  setTimeout(function() {
    load_items(user);
  }, delayInMilliseconds);
  return false
}