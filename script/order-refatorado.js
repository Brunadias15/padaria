import { data } from './data.js'
import { formatCurrency } from './format-currency.js'

function createListItemProductOrder(id, name, price, image, quantity){
  const formatedPrice = formatCurrency(price * quantity) 

  return `
    <li class="order-item" data-idorder="${id}">
      <div class="order-img">
        <img src="${image}" alt="">
      </div>
      <div class="order-text">
        <span class="order-name">${name}</span>
        <span class="order-price" data-price="${price}">${formatCurrency(price)}</span>
      </div>
      <div class="order-quantity">
        <input class="order-qty" type="number" min="1" value="${quantity}" data-idproduct="${id}"/>
        <span class="order-total" data-total-price="${price * quantity}">${formatedPrice}</span>
      </div>
    </li>
  `
}


function updateTotalItensPrice() {
  let totalPrice = 0

  const cartItens = document.querySelectorAll('.order-list .order-item')
  const totalItensPriceSpam = document.querySelector('#total')

  cartItens.forEach(item => {
    const orderSpanTotal = item.querySelector('span.order-total')
    const currentOrderTotalPrice = Number(orderSpanTotal.getAttribute('data-total-price'))

    totalPrice += currentOrderTotalPrice
  })

  totalItensPriceSpam.innerHTML = formatCurrency(totalPrice)
}


function updateItemTotalPrice(itemId, newPrice){
  const itemInCart = document.querySelector(`[data-idorder="${itemId}"]`)
  const orderTotalSpan = itemInCart.querySelector('span.order-total')
  
  orderTotalSpan.innerHTML = formatCurrency(newPrice)
  orderTotalSpan.setAttribute('data-total-price', newPrice)

 
  updateTotalItensPrice()
}


function updateItensInputCartEvent(){
  const cartItens = document.querySelectorAll('.order-list li')

  cartItens.forEach(item => {
    const orderId = Number(item.getAttribute('data-idorder'))
    const itemPrice = item.querySelector('span.order-price').getAttribute('data-price')
    const itemInputQuantity = item.querySelector('input.order-qty')
    
    itemInputQuantity.addEventListener("input", (event) => {
      const currentInput = event.currentTarget

      currentInput.setAttribute('value', currentInput.value)

      
      updateItemTotalPrice(orderId, Number(itemPrice) * currentInput.value)
    })
  })
}


function itensInCartLoader(orderData) {
  const orderDOM = document.querySelector('.order-list')
  const listProduct = orderData.reduce((accumulator, {id, name, price, image, quantity}) =>
  accumulator += createListItemProductOrder(id, name, price, image, quantity), '')
  orderDOM.innerHTML = listProduct

  
  updateItensInputCartEvent()

  
  updateTotalItensPrice()
}


function insertItemInCart({ id, name, price, image, quantity }){
  const orderDOM = document.querySelector('.order-list')
  const itemCartHtml = createListItemProductOrder(id, name, price, image, quantity)
  const itemInCart = orderDOM.querySelector(`[data-idorder="${id}"]`)

  
  if(itemInCart){
    const quantityInput = itemInCart.querySelector('input.order-qty')

    quantityInput.value = Number(quantityInput.value) + 1
    quantityInput.setAttribute('value', quantityInput.value)

    updateItemTotalPrice(id, quantityInput.value * price)
  }
  else{
    orderDOM.innerHTML += itemCartHtml
  }

  
  updateItensInputCartEvent()

  
  updateTotalItensPrice()
}


function handleOrderClick(event){

  const orderId = event.currentTarget.dataset.id
  
  const orderStorage = JSON.parse(localStorage.getItem('order')) || []
 
  const orderProductData = data.find(({ id }) => Number(orderId) === id)
  
  const orderStorageData = orderStorage.find(order => order.id == orderProductData.id)

  if(!orderStorageData){
   
    orderStorage.push(orderProductData)
  }else{
    
    const currentOrderIndexOnData = orderStorage.indexOf(orderStorageData)
    orderStorage[currentOrderIndexOnData].quantity = orderStorage[currentOrderIndexOnData].quantity + 1
  }

 
  localStorage.setItem('order', JSON.stringify(orderStorage))

 
  insertItemInCart(orderProductData)
}


export function handleUpdateOrderItemEvent(elements){
  elements.forEach(element => {
    element.addEventListener("click", handleOrderClick)
  })
}


document.querySelector('#order-finish').addEventListener('click', () => {
  
  localStorage.removeItem('order')

  
  document.querySelector('ul.order-list').innerHTML = ""

  
  document.querySelector('#total').innerHTML = ""
})


itensInCartLoader(JSON.parse(localStorage.getItem('order')) || [])