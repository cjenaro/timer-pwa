<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import PlayButton from "./PlayButton.svelte";
  import StopButton from "./StopButton.svelte";
  const dispatch = createEventDispatcher();

  export let playing;
  export let seconds;
  export let cicles;
  export let working;
  let totalCicles;

  onMount(() => {
    totalCicles = cicles;
  });

  const dispatchStart = () => {
    dispatch("start");
  };

  const dispatchClose = () => {
    dispatch("close");
  };

  const dispatchStop = () => {
    dispatch("stop");
  };
</script>

<style>
  .view {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--blue);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .view.working {
    background-color: var(--red);
  }

  .actions {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 1rem;
  }

  h1 {
    font-size: 100px;
  }

  .close {
    position: absolute;
    top: 0;
    right: 15px;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    font-size: 30px;
  }
</style>

<div class={working ? 'view working' : 'view'}>
  <button class="close" on:click={dispatchClose}>&times;</button>
  <h1>{seconds}</h1>
  <p>{cicles}/{totalCicles}</p>
  <div class="actions">
    <PlayButton klass={playing ? 'active' : ''} on:click={dispatchStart} />
    <StopButton klass={!playing ? 'active' : ''} on:click={dispatchStop} />
  </div>
</div>
