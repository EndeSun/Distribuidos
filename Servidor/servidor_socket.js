
// Sirven para construir mensajes instantáneas.
// Siempre tiene la misma estructura.
var datos = require("./datos.js");
// La ListaMedico no se ha utilizado
var ListaMedico = datos.ListaMedico;
// Para obtener los nombres de las variables
var variables = datos.variables;
var pacientes = datos.pacientes;
var muestras = datos.muestras;

var contadorMuestras = datos.contadorMuestras;




// Crear un servidor web HTTP
var http = require("http"); //Este viene con node, ya está instalado
var httpServer = http.createServer();
// Crear servidor WS
var WebSocketServer = require("websocket").server; // instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
	httpServer: httpServer
});

// Iniciar el servidor HTTP en un puerto
var puerto = 4444;

// Lo ponemos es un puerto y lo iniciamos
httpServer.listen(puerto, function () {
	// console.log("Servidor de WebSocket iniciado en el puerto:", puerto);
});

// Array de las conexiones
var clientes = []; // Todas las conexiones (clientes) de mi servidor
// var muestrasCompartir = []; //Aquí vamos a guardar las muetras que el paciente tiene cuando va a compartir algo.



// El servidor está esperando una petición de conexión. 
// 
wsServer.on("request", function (request) { // este callback se ejecuta cuando llega una nueva conexión de un cliente
	// En este caso, siempre se acepta, Se puede poner condiciones.
	// Pacientes es un nombre de protocolo.
	var connection = request.accept("pacientes", request.origin); // aceptar conexión
	// Cliente en singular es solo ese cliente.
	var cliente = {connection:connection};
	// Clientes en plural es la lista total. Cuando quiero mandar mensajes, lo busco en clientes.
	clientes.push(cliente); // guardar la conexión

	console.log("Cliente conectado. Ahora hay", clientes.length);
	// Clientes tiene la estructura de --> clientes.connection, clientes.id y clientes.origen

	// Cada vez que el cliente me manda un mensaje. 
	// En esta parte se reciben TOOOOOODOOOOOOOOS LOS MENSAJES.
	connection.on("message", function (message) { // mensaje recibido del cliente
		if (message.type === "utf8") { //Mensaje textuales porque tiene utf8.

			// Se reciben los mensajes de los clientes (médico o paciente).
			console.log("Mensaje del cliente: " + message.utf8Data);
			
			// JSON.parse es para convertir de texto a objeto --> Lo contrario de stringify (que transforma a texto plano).
			var msg = JSON.parse(message.utf8Data);

			// Procesa los datos para obtener todos los pacientes del médico del paciente que ha mandado el mensaje.
			// Este es el primer mensaje que le manda el paciente. (Para obtener la lista de pacientes que tiene su médico)
			// En el cliente no podemos saber qué pacientes tiene el médico.
			if(msg.origen == "paciente1"){

				// Todos los pacientes de ese médico
				var pacientesDelMedico = "";
				pacientesDelMedico = [];
				
				// Recorremos la lista de pacientes para buscar a los pacientes que tengan el mismo médico que el paciente que se ha conectado.
				for(var i = 0; i < pacientes.length; i++){
					if(msg.medicoPacienteConectado == pacientes[i].medico){
						pacientesDelMedico.push(pacientes[i]);
					}
				}

				// Para identificar luego las conexiones
				cliente.id = msg.idPac; //Tenemos  las conexiones y el id del paciente
				cliente.origen = "paciente";
				
				// console.log(cliente);
				// Enviando solo el mensaje a la conexión actual, es decir al paciente.
				connection.sendUTF(JSON.stringify({contenido: "listaPaciente", listaP: pacientesDelMedico}));
			}

			if(msg.origen == "medico"){
				// Para identificar la conexión que se hace desde el médico
				cliente.id = msg.idMedico;
				cliente.origen = "medico";
				// Solo me muestra ese cliente.
				// console.log(cliente);
			}
			
			// Cuando el paciente envía datos para compartir la muestra.
			if(msg.origen == "paciente2"){
				// Construimos el mensaje que se desea compartir.
				var fechaMuestra = "";
				var valorMuestra = "";
				var variableMuestra = "";
				var nombreVariableMuestra = "";

				for(var j in muestras){
					if(msg.idMuestraCompartir == muestras[j].id){
						fechaMuestra = muestras[j].fecha;
						valorMuestra = muestras[j].valor;
						variableMuestra = muestras[j].variable;
					}
				}
				
				for(var k in variables){
					if(variableMuestra == variables[k].id){
						nombreVariableMuestra = variables[k].nombre;
					}
				}

				
				var mensajeCompartir = "";

				mensajeCompartir = msg.nombrePaciente+" ha compartido contigo que el día "+fechaMuestra+" realizó la actividad de "+nombreVariableMuestra+" y obtuvo un valor de "+valorMuestra;
				// console.log(mensajeCompartir);
				// console.log("El id de la persona a compartir es: "+msg.idPersonaCompartir);

				// Le pueden llegar medico, all o el id del paciente que quiere enviar el mensaje.

				// Para el caso de que el paciente quiere compartir al médico
				if(msg.idPersonaCompartir == "medico"){
					// Creo un Variable para ver si está conectado el médico o no.
					var check = false;
					// Recorremos la lista de las conexiones
					for(var m = 0; m < clientes.length; m++){
						// Tiene que cumplir tanto la condición de que sea el mismo id del médico que el paciente ha copartido el mensaje y que la conexión sea médico y no el paciente.
						// msg.medico es el medico del paciente.
						if(msg.medico == clientes[m].id && clientes[m].origen == "medico"){
							check = true
							// Se le envia al médico
							clientes[m].connection.sendUTF(JSON.stringify({contenido:"mensaje",mensaje: mensajeCompartir}));
							// Se le envia al cliente
							connection.sendUTF(JSON.stringify({contenido: "mensajeCorrecto", mensaje: "Mensaje enviado correctamente"}));
						}
					}
					if(check == false){
						// console.log("Su médico no está conectado");
						// Un mensaje de error cuando el medico ese no está conectado.
						// Si no está conectado se le envia el mensaje de error al paciente que desea compartir el mensaje
						connection.sendUTF(JSON.stringify({contenido: "mensajeError", mensaje: "Su médico no está conectado"}));
					}
				}
				
				// Cunado el paciente quiere compartir con todos.
				if(msg.idPersonaCompartir == "all"){
					// El check es para comprobar la conexión
					var check = false;
					for(var n = 0; n < clientes.length; n++){
						// Que no se envie al paciente que ha dado a compartir el mensaje.
						if(clientes[n].origen == "paciente" && clientes[n].id != msg.idPaciente){
							check = true;
							// Para compartir a todos
							clientes[n].connection.sendUTF(JSON.stringify({contenido:"mensaje", mensaje: mensajeCompartir}));
							// Devolver la respuesta al paciente que ha compartido la muestra.
							connection.sendUTF(JSON.stringify({contenido: "mensajeCorrecto", mensaje: "Mensaje enviado correctamente"}));
						}
					}
					if(check == false){
						// Un mensaje de error cuando el paciente ese no está conectado.
						connection.sendUTF(JSON.stringify({contenido: "mensajeError", mensaje: "No hay ningún paciente conectado"}));
					}
				}

				// Cuando el paciente quiere compartir a un paciente de su médico en concreto
				if(msg.idPersonaCompartir != "all" && msg.idPersonaCompartir != "medico"){
					var check = false;
					for(var o = 0; o < clientes.length; o++){
						// mag.idPersonaCompartir es el id del paciente que quiere compartir.
						
						if(clientes[o].origen == "paciente" && clientes[o].id == msg.idPersonaCompartir){
							// Un check de que el mensaje se ha enviado correctamente al usuario destinado.
							check = true;
							clientes[o].connection.sendUTF(JSON.stringify({contenido:"mensaje", mensaje: mensajeCompartir}));
							connection.sendUTF(JSON.stringify({contenido: "mensajeCorrecto", mensaje: "Mensaje enviado correctamente"}));
						}
					}
					if(check == false){
						// console.log("Este paciente no está conectado");
						// Un mensaje de error cuando el paciente ese no está conectado.
						connection.sendUTF(JSON.stringify({contenido: "mensajeError", mensaje: "Este paciente no está conectado"}));
					}
				}
			}
		}
	});



	// Cada vez que un cliente se desconecta. Se mantiene igual
	connection.on("close", function (reasonCode, description) { // conexión cerrada
		// Recorremos todas las conexiones
		for(var l = 0; l < clientes.length; l++){
			// cliente es la conexión actual, si es igual a la lista de conexión,
			if(clientes[l] == cliente){
				// Cortamos esa conexión de la lista de conexiones.
				clientes.splice(l,1);
			}
		}
		console.log("Cliente desconectado. Ahora hay", clientes.length);
	});
});