var ListaMedico = [
    { id: 1, nombre: "Ende", login: "End", password: "123" },
    { id: 2, nombre: "Qiqi", login: "Qi", password: "123" },
    { id: 3, nombre: "Jack", login: "Jack", password: "123" },
    { id: 4, nombre: "Paula", login: "Paula", password: "123" }
];

var variables = [
    { id: 1, nombre: "PESO (Kg)" },
    { id: 2, nombre: "METROS ANDADOS" },
    { id: 3, nombre: "METROS CORRIDOS" },
    { id: 4, nombre: "MINUTOS DE GIMNASIA REALIZADOS" },
    { id: 5, nombre: "TENSIÓN SANGUÍNEA MEDIA (MMGH)" },
    { id: 6, nombre: "SATURACIÓN DE OXÍGENO MEDIA" },
];

var pacientes = [
    { id: 1, nombre: "Jack", fecha_nacimiento: "1995-03-28", genero: "Masculino", medico: 2, codigo_acceso: "ACD", observaciones: "" },
    { id: 2, nombre: "Pedro", fecha_nacimiento: "2000-10-10", genero: "Masculino", medico: 3, codigo_acceso: "PRUEBA", observaciones: "" },
    { id: 3, nombre: "Alex", fecha_nacimiento: "2010-08-28", genero: "Masculino", medico: 1, codigo_acceso: "qwe", observaciones: "" },
    { id: 4, nombre: "María", fecha_nacimiento: "1988-03-06", genero: "Femenino", medico: 3, codigo_acceso: "1", observaciones: "" },
    { id: 5, nombre: "Jesús", fecha_nacimiento: "2000-03-24", genero: "Masculino", medico: 3, codigo_acceso: "2", observaciones: "" },
    { id: 6, nombre: "Pepito", fecha_nacimiento: "2002-05-06", genero: "Masculino", medico: 3, codigo_acceso: "3", observaciones: "" },
    { id: 7, nombre: "Álvaro", fecha_nacimiento: "1988-11-26", genero: "Masculino", medico: 3, codigo_acceso: "4", observaciones: "" }
];

var contadorPaciente = 8;

var muestras = [
    { id: 1, paciente: 2, variable: 3, fecha: "2022-03-28", valor: 8000 },
    { id: 2, paciente: 3, variable: 1, fecha: "2022-03-27", valor: 76 },
    { id: 3, paciente: 1, variable: 5, fecha: "2022-03-22", valor: 106 },
    { id: 4, paciente: 1, variable: 2, fecha: "2022-03-29", valor: 7000 },
    { id: 5, paciente: 1, variable: 1, fecha: "2022-04-01", valor: 80},
    { id: 6, paciente: 1, variable: 1, fecha: "2020-06-26", valor: 76},
    { id: 7, paciente: 4, variable: 2, fecha: "2019-07-22", valor: 120},
    { id: 8, paciente: 4, variable: 3, fecha: "2018-08-25", valor: 200},
    { id: 9, paciente: 4, variable: 3, fecha: "2017-09-07", valor: 400},
    { id: 10, paciente: 4, variable: 3, fecha: "2016-10-23", valor: 21},
    { id: 11, paciente: 4, variable: 5, fecha: "2015-11-28", valor: 32},
    { id: 12, paciente: 4, variable: 6, fecha: "2014-12-02", valor: 43}
]
var contadorMuestras = 13;


module.exports.contadorMuestras = contadorMuestras;
module.exports.ListaMedico = ListaMedico;
module.exports.variables = variables;
module.exports.pacientes = pacientes;
module.exports.muestras = muestras;
module.exports.contadorPaciente = contadorPaciente;


