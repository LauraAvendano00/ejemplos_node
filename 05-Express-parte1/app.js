const express = require('express');
const Joi = require('@hapi/joi'); //se solicita el paquete joi
const app = express(); //Instanciar express

 app.use(express.json());//middleware que permite utilizar formato .json

const usuarios = [
    {id:1, nombre:'Grover'},
    {id:2, nombre:'Pablo'},
    {id:3, nombre:'Ana'}
];

app.get('/', (req, res) => {//cada método tiene una ruta asignada. Se tiene una función callback adicionalmente
    res.send('Hola Mundo desde Express.');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
    
});

app.get('/api/usuarios/:id',(req, res) => {
    let usuario = existeUsuario(req.params.id);
    
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    
     const {error, value} = validarUsuario(req.body.nombre);
     if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
       res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }   
    
    
});

app.put('/api/usuarios/:id', (req, res) => {
  
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }    
    
    const {error, value} = validarUsuario(req.body.nombre);    
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario); //Para buscar el indice del usuario
    usuarios.splice(index, 1); //para eliminar

    res.send(usuario);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {// Se debe indicar el puerto desde el cuál se van a escuchar las peticiones
    console.log(`Escuchando en el puerto ${port}...`);
})

function existeUsuario(id){
    return(usuarios.find(u => u.id === parseInt(id)));//buscar el usuario
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    console.log(schema.validate({ nombre: nom }));
    return (schema.validate({ nombre: nom })); // Se valida que el nombre sea correcto y cumpla los requisitos
}
