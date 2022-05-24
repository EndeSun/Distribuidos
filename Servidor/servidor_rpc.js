var rpc = require("./rpc.js");



// De alguna manera tengo que conectar el servidor que contiene la base de datos del médico con 
// el del paciente, para poder tener las mismas variables y trabajar con ellas.

// De esta manera obtenemos todos los datos necesarios. En datos, estas variables se exportan con module.exports.NombreVariableQueAsigno = NombreVariableQueQuieroExportar 
var datos = require("./datos.js");
var ListaMedico = datos.ListaMedico;
var variables = datos.variables;
var pacientes = datos.pacientes;
var muestras = datos.muestras;
var contadorMuestras = datos.contadorMuestras;

// Descripción: Realiza un login para paciente.

// Función 1
// Devuelve un objeto con todos los datos del paciente o NULL si el código no es correcto
function login(codigoAcceso) {
    for (var i = 0; i < pacientes.length; i++) {
        // Por si acaso, que no entre con contraseña vacía.
        if (pacientes[i].codigo_acceso == codigoAcceso && codigoAcceso != '') {
            return (pacientes[i])
        }
    }
    return (null);
}

// Descripción: Obtiene un listado de las variables

// Función 2
// Devuelve un array con todas las variables
function listadoVariables() {
    return (variables);
}

// Descripción: Obtiene los datos del médico indicado

// Función 3
// Devuelve un objeto con los datos del médico (excepto login y password). Si no existe devuelve NULL.
function datosMedico(idMedico) {
    var medico = {};
    for (var i = 0; i < ListaMedico.length; i++) {
        if (ListaMedico[i].id == idMedico) {
            medico["id"] = ListaMedico[i].id;
            medico["nombre"] = ListaMedico[i].nombre;
            return (medico);
        }
    }
    return (null);
}


// Descripción: Obtiene un listado de los valores de variables del paciente

// Función 4
// Devuelve un array con todos las muestras introducidos por ese paciente.
function listadoMuestras(idPaciente) {

    var muestraPac = [];

    for (var i = 0; i < muestras.length; i++) {
        if (muestras[i].paciente == idPaciente) {
            muestraPac.push(muestras[i]);
        }
    }

    if (muestraPac.length != 0) {
        return (muestraPac);
    } else {
        return (null)
    }

}

// Descripción: añade una nueva muestra

// Función 5
// Devuelve el Id de la nueva muestra
function agregarMuestra(idPaciente, idVariable, fecha, valor) {
    // console.log("Nueva muestra", idPaciente, idVariable, fecha, valor);
    if (!idPaciente || !idVariable || !fecha || !valor || idVariable > variables.length) {
        return -1;
    } else {
        var nuevaMuestra = {
            id: contadorMuestras,
            paciente: idPaciente,
            variable: idVariable,
            fecha: fecha,
            valor: valor
        }
        retorno = contadorMuestras;
        muestras.push(nuevaMuestra);
        contadorMuestras++;
        return (retorno);
    }
}


// Descripción: Elimina una muestra

// Función 6
// Devuelve un booleano indicando si ha ido bien
function eliminarMuestra(idValor) {
    for (var i = 0; muestras.length; i++) {
        if (muestras[i].id == idValor) {
            muestras.splice(i, 1); //Borra en la posición encontrada, 1 objeto.
            // console.log("Muestra borrada con identificador", idValor);
            return true;
        }
    }
    return false;
}

// Función implementada en el examen --> aumentar los valores de todas las muestras en 1.
function incrementar(idPaciente){
    for(var i = 0; i < muestras.length; i++){
        if(muestras[i].paciente == idPaciente){
            muestras[i].valor += 1;
        }
    }

    return muestras;
}

// Se definen las funciones del servidor, funciones normales de javascript
// function anyadirPaciente(nombre, apellidos, edad){
//     console.log("Nuevo Paciente", nombre, apellidos, edad);
//     if(!nombre || !apellidos || !edad){
//         return -1;
//     }else{
//         var nuevoPaciente={id: nuevoId, nombre: nombre, apellidos: apellidos, edad:edad}
//         var retorno=nuevoId;
//         pacientes.push(nuevoPaciente);
//         nuevoId++;
//         return retorno;
//     }
// }

// function eliminarPaciente(id){
//     for(var i=0; i<pacientes.length; i++){
//         if(pacientes[i].id==id){
//             //Borrar el paciente
//             pacientes.splice(i,1);
//             console.log("Paciente borrado con identificador", id);
//             return true;
//         }
//     }
//     return false;
// }



// Se crea un servidor
var servidor = rpc.server();

// Se crea una aplicación RPC en el servidor con un identificador determinado
var app = servidor.createApp("MiGestionPacientes");

// Se registran los procedimientos asociados a la aplicación
app.register(login);
app.register(listadoVariables);
app.register(datosMedico);
app.register(listadoMuestras);
app.register(agregarMuestra);
app.register(eliminarMuestra);
app.register(incrementar);

// Preparando para el examen
// app.register();
// app.register();
// app.register();

