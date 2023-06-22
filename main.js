//Catalogo de productos//
let listadoProductos = [];

function cargarListaProductos()
{
    // TODO: ELIMINAR ESTA LINEA DESPUES DE PROBAR Y MODIFICAR TODO
    sessionStorage.removeItem("productos");  //Borro productos del sessionStorage

    // Obtener el objeto producto guardado en localStorage y convertirlo en JSON
    let listaProductosStorage = JSON.parse(sessionStorage.getItem("productos"));
    if(listaProductosStorage != null)
    {
        listadoProductos = listaProductosStorage;
        cargarCarritoDeComprasDesdeStorage();
        maquetarProductosEnHtml();
    }
    else { //Si no encontre los productos en el session stoage, los voy a buscar "al servidor"
    fetch("./archivos/productos.json")
    .then((response) => response.json())
    .then((data) => {
        listadoProductos = data; 
    
        //STORAGE 
    //PRODUCTOS//
    // Guarda el objeto producto en localStorage y convierte en cadena JSON el objeto JS
    sessionStorage.setItem("productos", JSON.stringify(listadoProductos)); 

cargarCarritoDeComprasDesdeStorage();
maquetarProductosEnHtml();

    });

}
};
cargarListaProductos();

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

//Constructor de Productos//
function Producto (nombre, descripcion,precio,imagenURL){
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;

    // Operador Ternario usando el nombre enviado o imagen generica
    this.imagenURL = imagenURL != null ? imagenURL : "noimage";

    //Agrego el ID automaticamente con la longitud del array
    this.id = listadoProductos.length() +1;
}

function agregarProductoACatalogo (nombre, descripcion,precio, imagenURL){
    let producto = new Producto(nombre, descripcion, precio, imagenURL);
    listadoProductos.push(producto);

    sessionStorage.removeItem("productos");  //Borro productos del sessionStorage
    sessionStorage.setItem("productos", JSON.stringify(listadoProductos));  //Cargo los productos actualiados al SessionStorage
};

//Agregar producto nuevo al catalogo
function crearProductos(){
    let nombre = prompt ("Ingresar nombre del producto a crear");
    let description = prompt ("Ingresar breve descripcion del producto");
    let value = prompt ("Ingresar precio del nuevo producto");

    agregarProductoACatalogo (nombre,description,value);
};
// crearProductos()  // Esta funcion es solo para administradores

//Busqueda por filtrado con nombre//
function buscarProducto (){

    let buscarMasProductos = "";
    
    do {
        let nombre = prompt ("Ingrese el nombre del producto que desea buscar");
        const productoEncontrado = listadoProductos.find(item => item.nombre.toLowerCase() === nombre.toLowerCase());

        if (productoEncontrado){
            let mensaje = 
            `Nombre del producto : ${productoEncontrado.nombre}
Descripcion : ${productoEncontrado.descripcion}
Precio : $ ${productoEncontrado.precio}`;

        alert (mensaje);

        
        let agregarProducto = prompt ("¿Desea agregar el producto seleccionado al carrito? Responda Si o No");
        if (agregarProducto.toLowerCase() === "si"){
            agregarProductoAlCarrito(productoEncontrado);
        }

        buscarMasProductos = prompt ("¿Desea buscar mas productos? Responda Si o No");
        }
        else{
            alert (`Producto no encontrado`);
        }
    }
    while(buscarMasProductos.toLowerCase() === "si")

    listarCarritoDeCompras()
};

//Agregar producto al carrito de compras//
function agregarProductoAlCarrito (idProducto){

    let productoAgregar = listadoProductos.find(item => item.id === idProducto);
    carritoDeCompras.push (productoAgregar); // Agrego el producto al array de carrito de compras
    
    //Actualiza la cantidad de elementos que tiene el carrito de compras en el P
    document.getElementById("ElementosCarrito").innerText = carritoDeCompras.length;
    // Actualizar el carrito de compras en el localStorage
    localStorage.removeItem("carrito"); //Elimino el carrito del localStorage actual con el removeItem
    localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));  // Vuelvo a cargar el carrito actualizado en el localStorage con el setItem
};

//Cargar desde el listado de productos, todos los productos
function maquetarProductosEnHtml()
{
    let contenedorProductos = document.getElementById("rowProductos");
    listadoProductos.forEach( (item) => {
        let div = document.createElement("div"); 
        div.className = "col-12 col-sm-6 col-lg-4 text-center";
        div.innerHTML = `
                <div class="producto mb-4">
                    <div class="imagen-contenedor">
                        <img src="./imagenes/Productos/${item.imagenURL}.jpg" alt="${item.nombre}" class="imagen-producto">
                    </div>
                    <h3>${item.nombre}</h3>
                    <p>${item.descripcion}</p>
                    <p>Precio: $ ${item.precio}</p>
                    <div class="botonCarrito text-center" >
                        <button id="botonCarrito-${item.id}">Agregar al carrito</button>
                    </div>
                </div>
                `;

        contenedorProductos.append(div);
        let btnAgregar = document.getElementById(`botonCarrito-${item.id}`)
        btnAgregar.addEventListener('click', ()=>{
            agregarProductoAlCarrito(item.id);
            Toastify({
                text: `Se agrego ${item.nombre} al carrito`,
                duration: 1000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
        })
    })
};
