const addButtons = document.querySelectorAll('.add-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartButton = document.getElementById('cart-button');
const orderListElement = document.getElementById('order-list');
const whatsappBtn = document.getElementById('whatsapp-btn');
const addressInput = document.getElementById('address');

const addSound = document.getElementById('add-sound');
const removeSound = document.getElementById('remove-sound');

let orderList = [];

// Abrir/cerrar carrito
cartButton.addEventListener('click', () => { cartSidebar.classList.toggle('active'); });

// Animación y sonido al agregar
function animateAdd(li){ 
  li.style.transform='scale(0.8)'; 
  li.style.opacity=0; 
  setTimeout(()=>{ 
    li.style.transition='all 0.3s ease'; 
    li.style.transform='scale(1)'; 
    li.style.opacity=1; 
  },50); 
  addSound.play(); 
}

// Actualiza carrito
function updateCart(){
  orderListElement.innerHTML='';
  let total=0;
  orderList.forEach((item,index)=>{
    const li=document.createElement('li');
    const img=document.createElement('img'); img.src=item.img; img.alt=item.name;
    const text=document.createElement('span'); text.textContent=`${item.name} x${item.quantity}`;
    const removeBtn=document.createElement('button'); removeBtn.textContent='Quitar'; removeBtn.className='remove-btn';
    removeBtn.onclick=()=>{ 
      item.quantity--; 
      if(item.quantity===0) orderList.splice(index,1); 
      updateCart(); 
      removeSound.play(); 
    };
    li.appendChild(img); li.appendChild(text); li.appendChild(removeBtn);
    orderListElement.appendChild(li);
    animateAdd(li);
    total+=item.price*item.quantity;
  });
  document.getElementById('total-price').textContent=`Total: $${total.toLocaleString()}`;
}

// Agregar productos
addButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const name=btn.dataset.item; const price=parseInt(btn.dataset.price); const img=btn.dataset.img;
    const exist=orderList.find(i=>i.name===name); 
    if(exist) exist.quantity++; 
    else orderList.push({name,price,img,quantity:1});
    updateCart();
  });
});

// Enviar por WhatsApp
whatsappBtn.addEventListener('click',()=>{
  const address=addressInput.value.trim();
  if(orderList.length===0){ alert('Agrega productos'); return;}
  if(address===''){ alert('Ingresa tu dirección'); return;}
  const phone='573135330679'; // Cambiar
  const items=orderList.map(i=>`${i.name} x${i.quantity}`).join('\n- ');
  const message=`Hola, quiero hacer el siguiente pedido:\n- ${items}\nDirección: ${address}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,'_blank');
});

