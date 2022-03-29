let formulario = document.querySelector("form")

let errores = []

function validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
        return true
    } else {
        return false
    }
}

let email = document.querySelector("#email")

email.addEventListener('blur', () => {

    if (email.value != "") {
        if (validarEmail(email.value) == false) {
            let mensaje = "La dirección de email es invalida"
            document.querySelector(".mensaje-error").innerHTML = `<li>${mensaje}</li>`
        } else {
            let mensaje = ""
            document.querySelector(".mensaje-error").innerHTML = `<li>${mensaje}</li>`
        }
    } else {
        let mensaje = ""
        document.querySelector(".mensaje-error").innerHTML = `<li>${mensaje}</li>`
    }

})

let password = document.querySelector("#password")

password.addEventListener('blur', () => {
    if (password.value != "") {
        if (password.value.length < 8) {
            let mensaje = "La contraseña debe tener al menos 8 caracteres"
            document.querySelector("#mensaje-error-pass").innerHTML = `<li>${mensaje}</li>`
        } else {
            let mensaje = ""
            document.querySelector("#mensaje-error-pass").innerHTML = `<li>${mensaje}</li>`
        }
    } else {
        let mensaje = ""
        document.querySelector("#mensaje-error-pass").innerHTML = `<li>${mensaje}</li>`
    }
})

formulario.addEventListener("submit", (e) => {

    errores = []

    if (email.value != "") {
        if (validarEmail(email.value) == false) {
            errores.push("La dirección de email es incorrecta.")
        }
    } else {

    }

    if (password.value != "") {
        if (password.value.length < 8) {
            errores.push("La contraseña debe tener al menos 8 caracteres");
        }
    } else {
        errores.push("Debe ingresar contraseña");
    }

    if (errores.length > 0) {
        e.preventDefault()

        let lista = document.querySelector(".lista-errores")

        console.log(lista)

        errores.forEach(error => {
            lista.innerHTML += `<li>${error}</li>`
        })

    }

})