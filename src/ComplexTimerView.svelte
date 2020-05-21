<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import PlayButton from "./PlayButton.svelte";
  import StopButton from "./StopButton.svelte";
  const dispatch = createEventDispatcher();

  export let playing;
  export let seconds;
  export let cicles;
  export let isRest;
  export let totalTime;
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

  .time {
    border: 4px solid #fafafa;
    margin-bottom: 1em;
    border-radius: 50%;
    height: 250px;
    width: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  .completed {
    border-radius: 50%;
    height: 260px;
    width: 260px;
    background-color: transparent;
    z-index: 3;
    position: absolute;
    color: var(--blue);
  }

  .view.working .completed {
    color: var(--red);
  }

  .completed circle {
    stroke-dasharray: 773;
    stroke-dashoffset: 773px;
    transition: stroke-dashoffset 1s linear;
  }

  h1 {
    margin: 0;
    font-size: 100px;
    position: relative;
    z-index: 4;
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

<div class={!isRest ? 'view working' : 'view'}>
  <button class="close" on:click={dispatchClose}>&times;</button>
  <div class="time">
    <svg
      class="completed"
      viewBox="0 0 270 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <circle
        style={`
        ${seconds === totalTime ? 'transition: none;' : ''}
        stroke-dashoffset: ${playing && (seconds * 773) / totalTime};
        `}
        cx="135"
        cy="135"
        r="123"
        stroke="currentColor"
        stroke-width="30" />
    </svg>

    <h1>{seconds}</h1>
  </div>
  <p>{cicles}/{totalCicles}</p>
  <div class="actions">
    <PlayButton klass={playing ? 'active' : ''} on:click={dispatchStart} />
    <StopButton klass={!playing ? 'active' : ''} on:click={dispatchStop} />
  </div>
</div>
