var express = require("express");
var app = express();

// Obtenemos los datos de un servidor externo
var datos = require("./datos.js");

//Obtenemos todas las variables de los datos.
var ListaMedico = datos.ListaMedico;
var variables = datos.variables;
var pacientes = datos.pacientes;
var muestras = datos.muestras;
var contadorPaciente = datos.contadorPaciente;

// Configuración de la manera de mostrar formatos json.
app.set('json spaces', 1);

// Creo una carpeta que se llama cliente, y con el express static tiene que ser el nombre de la carpeta, y este método busca el index.html dentro de la carpeta y lo redirije
app.use("/medico", express.static("../Medico"));
app.use("/paciente", express.static("../Paciente"));

// Configuraciones, para que el servidor entienda el formato json.
// Los uses son como imports
app.use(express.json()); // en el req.body tengamos el body JSON

// • 200: Si todo ha ido bien
// • 201: Si un servicio POST ha creado correctamente un registro
// • 404: Si se solicita un elemento que no existe (p.e. GET /api/medico/7, y no 
// existe un médico con código 7)
// • 403: Si la autenticación (login) no es correcta


// Utilizado para mostrar el concepto de las variables
// URL 1, 
app.get("/api/variable", (req, res) => {
    res.status(200).json(variables);
})

// Realiza un login para el médico, en body se indican las credenciales. Por ejemplo: {"login": "xxx", "password": "secreto"}, si va bien se obtiene el id del médico

// Utilizado para realizar el login del médico --> Check
// URL 2,
app.post("/api/medico/login", function (req, res) {

    // Al ser un método post, se define un objeto, cuando el main tiene que pasar por parámetro tiene que tener la misma forma.
    var medico = { //Usamos un objeto cuando hay más de un campo
        login: req.body.login, // Req.body es la variable que le pasamos a postman
        password: req.body.password //Req.body es la variable que se la va a pasar por parámetro en el main.
    };

    //Recorremos la lista de los médicos
    for (var i = 0; i < ListaMedico.length; i++) {
        //Si el login está y la contraseña tambiéne está entra en la condición.
        if (medico.login == ListaMedico[i].login && medico.password == ListaMedico[i].password) {
            return res.status(201).json(ListaMedico[i].id);
        }
    }

    return res.status(403).json("La autenticación (login) no es correcta");
});

// /api/paciente/:id get -->Obtiene los datos del paciente indicado (no devolver código de acceso)
// URL 3,

// Utilizado un get dentro de un get

app.get("/api/paciente/:id", (req, res) => {

    var id = req.params.id; //Req.params obtiene referencia a la url que en el main lo introduciremos que paciente queremos.
    // Se crea otra variable para no eliminarlo en la lista original de pacientes-
    var paciente = {};

    for (var i = 0; i < pacientes.length; i++) {
        if (pacientes[i].id == id) {

            //Esta es la forma de crear nuevo objeto con sus atributos.
            paciente["id"] = pacientes[i].id;
            paciente["nombre"] = pacientes[i].nombre;
            paciente["medico"] = pacientes[i].medico;
            paciente["observaciones"] = pacientes[i].observaciones;
            return res.status(200).json(paciente);
        }
    }

    return res.status(404).json("No se ha encontrado un paciente con dicho id");
})

// Utilizado para obtener los datos del médico --> Check //Tiene la misma forma que el get del paciente anterior.
// URL 4, 
app.get("/api/medico/:id", (req, res) => {

    var id = req.params.id;
    // var medicosc ='{"id": '+ medico[id].id +  '" nombre:" '+ medico[id].nombre + '"login:" ' + medico[id].login + "}" ;

    //Creamos otra variable para no eliminarlo en la lista original

    var medicos = {};

    for (var i = 0; i < ListaMedico.length; i++) {
        if (ListaMedico[i].id == id) {

            medicos["id"] = ListaMedico[i].id;
            medicos["nombre"] = ListaMedico[i].nombre;
            medicos["login"] = ListaMedico[i].login;
            return res.status(200).json(medicos);
        }
    }


    return res.status(404).json("No se ha encontrado un médico con dicho id");



    //En la respuesta utiliza el método de response. Se le aplica el método status 200, para indicar que todo está bien y json es el otro método para mandarlo en formato json.
    // No necesita información por eso solo necesita dos parámetros.
    // El 200 este es para hacer el chequeo luego. El orden de los métodos no debería importar.

});

// Utilizados para obtener todos los pacientes de un médico y mostrarlo en el index.html --> Check
// URL 5, /api/medico/:id/pacientes --> Método get, obtiene un array con los datos de sus pacientes.
app.get("/api/medico/:id/pacientes", (req, res) => {

    // Aquí necesitamos un check porque el bucle puede encontrar más de un paciente por médico: Un médico puede tener más de un paciente
    // var check = false;

    var id = req.params.id; //Este id es el del médico
    // console.log(pacientes.length);
    var pacienteMedico = []
    // Creamos un array y vamos haciendo push este array cada vez que se encuentra un paciente.

    // Recorremos la lsita de pacientes.
    for (var i = 0; i < pacientes.length; i++) {
        // Si el id del médico coincide con el atributo médico que tiene el paciente, hacemos un push de ese paciente a la variable que hemos creado anteriormente
        if (pacientes[i].medico == id) {
            // check = true //Como aquí tenemos mas de un paciente, se debe hacer un check dentro.
            // (Al final hemos elegido esta opción). También lo podríamos hacer con la longitud del pacienteMedico --> Si está vacío error, si no está vacío correcto, de esta manera la variable check no repetiría varias veces la asignación.
            pacienteMedico.push(pacientes[i])
        }
    }
    // Si el objeto no está vacío, se le envia la lista de pacientes
    if (pacienteMedico.length != 0) {
        return res.status(200).json(pacienteMedico)
    } else {
        return res.status(404).json("Este médico no tiene asignado ningún pacientes");
    }
})


// Utilizado para crear un nuevo paciente --> Check
// URL 6, /api/medico/:id/pacientes --> Método post, crea un nuevo paciente
app.post("/api/medico/:id/pacientes", (req, res) => {

    //Id del medico, creamos un paciente de este médico.
    var id = req.params.id;
    // Recorremos la lista de Médico para ver si existe este médico con este id.
    for (var i = 0; i < ListaMedico.length; i++) {
        if (ListaMedico[i].id == id) {
            // Si existe el médico creamos un objeto paciente con las siguientes características
            var paciente = {
                // Si existe creamos un paciente
                id: contadorPaciente,
                nombre: req.body.nombre,
                fecha_nacimiento: req.body.fecha_nacimiento,
                genero: req.body.genero,
                medico: id, //Donde el medico es el id del médico que hemos obtenido la referencia arriba.
                codigo_acceso: req.body.codigo_acceso,
                observaciones: req.body.observaciones
            }


            for (var j = 0; j < pacientes.length; j++) {
                if (pacientes[j].codigo_acceso == paciente.codigo_acceso) {
                    return res.status(404).json("Ya hay un paciente con dicho código de acceso");
                }
            }
            // Estos cuatros campos son obligatorios.

            if (paciente.nombre == '' || paciente.fecha_nacimiento == '' || paciente.genero == '' || paciente.genero == 'Seleccione' || paciente.codigo_acceso == '') {
                res.status(404).json("Por favor, rellene los campos obligatorios (Nombre, fecha de nacimiento, genero, código de acceso)");
            } else {
                pacientes.push(paciente);
                contadorPaciente++;//Cada vez que creo un paciente nuevo, el contador se me va sumando
                return res.status(201).json(paciente);
            }
        }
    }

    return res.status(404).json("No se ha encontrado un médico con dicho id");
})


// Utilizado para modificar los datos de un paciente en concreto --> Check
// URL 7, /api/paciente/:id --> Método put, actualiza los datos de un paciente
app.put("/api/paciente/:id", (req, res) => {

    //Id del paciente.
    var id = req.params.id;
    var nombre = req.body.nombre;
    var fecha_nacimiento = req.body.fecha_nacimiento;
    var genero = req.body.genero;
    var medico = req.body.medico;
    var codigo_acceso = req.body.codigo_acceso;
    var observaciones = req.body.observaciones;

    // Para comprobar si hay algún paciente con el código de acceso
    for (var j = 0; j < pacientes.length; j++) {
        if (pacientes[j].codigo_acceso == codigo_acceso) {
            return res.status(404).json("Ya hay un paciente con dicho código de acceso");
        }
    }

    // Los campos han de estar rellenados.
    if (nombre == '' || fecha_nacimiento == '' || genero == '' || codigo_acceso == '') {
        return res.status(404).json("Por favor, rellene todos los campos obligatorios")
    }

    // Si todo funciona bien -->
    else {
        for (var i = 0; i < pacientes.length; i++) {
            // Los campos no pueden estar vacíos.
            if (pacientes[i].id == id) {
                // Si existe, se sustituyen los valores de ese paciente por el que introducimos en el main (en el body)
                pacientes[i].id = id; //Aquí el id no debería cambiarse, pero por si acaso lo ponemos.
                pacientes[i].nombre = nombre;
                pacientes[i].fecha_nacimiento = fecha_nacimiento;
                pacientes[i].genero = genero;
                pacientes[i].medico = medico; //Si no hay que cambiar el médico simplemente es cambiarlo de aquí y ya 
                pacientes[i].codigo_acceso = codigo_acceso;
                pacientes[i].observaciones = observaciones;
                return res.status(200).json(pacientes[i]);
            }
        }

    }
    return res.status(404).json("No se ha encontrado ningún paciente con dicho id")
})

// Utilizado para obtener todas las muestras de ese paciente --> Check
// URL 8, /api/paciente/:id/muestras --> Método get, obtiene todas las muestras de ese paciente
app.get("/api/paciente/:id/muestras", (req, res) => {
    var id = req.params.id;

    // Aquí tengo que crear un booleano, porque va haber más de una muestra en algunos casos.
    // var check = false;

    var muestrasPaciente = [];

    // Recorremos la lista de muestras y vemos si hay un id de este paciente (vemos si este paciente tiene muestra o no). --> Las muestras tienen un atributo "paciente"
    for (var i = 0; i < muestras.length; i++) {
        if (muestras[i].paciente == id) {
            // check = true;
            muestrasPaciente.push(muestras[i]);
        }
    }

    // Función para ordenar las muestras del paciente. De esta manera, las muestras ya lo tenemos ordenados y no lo tenemos que ordenar en el main.
    muestrasPaciente.sort(function (a, b) {
        if (a.variable < b.variable) {
            return -1;
        }
        if (a.variable > b.variable) {
            return 1;
        }
        if (a.fecha < b.fecha) {
            return -1;
        }
        if (a.fecha > b.fecha) {
            return 1;
        }
        return 0;
    })

    // if (check == true) {
    //     res.status(200).json(muestrasPaciente);
    // } else {
    //     res.status(404).json("Dicho paciente no tiene muestras asociadas");
    // }
    if (muestrasPaciente.length != 0) {
        return res.status(200).json(muestrasPaciente);
    } else {
        return res.status(404).json("Dicho paciente no tiene muestras asociadas");
    }
});


// Preparando para el examen:
// Método get
// app.get("/api/", (req, res) => {
// 
// })

// Método post
// app.post("/api/", function(req,res){

// })

// Método delete
// app.delete("/api/", (req, res) => {

// })

// Método put
// app.put("/api/", (req, res) => {

// })

// La aplicación escucha en el puerto 8080
app.listen(8080);