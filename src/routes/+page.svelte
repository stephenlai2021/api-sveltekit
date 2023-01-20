<script>
  import { onMount } from 'svelte'

  onMount(async () => {
    const res = await fetch('/api/get-turn-credentials')
    const json = await res.json()
    console.log('twilio token: ', json)
  })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
