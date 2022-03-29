let formulario = document.querySelector("form")

let errores = []

function validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
        return true
    } else {
        return false
    }
}
let nombre = document.querySelector("#nombre")

let apellido = document.querySelector("#apellido")

let email = document.querySelector("#email")

let password = document.querySelector("#password")

formulario.addEventListener("submit", (e) => {

    errores = []

    if (email.value != "") {
        if (validarEmail(email.value) == false) {
            errores.push("La dirección de email es incorrecta.")
        }
    } else {
        errores.push("Debe ingresar email");
    }


    if (password.value != "") {
        if (password.value.length < 8) {
            errores.push("La contraseña debe tener al menos 8 caracteres");
        }
    } else {
        errores.push("Debe ingresar contraseña");
    }

    if (nombre.value != "") {
        if (nombre.value.length < 2) {
            errores.push("El nombre debe tener al menos 2 caracteres");
        }
    } else {
        errores.push("Debe ingresar nombre");
    }

    if (apellido.value != "") {
        if (apellido.value.length < 2) {
            errores.push("El apellido debe tener al menos 2 caracteres");
        }
    } else {
        errores.push("Debe ingresar apellido");
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