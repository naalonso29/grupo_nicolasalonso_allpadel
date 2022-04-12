let formulario = document.querySelector("form")

let errores = []

let nombre = document.querySelector("#nombre")
let descripcion = document.querySelector("#descripcion")
let precio = document.querySelector("#precio")
let stock = document.querySelector("#stock")


document.getElementById("file").onchange = function(e) {
    // Creamos el objeto de la clase FileReader
    let reader = new FileReader();
  
    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
    reader.readAsDataURL(e.target.files[0]);
  
    // Le decimos que cuando este listo ejecute el código interno
    reader.onload = function(){
        let preview = document.getElementById('preview')
  
        preview.src = reader.result;

    };
  }

formulario.addEventListener("submit", (e) => {

    errores = []

    if (nombre.value != "") {
        if (nombre.value.length < 5) {
            errores.push("El nombre debe tener al menos 5 caracteres");
        }
    } else {
        errores.push("Debe ingresar nombre");
    }

    if (descripcion.value != "") {
        if (descripcion.value.length < 20) {
            errores.push("La descripcion debe tener al menos 20 caracteres");
        }
    } else {
        errores.push("Debe ingresar descripcion");
    }

    if (precio.value != "") {
        if (isNaN(precio.value)) {
            errores.push("El precio debe ser numerico");
        }
    } else {
        errores.push("Debe ingresar un precio");
    }

    if (stock.value != "") {
        if (isNaN(stock.value)) {
            errores.push("El stock debe ser numerico");
        }
    } else {
        errores.push("Debe ingresar stock");
    }

    if (errores.length > 0) {
        e.preventDefault()

        let lista = document.querySelector(".lista-errores")

        lista.innerHTML = ``

        errores.forEach(error => {
            lista.innerHTML += `<li><small>${error}</small></li>`
        })

    }

})