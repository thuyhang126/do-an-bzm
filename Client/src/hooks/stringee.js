import { StringeeClient, StringeeVideo } from 'stringee-chat-js-sdk';
import callConfig from '~/config/callConfig';
import axios from 'axios';

const projectId = 'SKIuNgIgQclWM0GFSPCJO7eervWS7hKkQg';
const projectSecret = 'Tk1NaUZGVElWZ3VpNFZVQlZVVTZseWFsWTlHTndyMw==';
const BASE_URL = 'https://api.stringee.com/v1/room2';
let restToken = '';

const apiSetRestToken = async () => {
  const tokens = await apiGetToken({ rest: true });
  restToken = tokens.rest_access_token;
};

const apiCreateRoom = async () => {
  const roomName = Math.random().toFixed(4);
  if (!restToken) await apiSetRestToken();
  const response = await axios.post(
    `${BASE_URL}/create`,
    {
      name: roomName,
      uniqueName: roomName,
    },
    {
      headers: {
        'X-STRINGEE-AUTH': restToken,
      },
    },
  );

  const room = response.data;
  console.log({ room });
  return room;
};

const apiListRoom = async () => {
  const response = await axios.get(`${BASE_URL}/list`, {
    headers: {
      'X-STRINGEE-AUTH': restToken,
    },
  });

  const rooms = response.data.list;
  console.log({ rooms });
  return rooms;
};

const apiDeleteRoom = async (roomId) => {
  const response = await axios.put(
    `${BASE_URL}/delete`,
    {
      roomId,
    },
    {
      headers: {
        'X-STRINGEE-AUTH': restToken,
      },
    },
  );

  console.log({ response });

  return response.data;
};

const apiClearAllRooms = async () => {
  const rooms = await apiListRoom();
  const response = await Promise.all(rooms.map((room) => apiDeleteRoom(room.roomId)));

  return response;
};

const apiGetUserToken = async (userId) => {
  const tokens = await apiGetToken({ userId });
  return tokens.access_token;
};

const apiGetRoomToken = async (roomId) => {
  const tokens = await apiGetToken({ roomId });
  return tokens.room_token;
};

const apiGetToken = async ({ userId, roomId, rest }) => {
  const response = await axios.get('https://v2.stringee.com/web-sdk-conference-samples/php/token_helper.php', {
    params: {
      keySid: projectId,
      keySecret: projectSecret,
      userId,
      roomId,
      rest,
    },
  });

  const tokens = response.data;
  console.log({ tokens });
  return tokens;
};

const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return !ua.includes('chrome') && ua.includes('safari');
};

const videoContainer = document.querySelector('#videos');

let userToken = '',
  roomId = '',
  roomToken = '',
  room = undefined,
  callClient = undefined;

const getRoomUrl = () => {
  return `https://${location.hostname}?room=${roomId}`;
};

const mounted = async () => {
  console.log(1);
  apiSetRestToken();

  const urlParams = new URLSearchParams(location.search);
  roomId = urlParams.get('room');
  if (roomId) {
    await join();
  }
};

const authen = (userId) => {
  return new Promise(async (resolve) => {
    userToken = await apiGetUserToken(userId);

    if (!callClient) {
      const client = new StringeeClient();

      client.on('authen', function (res) {
        console.log('on authen: ', res);
        resolve(res);
      });
      callClient = client;
    }
    callClient.connect(userToken);
  });
};

const publish = async (screenSharing = false) => {
  console.log(callClient);
  const localTrack = await StringeeVideo.createLocalVideoTrack(callClient, {
    audio: true,
    video: true,
    screen: screenSharing,
    videoDimensions: { width: 640, height: 360 },
  });

  const videoElement = localTrack.attach();
  addVideo(videoElement);

  const roomData = await StringeeVideo.joinRoom(callClient, roomToken);
  room = roomData.room;
  console.log({ roomData, room });

  if (!room) {
    room.clearAllOnMethos();
    room.on('addtrack', (e) => {
      const track = e.info.track;

      console.log('addtrack', track);
      if (track.serverId === localTrack.serverId) {
        console.log('local');
        return;
      }
      subscribe(track);
    });
    room.on('removetrack', (e) => {
      const track = e.track;
      if (!track) {
        return;
      }

      const mediaElements = track.detach();
      mediaElements.forEach((element) => element.remove());
    });

    // Join existing tracks
    roomData.listTracksInfo.forEach((info) => subscribe(info));
  }

  await room.publish(localTrack);
  console.log('room publish successful');
};

export const createRoom = async () => {
  await mounted();
  roomId = await apiCreateRoom();
  roomToken = await apiGetRoomToken(roomId);
  console.log({ roomId, roomToken });

  await authen();
  console.log('publish');
  await publish();
};

const join = async () => {
  roomToken = await apiGetRoomToken(roomId);

  await authen();
  await publish();
};

const joinWithId = async () => {
  roomId = prompt('Dán Room ID vào đây nhé!');
  if (roomId) {
    await join();
  }
};

const subscribe = async (trackInfo) => {
  const track = await room.subscribe(trackInfo.serverId);
  track.on('ready', () => {
    const videoElement = track.attach();
    addVideo(videoElement);
  });
};

const addVideo = (video) => {
  video.setAttribute('controls', 'true');
  video.setAttribute('playsinline', 'true');
  videoContainer.appendChild(video);
};

export const stringee = { joinWithId, createRoom };
