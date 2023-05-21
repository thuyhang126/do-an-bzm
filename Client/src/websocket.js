const connect = () => {
  let myHostname = process.env.REACT_APP_SOCKET_URL;
  if (!myHostname) {
    myHostname = 'localhost';
  }
  let connection = null;
  let serverUrl;
  let scheme = 'ws';

  // If this is an HTTPS connection, we have to use a secure WebSocket
  // connection too, so add another "s" to the scheme.

  if (document.location.protocol === 'https:') {
    scheme += 's';
  }
  serverUrl = scheme + '://' + myHostname + ':6503';
  // console.log(`Connecting to server: ${serverUrl}`);
  connection = new WebSocket(serverUrl, 'json');
  return connection;
};

export default connect;
