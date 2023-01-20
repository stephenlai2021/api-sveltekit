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

<pre>
  {
    JSON.stringify(turnServers, null, 2)
  }
</pre>