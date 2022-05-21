const express = require("express");
const cors = require("cors");

function debug(...args) {
	if (module.exports.debug) console.debug("[RPC]", ...args);
}

class RPCApp {
	constructor() {
		this.procedures = {};
	}

	register(name, fnct) {
		if (typeof name === "function") { // register(fnct)
			fnct = name;
			name = fnct.name;
		}
		debug("register:", name);
		this.procedures[name] = fnct;
	}
}

class RPCServer {
	constructor(port, callback) {
		this.apps = {};
		if (!port || typeof port === "function") port = 3501;
		var app = express();
		app.get("/", function (req, res) {
			res.json("RPC server");
		});
		app.use("/RPC", cors());
		app.use("/RPC", express.json({ strict: false }));
		app.post("/RPC/:app/:procedure", (req, res) => {
			var appName = req.params.app;
			var app = this.apps[appName];
			if (!app) {
				console.error("No existe la app:", appName);
				res.status(404).json("No existe la app: " + appName);
				return;
			}
			var procedureName = req.params.procedure;
			var procedure = app.procedures[procedureName];
			if (!procedure) {
				console.error("No existe el procedimiento:", procedureName);
				res.status(404).json("No existe el procedimiento: " + procedureName);
				return;
			}
			var params = req.body;
			var result = procedure(...params);
			debug("call:", appName + ": " + procedureName + "(", ...params, ")");
			setTimeout(() => {
				debug("response:", appName + ": " + procedureName + "(", ...params, ") -> ", result);
				res.json(result);
			}, module.exports.delay);
		});
		app.listen(port, callback);
	}

	createApp(name) {
		debug("app:", name);
		return this.apps[name] = new RPCApp();
	}
}

module.exports = {
	debug: false,
	server: function (port, callback) { return new RPCServer(port, callback); },
	delay: 0
}