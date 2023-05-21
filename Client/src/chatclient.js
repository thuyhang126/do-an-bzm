var myHostname = window.location.hostname;
if (!myHostname) {
  myHostname = 'localhost:3000';
}
log('Hostname: ' + myHostname);

// WebSocket chat/signaling channel variables.

var connection = null;
var clientID = 0;

var mediaConstraints = {
  audio: true, // We want an audio track
  video: {
    aspectRatio: {
      ideal: 1.333333, // 3:2 aspect is preferred
    },
  },
};

var myUsername = null;
var targetUsername = null; // To store username of other peer
var myPeerConnection = null; // RTCPeerConnection
var transceiver = null; // RTCRtpTransceiver
var webcamStream = null; // MediaStream from webcam

// Output logging information to console.

function log(text) {
  var time = new Date();

  console.log('[' + time.toLocaleTimeString() + '] ' + text);
}

function log_error(text) {
  var time = new Date();

  console.trace('[' + time.toLocaleTimeString() + '] ' + text);
}

function sendToServer(msg) {
  var msgJSON = JSON.stringify(msg);

  log("Sending '" + msg.type + "' message: " + msgJSON);
  connection.send(msgJSON);
}

function setUsername(email) {
  myUsername = email;

  sendToServer({
    name: myUsername,
    date: Date.now(),
    id: clientID,
    type: 'username',
  });
}

export function connect({ email }) {
  var serverUrl;
  let scheme = 'ws';

  if (document.location.protocol === 'https:') {
    scheme += 's';
  }
  serverUrl = scheme + '://' + myHostname + ':6503';

  log(`Connecting to server: ${serverUrl}`);
  connection = new WebSocket(serverUrl, 'json');

  connection.onerror = function (evt) {
    console.dir(evt);
  };

  connection.onmessage = function (evt) {
    var text = '';
    var msg = JSON.parse(evt.data);
    log('Message received: ');
    console.dir(msg);
    var time = new Date(msg.date);
    var timeStr = time.toLocaleTimeString();

    switch (msg.type) {
      case 'id':
        clientID = msg.id;
        setUsername(email);
        break;

      case 'userlist': // Received an updated user list
        handleUserlistMsg(msg);
        break;

      case 'video-offer': // Invitation and offer to chat
        handleVideoOfferMsg(msg);
        break;

      case 'video-answer': // Callee has answered our offer
        handleVideoAnswerMsg(msg);
        break;

      case 'new-ice-candidate': // A new ICE candidate has been received
        handleNewICECandidateMsg(msg);
        break;

      case 'hang-up': // The other peer has hung up the call
        handleHangUpMsg(msg);
        break;

      // Unknown message; output to console for debugging.

      default:
        log_error('Unknown message received:');
        log_error(msg);
    }
  };
}

async function createPeerConnection() {
  log('Setting up a connection...');

  // Create an RTCPeerConnection which knows to use our chosen
  // STUN server.

  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  myPeerConnection = new RTCPeerConnection(configuration);

  // Set up event handlers for the ICE negotiation process.

  myPeerConnection.onicecandidate = handleICECandidateEvent;
  myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
  myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
  myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
  myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
  myPeerConnection.ontrack = handleTrackEvent;
}

async function handleNegotiationNeededEvent() {
  log('*** Negotiation needed');

  try {
    log('---> Creating offer');
    const offer = await myPeerConnection.createOffer();

    if (myPeerConnection.signalingState != 'stable') {
      log("     -- The connection isn't stable yet; postponing...");
      return;
    }

    log('---> Setting local description to the offer');
    await myPeerConnection.setLocalDescription(offer);

    // Send the offer to the remote peer.

    log('---> Sending the offer to the remote peer');
    sendToServer({
      name: myUsername,
      target: targetUsername,
      type: 'video-offer',
      sdp: myPeerConnection.localDescription,
    });
  } catch (err) {
    log('*** The following error occurred while handling the negotiationneeded event:');
    reportError(err);
  }
}

function handleTrackEvent(event) {
  log('*** Track event');
  document.getElementById('received_video').srcObject = event.streams[0];
  document.getElementById('hangup-button').disabled = false;
}

function handleICECandidateEvent(event) {
  if (event.candidate) {
    log('*** Outgoing ICE candidate: ' + event.candidate.candidate);

    sendToServer({
      type: 'new-ice-candidate',
      target: targetUsername,
      candidate: event.candidate,
    });
  }
}

function handleICEConnectionStateChangeEvent(event) {
  log('*** ICE connection state changed to ' + myPeerConnection.iceConnectionState);

  switch (myPeerConnection.iceConnectionState) {
    case 'closed':
    case 'failed':
    case 'disconnected':
      closeVideoCall();
      break;
  }
}

function handleSignalingStateChangeEvent(event) {
  log('*** WebRTC signaling state changed to: ' + myPeerConnection.signalingState);
  switch (myPeerConnection.signalingState) {
    case 'closed':
      closeVideoCall();
      break;
  }
}

function handleICEGatheringStateChangeEvent(event) {
  log('*** ICE gathering state changed to: ' + myPeerConnection.iceGatheringState);
}

function handleUserlistMsg(msg) {
  var i;
  var listElem = document.querySelector('.userlistbox');

  while (listElem.firstChild) {
    listElem.removeChild(listElem.firstChild);
  }

  // Add member names from the received list.

  msg.users.forEach(function (username) {
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(username));
    item.addEventListener('click', invite, false);

    listElem.appendChild(item);
  });
}

function closeVideoCall() {
  var localVideo = document.getElementById('local_video');

  log('Closing the call');

  if (myPeerConnection) {
    log('--> Closing the peer connection');

    myPeerConnection.ontrack = null;
    myPeerConnection.onnicecandidate = null;
    myPeerConnection.oniceconnectionstatechange = null;
    myPeerConnection.onsignalingstatechange = null;
    myPeerConnection.onicegatheringstatechange = null;
    myPeerConnection.onnotificationneeded = null;

    // Stop all transceivers on the connection

    myPeerConnection.getTransceivers().forEach((transceiver) => {
      transceiver.stop();
    });

    if (localVideo.srcObject) {
      localVideo.pause();
      localVideo.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // Close the peer connection

    myPeerConnection.close();
    myPeerConnection = null;
    webcamStream = null;
  }

  // Disable the hangup button

  document.getElementById('hangup-button').disabled = true;
  targetUsername = null;
}

function handleHangUpMsg(msg) {
  log('*** Received hang up notification from other peer');

  closeVideoCall();
}

export function hangUpCall() {
  closeVideoCall();

  sendToServer({
    name: myUsername,
    target: targetUsername,
    type: 'hang-up',
  });
}

async function invite(evt) {
  log('Starting to prepare an invitation');
  if (myPeerConnection) {
    alert("You can't start a call because you already have one open!");
  } else {
    var clickedUsername = evt.target.textContent;

    // Don't allow users to call themselves, because weird.

    if (clickedUsername === myUsername) {
      alert("I'm afraid I can't let you talk to yourself. That would be weird.");
      return;
    }

    // Record the username being called for future reference

    targetUsername = clickedUsername;
    log('Inviting user ' + targetUsername);

    log('Setting up connection to invite user: ' + targetUsername);
    createPeerConnection();

    try {
      webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      console.log('local_video', document.getElementById('local_video'));
      document.getElementById('local_video').srcObject = webcamStream;
    } catch (err) {
      handleGetUserMediaError(err);
      return;
    }

    // Add the tracks from the stream to the RTCPeerConnection

    try {
      webcamStream
        .getTracks()
        .forEach((transceiver = (track) => myPeerConnection.addTransceiver(track, { streams: [webcamStream] })));
    } catch (err) {
      handleGetUserMediaError(err);
    }
  }
}

async function handleVideoOfferMsg(msg) {
  targetUsername = msg.name;

  log('Received video chat offer from ' + targetUsername);
  if (!myPeerConnection) {
    createPeerConnection();
  }

  var desc = new RTCSessionDescription(msg.sdp);

  if (myPeerConnection.signalingState != 'stable') {
    log("  - But the signaling state isn't stable, so triggering rollback");

    await Promise.all([
      myPeerConnection.setLocalDescription({ type: 'rollback' }),
      myPeerConnection.setRemoteDescription(desc),
    ]);
    return;
  } else {
    log('  - Setting remote description');
    await myPeerConnection.setRemoteDescription(desc);
  }

  // Get the webcam stream if we don't already have it

  if (!webcamStream) {
    try {
      webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    } catch (err) {
      handleGetUserMediaError(err);
      return;
    }

    document.getElementById('local_video').srcObject = webcamStream;

    // Add the camera stream to the RTCPeerConnection

    try {
      webcamStream
        .getTracks()
        .forEach((transceiver = (track) => myPeerConnection.addTransceiver(track, { streams: [webcamStream] })));
    } catch (err) {
      handleGetUserMediaError(err);
    }
  }

  log('---> Creating and sending answer to caller');

  await myPeerConnection.setLocalDescription(await myPeerConnection.createAnswer());

  sendToServer({
    name: myUsername,
    target: targetUsername,
    type: 'video-answer',
    sdp: myPeerConnection.localDescription,
  });
}

async function handleVideoAnswerMsg(msg) {
  log('*** Call recipient has accepted our call');

  var desc = new RTCSessionDescription(msg.sdp);
  await myPeerConnection.setRemoteDescription(desc).catch(reportError);
}

async function handleNewICECandidateMsg(msg) {
  var candidate = new RTCIceCandidate(msg.candidate);

  log('*** Adding received ICE candidate: ' + JSON.stringify(candidate));
  try {
    await myPeerConnection.addIceCandidate(candidate);
  } catch (err) {
    reportError(err);
  }
}

function handleGetUserMediaError(e) {
  log_error(e);
  switch (e.name) {
    case 'NotFoundError':
      alert('Unable to open your call because no camera and/or microphone' + 'were found.');
      break;
    case 'SecurityError':
    case 'PermissionDeniedError':
      // Do nothing; this is the same as the user canceling the call.
      break;
    default:
      alert('Error opening your camera and/or microphone: ' + e.message);
      break;
  }

  closeVideoCall();
}

function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`);
}
