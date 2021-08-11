const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData();
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

const fetchData = async() =>{
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        
        dibujarCards(data);
    } catch (e) {
        console.log(e)
    }
}

const dibujarCards = data =>{
    data.forEach(prod => {
        templateCard.querySelector('h5').textContent = prod.title;
        templateCard.querySelector('span').textContent = prod.precio;
        templateCard.querySelector('img').setAttribute('src', prod.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = prod.id;
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone);
    })
    cards.appendChild(fragment);
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
}

const setCarrito = obj =>{
    const producto = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        price: obj.querySelector('span').textContent,
        cant: 1
    }

    if (carrito.hasOwnProperty(producto.id)){
        producto.cant = carrito[producto.id].cant + 1
    }

    carrito[producto.id] = {...producto}
    dibujarCarrito(carrito)
}

const dibujarCarrito = (carrito) =>{
    Object.values(carrito).forEach(item =>{
        templateCarrito.querySelector('.id-item').textContent = item.id;
        templateCarrito.querySelector('.name-item').textContent = item.title;
        templateCarrito.querySelector('.cant-item').textContent = item.cant;
        templateCarrito.querySelector('.price-item').textContent = item.cant * item.price;
        templateCarrito.querySelector('.btn-info').dataset.id = item.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = item.id;

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone);
    })

    items.innerHTML = "";
    items.appendChild(fragment)
    dibujarFooter(carrito);
}

const dibujarFooter = (carrito) =>{
    let footerCant = 0;
    let footerPrice = 0;

    if (Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5" class="empty-cart">Carrito vacío - comience a comprar!</th>`

        return
    }

    Object.values(carrito).forEach(item =>{
        footerCant += item.cant;
        footerPrice += parseInt(item.price * item.cant); 
    })

    templateFooter.querySelector('.cant-footer').textContent = footerCant;
    templateFooter.querySelector('.price-footer').textContent = footerPrice;

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone);
        
    footer.innerHTML = "";
    footer.appendChild(fragment);
    

    const btnDeleteCarrito = document.getElementById('vaciar-carrito');
    
    if (btnDeleteCarrito != null){
        btnDeleteCarrito.addEventListener('click', () =>{
            carrito = {}
            dibujarCarrito(carrito);
            dibujarFooter(carrito);
        })
    }
}

