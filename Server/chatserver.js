"use strict";

var http = require("http");
var https = require("https");
var fs = require("fs");
var WebSocketServer = require("websocket").server;

const keyFilePath = "/etc/pki/tls/private/mdn-samples.mozilla.org.key";
const certFilePath = "/etc/pki/tls/certs/mdn-samples.mozilla.org.crt";

var connectionArray = [];
var nextID = Date.now();
var appendToMakeUnique = 1;

// Output logging information to console

function log(text) {
  var time = new Date();

  console.log("[" + time.toLocaleTimeString() + "] " + text);
}

function originIsAllowed(origin) {
  return true; // We will accept all connections
}

function isUsernameUnique(name) {
  var isUnique = true;
  var i;

  for (i = 0; i < connectionArray.length; i++) {
    if (connectionArray[i].username === name) {
      isUnique = false;
      break;
    }
  }
  return isUnique;
}

function sendToOneUser(target, msgString) {
  var isUnique = true;
  var i;

  for (i = 0; i < connectionArray.length; i++) {
    if (connectionArray[i].username === target) {
      connectionArray[i].sendUTF(msgString);
      break;
    }
  }
}

function getConnectionForID(id) {
  var connect = null;
  var i;

  for (i = 0; i < connectionArray.length; i++) {
    if (connectionArray[i].clientID === id) {
      connect = connectionArray[i];
      break;
    }
  }

  return connect;
}

function makeUserListMessage() {
  var userListMsg = {
    type: "userlist",
    users: [],
  };
  var i;

  // Add the users to the list

  for (i = 0; i < connectionArray.length; i++) {
    userListMsg.users.push(connectionArray[i].username);
  }

  return userListMsg;
}

function sendUserListToAll() {
  var userListMsg = makeUserListMessage();
  var userListMsgStr = JSON.stringify(userListMsg);
  var i;

  for (i = 0; i < connectionArray.length; i++) {
    connectionArray[i].sendUTF(userListMsgStr);
  }
}

var httpsOptions = {
  key: null,
  cert: null,
};

try {
  httpsOptions.key = fs.readFileSync(keyFilePath);
  try {
    httpsOptions.cert = fs.readFileSync(certFilePath);
  } catch (err) {
    httpsOptions.key = null;
    httpsOptions.cert = null;
  }
} catch (err) {
  httpsOptions.key = null;
  httpsOptions.cert = null;
}

var webServer = null;

try {
  if (httpsOptions.key && httpsOptions.cert) {
    webServer = https.createServer(httpsOptions, handleWebRequest);
  }
} catch (err) {
  webServer = null;
}

if (!webServer) {
  try {
    webServer = http.createServer({}, handleWebRequest);
  } catch (err) {
    webServer = null;
    log(`Error attempting to create HTTP(s) server: ${err.toString()}`);
  }
}

function handleWebRequest(request, response) {
  log("Received request for " + request.url);
  response.writeHead(404);
  response.end();
}

webServer.listen(6503, function () {
  log("Server is listening on port 6503");
});

var wsServer = new WebSocketServer({
  httpServer: webServer,
  autoAcceptConnections: false,
});

if (!wsServer) {
  log("ERROR: Unable to create WbeSocket server!");
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    log("Connection from " + request.origin + " rejected.");
    return;
  }

  var connection = request.accept("json", request.origin);

  log("Connection accepted from " + connection.remoteAddress + ".");
  connectionArray.push(connection);

  connection.clientID = nextID;
  nextID++;

  var msg = {
    type: "id",
    id: connection.clientID,
  };
  connection.sendUTF(JSON.stringify(msg));

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      log("Received Message: " + message.utf8Data);

      // Process incoming data.

      var sendToClients = true;
      msg = JSON.parse(message.utf8Data);
      var connect = getConnectionForID(msg.id);

      switch (msg.type) {
        // Public, textual message
        case "message":
          msg.name = connect.username;
          msg.text = msg.text.replace(/(<([^>]+)>)/gi, "");
          break;

        // Username change
        case "username":
          var nameChanged = false;
          var origName = msg.name;

          while (!isUsernameUnique(msg.name)) {
            msg.name = origName + appendToMakeUnique;
            appendToMakeUnique++;
            nameChanged = true;
          }

          if (nameChanged) {
            var changeMsg = {
              id: msg.id,
              type: "rejectusername",
              name: msg.name,
            };
            connect.sendUTF(JSON.stringify(changeMsg));
          }

          connect.username = msg.name;
          sendUserListToAll();
          sendToClients = false; // We already sent the proper responses
          break;
      }

      if (sendToClients) {
        var msgString = JSON.stringify(msg);
        var i;

        if (msg.target && msg.target !== undefined && msg.target.length !== 0) {
          sendToOneUser(msg.target, msgString);
        } else {
          for (i = 0; i < connectionArray.length; i++) {
            connectionArray[i].sendUTF(msgString);
          }
        }
      }
    }
  });

  connection.on("close", function (reason, description) {
    // First, remove the connection from the list of connections.
    connectionArray = connectionArray.filter(function (el, idx, ar) {
      return el.connected;
    });

    sendUserListToAll();

    var logMessage =
      "Connection closed: " + connection.remoteAddress + " (" + reason;
    if (description !== null && description.length !== 0) {
      logMessage += ": " + description;
    }
    logMessage += ")";
    log(logMessage);
  });
});
