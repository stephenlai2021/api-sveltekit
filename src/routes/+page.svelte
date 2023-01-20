<script>
  import firebase from "firebase/app";
  import "firebase/firestore";
  import { onMount } from "svelte";

  // let turnServers = []
  export let data;
  const { turnServers } = data;
  console.log("turn servers: ", turnServers);

  const configuration = {
    iceServers: [
      ...turnServers,
      // {
      //   urls: [
      //     "stun:stun1.l.google.com:19302",
      //     "stun:stun2.l.google.com:19302",
      //   ],
      // },
    ],
    iceTransportPolicy: "relay",
    iceCandidatePoolSize: 10,
  };
  console.log("configuration: ", configuration);

  let localStream = null;
  let remoteStream = null;
  let btnCall = false;
  let btnAnswer = false;
  let btnWebcam = true;
  let btnHangup = true;
  let pc = null;
  let callInput = null;

  const firebaseConfig = {
    apiKey: "AIzaSyDmd4MyKJTYeQ3OonYZjZg0YMvwUHnDsnY",
    authDomain: "webrtc-firebase-f235b.firebaseapp.com",
    projectId: "webrtc-firebase-f235b",
    storageBucket: "webrtc-firebase-f235b.appspot.com",
    messagingSenderId: "833747712008",
    appId: "1:833747712008:web:e09aa766b17524333139bd",
    measurementId: "G-H8M3MGYJHP",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();

  onMount(async () => {
    pc = new RTCPeerConnection(configuration);

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true
    });
    remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    // webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    btnCall = false;
    btnAnswer = false;
    btnWebcam = true;
  });

  const generatePeerId = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection("calls").doc();
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    callInput = callDoc.id;

    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    btnHangup = false;
  };

  const callPeer = async () => {
    const callDoc = firestore.collection("calls").doc(callInput);
    const answerCandidates = callDoc.collection("answerCandidates");
    const offerCandidates = callDoc.collection("offerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change);
        if (change.type === "added") {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };
</script>

<div class="container">
  <h2>1. Start your Webcam</h2>
  <div class="videos">
    <!-- <span>
      <h3>Local Stream</h3>
      <video id="webcamVideo" autoplay playsinline>
        <track kind="captions" />
      </video>
      <track kind="captions" />
    </span> -->
    <span>
      <h3>Remote Stream</h3>
      <video id="remoteVideo" autoplay playsinline>
        <track kind="captions" />
      </video>
    </span>
  </div>

  <button id="webcamButton" disabled={btnWebcam}>Start webcam</button>
  <h2>2. Create a new Call</h2>
  <button on:click={generatePeerId} disabled={btnCall}
    >Create Call (offer)</button
  >

  <h2>3. Join a Call</h2>
  <p>Answer the call from a different browser window or device</p>

  <input bind:value={callInput} placeholder="Peer ID" />
  <!-- <button on:click={answerCall} disabled={btnAnswer}>Answer</button> -->
  <button on:click={callPeer} disabled={btnAnswer}>Call</button>

  <h2>4. Hangup</h2>

  <button id="hangupButton" disabled={btnHangup}>Hangup</button>
</div>
