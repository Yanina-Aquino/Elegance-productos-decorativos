//Carrito de compras
let carritoDeCompras = [];

function cargarCarritoDeComprasDesdeStorage()
{
    // Obtener el objeto producto guardado en localStorage y convertirlo en JSON
    let carritoYaCargadoStorage = JSON.parse(localStorage.getItem("carrito"));
    if(carritoYaCargadoStorage != null)
    {
        carritoDeCompras = carritoYaCargadoStorage;
    }
    else{//Guardo en el sessionStorage el listado vacio de carrito
        localStorage.setItem("carrito", JSON.stringify(carritoDeCompras)); 
    }

    //Cargar cantidad de elementos del carrito en el icono
    document.getElementById("ElementosCarrito").innerText = carritoDeCompras.length;
};

//Vaciar carrito de compras
function vaciarCarritoDeCompras()
{
    carritoDeCompras = []; // Vacio la variable local del carrito de compras
    document.getElementById("ElementosCarrito").innerText = carritoDeCompras.length;

    //Reseteo el carrito de compras
    localStorage.removeItem("carrito"); //Elimino el carrito del localStorage actual con el removeItem
    localStorage.setItem("carrito", JSON.stringify(carritoDeCompras)); //Actualizo el carrito dejandolo vacio

    mostrarCarrito();
}

// //Cargar desde el listado de productos, todos los productos
function mostrarCarrito()
{
    // Busca el UL que va a listar los elementos del carrito
    let ulCarrito = document.getElementById("lista-carrito");

    //Lo Vacia para dejarlo en blanco cada vez que se llama
    ulCarrito.innerHTML = "";
    
    //Recorre el carrito de compras actualizado y genera el listado nuevamente
    carritoDeCompras.forEach( (item) => {
        let li = document.createElement("li"); 
        li.innerHTML = `
                <p class="inline">${item.nombre}</p>   <p class="inline">$ ${item.precio}</p> 
                `;

    //Agrega los LI Generados por cada item al UL
    ulCarrito.appendChild(li);
})
//Actualiza valores del carrito
actualizarTotales();
};

function actualizarTotales()
{
    //Mostrar Detalle del total actualizado
    let detalleTotalCarrito = document.getElementById("totalCarrito");
    detalleTotalCarrito.innerText = devolverTotalPrecioCarrito();

    document.getElementById("iva").innerText = calcularIvaSobreElTotal();
    document.getElementById("totalMasIva").innerText = devolverTotalPrecioCarrito() + calcularIvaSobreElTotal();
}

//Sumar total del carrito de compras $$//
function devolverTotalPrecioCarrito (){
    let totalPrecioCarrito = 0;

    for (const i in carritoDeCompras){
        totalPrecioCarrito = totalPrecioCarrito + carritoDeCompras[i].precio;
    }

    return totalPrecioCarrito;
};

//Calcular IVA del total//
function calcularIvaSobreElTotal (){
    return devolverTotalPrecioCarrito() * 0.21;
};

function iniciarPaginaCarrito()
{
    cargarCarritoDeComprasDesdeStorage();
    mostrarCarrito();

    //Busca el boton de vaciar carrito y le pone un listener al momento de clickearlo para llamar a la funcion vaciar carrito
    let btnVaciarCarrito = document.getElementById("vaciar-carrito");
    btnVaciarCarrito.addEventListener('click', ()=>{
        Swal.fire({
            text: '¿Estás seguro que desea vaciar el carrito de compras?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrarlo'
        }).then((result) => {
        if (result.isConfirmed) {
        vaciarCarritoDeCompras();
        Swal.fire(
            
                    'Borrado!',
                    'El carrito de compras se encuentra vacío.',
                    'success'
                )
            }
        });
    });
};

iniciarPaginaCarrito();
