const path = require('path')
const fs = require('fs')
const res = require('express/lib/response')

const model = {
    listar: () => JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'users.json'))),
    mostrar: id => model.listar().find(e => e.id == id),
    mostrarPorEmail: email => model.listar().find(e => e.email == email),
    guardar: data => {
        let all = model.listar()
        let id = all.length > 0 ? all[all.length - 1].id + 1 : 1
        let nombre = data.nombre
        let apellido = data.apellido
        let email = data.email
        let password = data.password
        let administrador = false
        let imagen = ""
        if (data.imagen == "") {
            imagen = "/img/profiles/default.jpg"
        } else {
            imagen = data.imagen
        }


        let product = { id: id, nombre, apellido, email, password, imagen, administrador }
        all.push(product)
        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'users.json'), JSON.stringify(all, null, 2))
    },
    editar: (req, res) => {
        let usuarioAEditar = model.mostrar(req.session.userLogged.id);

        usuarioAEditar.imagen = '/img/profiles/' + req.file.filename;

        let all = model.listar()

        for (let i = 0; i < all.length; i++) {
            if (all[i].id == req.session.userLogged.id) {
                all[i] = usuarioAEditar;
                console.log(usuarioAEditar)
            }
        }

        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'users.json'), JSON.stringify(all, null, 2));
    }
}



module.exports = model