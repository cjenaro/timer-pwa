<script>
  import { fade } from "svelte/transition";
  import TimerView from "./TimerView.svelte";
  let selectedTab = "simple";
  let cicles, restTime, workTime, interval;
  let seconds = 0;
  let working = true;
  let playing = false;
  let countMode = false;

  const selectTab = e => {
    const { tab } = e.target.dataset;
    selectedTab = tab;
  };

  const closeCountMode = () => {
    countMode = false;
    stopCounter();
  };

  const handlePlaying = e => {
    setTimeout(() => {
      e.target.pause();
    }, 550);
  };

  const startCounter = () => {
    const audio = document.querySelector("#audio");
    audio.addEventListener("play", handlePlaying);
    playing = true;
    seconds = seconds === 0 ? (working ? workTime : restTime) : seconds;
    interval = setInterval(() => {
      if (cicles > 0) {
        if (seconds > 0) {
          if (!!audio && seconds === 1) {
            audio.currentTime = 0;
            audio.play();
          }
          seconds = seconds - 1;
        } else {
          seconds = working ? restTime : workTime;
          cicles = !working ? cicles - 1 : cicles;
          working = !working;
        }
      } else {
        countMode = false;
        playing = false;
        clearInterval(interval);
      }
    }, 1000);
  };

  const stopCounter = () => {
    playing = false;
    clearInterval(interval);
  };
</script>

<style>
  input {
    border-radius: 4px;
    background-color: var(--secondary);
    border: 1px solid var(--main);
    color: var(--main);
    width: 100%;
    margin-top: 6px;
  }

  main {
    text-align: center;
    position: relative;
    height: 100%;
    padding-top: 30px;
  }

  h1 {
    margin-top: 0;
  }

  label {
    text-align: left;
    margin-bottom: 1rem;
  }

  .tab-content {
    text-align: center;
    padding: 1em;
    max-width: 675px;
    margin: 0 auto;
  }

  .tabs {
    display: flex;
    align-items: center;
  }

  .tab {
    flex: 1;
    background-color: #222222;
    transition: background-color 0.2s ease-in-out;
    color: var(--main);
    border-radius: 4px 4px 0 0;
    border: 0;
    padding: 0.7em;
    cursor: pointer;
  }

  .tab.selected {
    box-shadow: 0px -2px 4px #00000022;
    background-color: var(--secondary);
  }

  .cicles {
    display: flex;
    border-radius: 4px;
    height: 30px;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .cicle {
    display: flex;
    flex: 1;
  }

  .cicle .work {
    flex: 1;
    transition: flex-basis 0.2s ease-in-out;
    background-color: var(--red);
  }
  .cicle .rest {
    flex: 1;
    transition: flex-basis 0.2s ease-in-out;
    background-color: var(--blue);
  }

  button.start {
    padding: 1rem 0.875rem;
    cursor: pointer;
    border: 1px solid var(--main);
    color: var(--main);
    background-color: transparent;
  }
</style>

<main>
  <audio id="audio">
    <source src="./beep.mp3" />
  </audio>
  <h1>Cicles</h1>
  <nav class="tabs">
    <button
      on:click={selectTab}
      data-tab="simple"
      class={selectedTab === 'simple' ? 'tab selected' : 'tab'}>
      Simple cicles
    </button>
    <button
      on:click={selectTab}
      data-tab="complex"
      class={selectedTab === 'complex' ? 'tab selected' : 'tab'}>
      Complex cicles
    </button>
  </nav>
  {#if selectedTab === 'simple'}
    <div in:fade={{ duration: 200 }} class="tab-content">
      <p>All times are on seconds</p>
      <label for="cicles">
        Number of cicles:
        <input id="cicles" type="number" bind:value={cicles} />
        <small>(rest and pause count as 1 cicle)</small>
      </label>
      <label for="rest">
        Rest:
        <input id="rest" type="number" bind:value={restTime} />
      </label>
      <label for="work">
        Work:
        <input id="work" type="number" bind:value={workTime} />
      </label>
      {#if cicles}
        <p>
          {cicles} cicles of {restTime ? restTime : 0}s rest time and {workTime ? workTime : 0}s
          work time.
        </p>

        <div class="cicles">
          {#each Array.from({ length: cicles }) as cicle}
            <div class="cicle">
              <div
                class="work"
                style={`flex-basis: ${(workTime * 100) / (workTime + restTime)}%`} />
              <div
                class="rest"
                style={`flex-basis: ${(restTime * 100) / (workTime + restTime)}%`} />
            </div>
          {/each}
        </div>

        <button
          class="start"
          on:click={() => {
            countMode = true;
            startCounter();
          }}>
          Start
        </button>
      {/if}

      {#if countMode}
        <TimerView
          {playing}
          on:start={startCounter}
          on:stop={stopCounter}
          on:close={closeCountMode}
          {working}
          {seconds}
          {cicles} />
      {/if}
    </div>
  {/if}
  {#if selectedTab === 'complex'}
    <div in:fade={{ duration: 200 }} class="tab-content">
      <p>COMPLEX</p>
    </div>
  {/if}
</main>
