import { data } from './data.js'
import { formatCurrency } from './format-currency.js'
import { handleUpdateOrderItemEvent } from './order-refatorado.js'

window.onload = function() {
  const categories = document.querySelectorAll('.item-menu')

 
  function createListItemProduct(id, name, price, image) {
    const formatedPrice = formatCurrency(price)
  
    return `
      <li data-id="${id}">
        <a class="list-menu" href="#">
          <div class="list-img">
            <img src="${image}" alt="">
          </div>
          <span class="list-name">${name}</span>
          <span class="list-price">${formatedPrice}</span>
        </a>
      </li>
    `
  }

  
  function productsList(categorySelected = '') {
    const cardapio = document.querySelector('.menu-list')
  
    const listProducts = data.reduce
      (function (accumulator, { id, name, price, image, category }) {
        if (!categorySelected || categorySelected === 'all') {
            accumulator += createListItemProduct(id, name, price, image)
        }
        
        if (categorySelected === category) {
            accumulator += createListItemProduct(id, name, price, image)
        }
        return accumulator
      }, '')
        
    cardapio.innerHTML = listProducts

   
    handleUpdateOrderItemEvent(document.querySelectorAll('.menu-list li'))
  }

  
  categories.forEach(category => {
    category.addEventListener('click', (event) => {
      const categorySelected = event.currentTarget.dataset.category

      
      categories.forEach(item => {
        item.classList.remove('active')
      })

      
      category.classList.add('active')

      
      productsList(categorySelected)
    })
  })

 
  productsList()
}