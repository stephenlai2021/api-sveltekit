<script>
  import { onMount } from "svelte";
  
  let turnServers = []

  const getTurnServers = async () => {
    const res = await fetch('/api/get-turn-credentials')
    const json = await res.json()

    turnServers = json.token.iceServers
    console.log('turn servers: ', turnServers)
  }

  onMount(() => {
    getTurnServers()
  })
</script>

<!-- <pre>
  {
    JSON.stringify(turnServers, null, 2)
  }
</pre> -->

<div class="container">
  <h2>1. Start your Webcam</h2>
  <div class="videos">
    <span>
      <h3>Local Stream</h3>
      <video id="webcamVideo" autoplay playsinline>
        <track kind="captions" />
      </video>
      <track kind="captions" />
    </span>
    <span>
      <h3>Remote Stream</h3>
      <video id="remoteVideo" autoplay playsinline>
        <track kind="captions" />
      </video>
    </span>
  </div>

  <!-- <button disabled={btnWebcam}>Start webcam</button> -->
  <h2>2. Create a new Call</h2>
  <!-- on:click={generatePeerId}  -->
  <button 
  >
  <!-- disabled={btnCall} -->
    Create Call (offer)
  </button>

  <h2>3. Join a Call</h2>
  <p>Answer the call from a different browser window or device</p>

  <!-- bind:value={callInput}  -->
  <input 
    placeholder="Peer ID" 
  />
  <!-- on:click={callPeer}  -->
  <button 
  >
  <!-- disabled={btnAnswer} -->
    Call
  </button>

  <!-- <h2>4. Hangup</h2>
  <button disabled={btnHangup}>Hangup</button> -->
</div>