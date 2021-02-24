document.addEventListener('DOMContentLoaded', function() {
  const userId = document.querySelector('#custId').value;
  document.querySelector('#newItem').addEventListener('click', () => load_newBudget(userId));
  document.querySelector('#goBack').addEventListener('click', () => load_budgets(userId));
  document.querySelector('#createItem').addEventListener('click', () => create_Budget(userId));
  load_budgets(userId);
});

function load_budgets(userID){
  document.querySelector('#button-create').style.display = 'block';
  document.querySelector('#button-back').style.display = 'none';
  document.querySelector('#new-view').style.display = 'none';
  document.querySelector('#budgets-view').style.display = 'block';
  document.querySelector('#products-view').style.display = 'none';
  document.querySelector('#add-view').style.display = 'none';
  document.querySelector('tbody').innerHTML = '';
  document.querySelector('#message-alert').innerHTML = '';
  get_budgets(userID);
  
}

function load_newBudget(userID){
  document.querySelector('#button-create').style.display = 'none';
  document.querySelector('#button-back').style.display = 'block';
  document.querySelector('#new-view').style.display = 'block';
  document.querySelector('#budgets-view').style.display = 'none';
  document.querySelector('#products-view').style.display = 'none';
  document.querySelector('#add-view').style.display = 'none';
}

function load_products(userID, name,message){
  document.querySelector('#button-create').style.display = 'none';
  document.querySelector('#button-back').style.display = 'block';
  document.querySelector('#new-view').style.display = 'none';
  document.querySelector('#budgets-view').style.display = 'none';
  document.querySelector('#products-view').style.display = 'block';
  document.querySelector('#add-view').style.display = 'block';
  document.querySelector('#name-product').innerHTML = "Budget: " + name;
  document.querySelector('tbody').innerHTML = '';
  document.querySelector('#quantityProduct').value = 1;
  document.querySelector('#productName').innerHTML = '';
  document.querySelector('#product-row').innerHTML = '';
  document.querySelector('#message-alert').innerHTML = '';
  showProducts(userID,name);
  get_items(userID);
  if (message != ''){
    mensaje = document.createElement('div');
    mensaje.className = "alert alert-success";
    mensaje.role = "alert";
    mensaje.innerHTML = message;
    document.querySelector('#message-alert').append(mensaje)
  }

  document.querySelector('#addProduct').addEventListener('click', () => addProduct(userID, name));

}

function load_products_refresh(userID, name,message){
  document.querySelector('#button-create').style.display = 'none';
  document.querySelector('#button-back').style.display = 'block';
  document.querySelector('#new-view').style.display = 'none';
  document.querySelector('#budgets-view').style.display = 'none';
  document.querySelector('#products-view').style.display = 'block';
  document.querySelector('#add-view').style.display = 'block';
  document.querySelector('#name-product').innerHTML = "Budget: " + name;
  document.querySelector('tbody').innerHTML = '';
  document.querySelector('#quantityProduct').value = 1;
  document.querySelector('#productName').innerHTML = '';
  document.querySelector('#product-row').innerHTML = '';
  document.querySelector('#message-alert').innerHTML = '';
  showProducts(userID,name);
  get_items(userID);
  if (message != ''){
    mensaje = document.createElement('div');
    mensaje.className = "alert alert-success";
    mensaje.role = "alert";
    mensaje.innerHTML = message;
    document.querySelector('#message-alert').append(mensaje)
  }

}


function get_budgets(userID){
  fetch('/getBudgets', {
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
  return false
}

function row_item(element){

  const fila = document.createElement('tr');

  const nombre     = document.createElement('td')
  nombre.innerHTML = element['name']
  nombre.addEventListener('click', () => load_products(element['user'], element['name'],''));
  const tiempo       = document.createElement('td')
  tiempo.innerHTML = element['timestamp']

  const eliminar = document.createElement('td')
  const boton = document.createElement('button')
  boton.className = "btn btn-danger";
  boton.innerHTML = "Delete";
  boton.addEventListener('click', () => deleteBudget(element['user'], element['name']));
  eliminar.append(boton)

  fila.append(nombre)
  fila.append(tiempo)
  fila.append(eliminar)

  document.querySelector('#budget-row').append(fila);

};

function create_Budget(userID){
  
  const name     = document.querySelector('#nameBudget').value;

  fetch('/create_budget', {
    method: 'POST',
    body: JSON.stringify({
        user: userID,
        name: name
      })
  })

  var delayInMilliseconds = 300
  setTimeout(function() {
    load_budgets(userID);
  }, delayInMilliseconds);


  return false
};

function showProducts(user, budgetName){

  fetch('/getProducts', {
    method: 'POST',
    body: JSON.stringify({
        userID: user,
        name: budgetName
      })
  })
  .then(response => response.json())
  .then(results => {
  var total = 0;
  results.forEach(element => {
    row_product(element, budgetName);
    total = total + element['cost']*element['quantity']
  });
  const fila = document.createElement('tr');
  fila.className = "table-primary";
  const nombreTotal= document.createElement('td')
  nombreTotal.colSpan=4
  nombreTotal.innerHTML = "Total"
  const costoTotal = document.createElement('td');
  costoTotal.innerHTML = total;

  fila.append(nombreTotal)
  fila.append(costoTotal)
  document.querySelector('#product-row').append(fila);

  });

  return false
}

function row_product(element, budgetName){

  const fila = document.createElement('tr');

  const nombre     = document.createElement('td')
  nombre.innerHTML = element['name']
  const costo     = document.createElement('td')
  costo.innerHTML = element['cost']
  const unidades    = document.createElement('td')
  unidades.innerHTML = element['units']
  const cantidad    = document.createElement('td')
  cantidad.innerHTML = element['quantity']
  const total    = document.createElement('td')
  total.innerHTML = element['quantity']*element['cost']



  const eliminar = document.createElement('td')
  const boton = document.createElement('button')
  boton.className = "btn btn-danger";
  boton.innerHTML = "Delete";
  boton.addEventListener('click', () => deleteProduct(element['user'], element['id'], budgetName));
  eliminar.append(boton)

  fila.append(nombre)
  fila.append(unidades)
  fila.append(costo)
  fila.append(cantidad)
  fila.append(total)
  fila.append(eliminar)

  document.querySelector('#product-row').append(fila);

};

function addProduct(userId, budgetName){

  const quantity    = document.querySelector('#quantityProduct').value;
  const productName = document.querySelector('#productName').value;

  fetch('/addProduct', {
    method: 'POST',
    body: JSON.stringify({
        userID: userId,
        budgetName: budgetName,
        quantity: quantity,
        name: productName
      })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result['message'])
    var delayInMilliseconds = 500
    setTimeout(function() {
      load_products_refresh(userId, budgetName, result['message']);
    }, delayInMilliseconds);
  });

  // var delayInMilliseconds = 500
  // setTimeout(function() {
  //   load_products(userId, budgetName, mensaje);
  // }, delayInMilliseconds);


  return false
}


function get_items(userId){
  fetch('/getItems', {
    method: 'POST',
    body: JSON.stringify({
        userID: userId
    })
  })
  .then(response => response.json())
  .then(results => {
  results.forEach(element => {
    showItem(element);
  })
  });
};

function showItem(element){

  const tipo_nombre  = document.createElement('option');
  tipo_nombre.innerHTML = element.name
  document.querySelector('#productName').append(tipo_nombre);

};

function deleteProduct(user, productID, budgetName){

  fetch('/deleteProduct', {
    method: 'POST',
    body: JSON.stringify({
        userID: user,
        productID: productID,
        budgetName: budgetName
      })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result['message'])
    var delayInMilliseconds = 400
    setTimeout(function() {
      load_products_refresh(user, budgetName, result['message']);
    }, delayInMilliseconds);
  });

  // var delayInMilliseconds = 400
  // setTimeout(function() {
  //   load_products(user, budgetName,'');
  // }, delayInMilliseconds);


  return false

}

function deleteBudget(userID, budgetName){
  fetch('/deleteBudget', {
    method: 'POST',
    body: JSON.stringify({
        userID: userID,
        budgetName: budgetName
      })
  })

  var delayInMilliseconds = 300
  setTimeout(function() {
    load_budgets(userID);
  }, delayInMilliseconds);


  return false
}