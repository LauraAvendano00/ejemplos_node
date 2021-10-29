const debug = require('debug')('app:inicio'); //Es necesario establecer un parámetro
const dbDebug = require('debug')('app:db'); //para la base de datos
 
const express = require('express');
const Joi = require('@hapi/joi'); //se solicita el paquete joi
const app = express(); //Instanciar express
const morgan = require('morgan'); //Es el antiguo logger
const config = require('config');// Se importa la configuración

 app.use(express.json());//middleware que permite utilizar formato .json

app.use(morgan('tiny')); //Middleware de terceros
app.use(express.urlencoded({extended: true})); //para permitir recibir datos en modo url
app.use(express.static('public')); //para acceder a algún archivo se usa el static y en el parentesis la ruta

//Configuración de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//Uso de middleware de tercero - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado.');
}

//Trabajos con la base de datos
debug('Conenctando con la bd...');


 app.use(function(req,res,next){
    console.log('Autenticando...');
    next();
 })

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
