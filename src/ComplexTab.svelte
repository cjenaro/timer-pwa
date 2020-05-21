<script>
  import { onMount } from "svelte";
  import PlayButton from "./PlayButton.svelte";
  import ComplexTimerView from "./ComplexTimerView.svelte";
  let storedWorkouts;
  let idsCounter = 0;
  let cicles = [
    { name: "Cicle 1", id: idsCounter, duration: 0, isRest: false }
  ];
  let totalTime, interval, ciclesLeft;
  let seconds = 0;
  let isRest = false;
  let playing = false;
  let countMode = false;
  let selectedWorkout;

  const selectWorkout = workout => {
    selectedWorkout = workout;
    countMode = true;
    startCounter();
  };

  onMount(() => {
    const workouts = window.localStorage.getItem("workouts");
    if (workouts) {
      storedWorkouts = JSON.parse(workouts);
    }
  });

  const addNewCicleInput = () => {
    cicles.push({ name: `New Cicle`, id: newId(), duration: 0 });
    cicles = cicles;
  };

  const newId = () => {
    idsCounter++;
    return idsCounter;
  };

  const removeCicle = id => {
    cicles = cicles.filter(cicle => cicle.id !== id);
  };

  const handleTimerSubmit = e => {
    if (!e.target.name) return;
    let workoutsToSave = [];
    let newWorkout = {
      name: e.target.name.value,
      cicles,
      duration: cicles.reduce((acc, value) => acc + value.duration, 0)
    };

    if (storedWorkouts) {
      workoutsToSave = [...storedWorkouts, newWorkout];
    } else {
      workoutsToSave = [newWorkout];
    }

    window.localStorage.setItem("workouts", JSON.stringify(workoutsToSave));
    storedWorkouts = workoutsToSave;
  };

  const deleteWorkout = name => {
    storedWorkouts = storedWorkouts.filter(workout => workout.name !== name);
    window.localStorage.setItem("workouts", JSON.stringify(storedWorkouts));
  };

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
    ciclesLeft = selectedWorkout.cicles.length;
    seconds = selectedWorkout.cicles[ciclesLeft - 1].duration;
    isRest = selectedWorkout.cicles[ciclesLeft - 1].isRest;
    totalTime = seconds;
    interval = setInterval(() => {
      if (ciclesLeft > 0) {
        if (seconds > 0) {
          if (!!audio && seconds === 1) {
            audio.currentTime = 0;
            audio.play();
          }
          seconds = seconds - 1;
        } else {
          ciclesLeft = ciclesLeft - 1;
          seconds = selectedWorkout.cicles[ciclesLeft - 1].duration;
          isRest = selectedWorkout.cicles[ciclesLeft - 1].isRest;
          totalTime = seconds;
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
  label {
    display: flex;
    align-items: flex-start;
    width: 100%;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  label.rest {
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
  }

  label.rest input {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }

  label.rest input:checked + .fake-input p {
    color: var(--secondary);
    transform: scale(1);
  }

  .fake-input p {
    margin: 0;
    font-size: 48px;
    transform: scale(0);
    transition: transform 0.2s ease-in-out;
  }

  label.rest .fake-input {
    background-color: var(--main);
    margin-right: 10px;
    border-radius: 4px;
    border: 1px solid var(--secondary);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close {
    font-size: 20px;
    position: absolute;
    top: 0;
    right: 5px;
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }

  input {
    width: 100%;
    margin: 0px;
    margin-top: 4px;
    padding: 1rem;
    border-radius: 4px;
    color: var(--main);
    border: 1px solid var(--main);
    background-color: var(--secondary);
  }

  .cicle {
    position: relative;
    background-color: var(--main);
    padding: 2rem 1rem 1rem;
    border-radius: 4px;
    color: var(--secondary);
    margin-bottom: 1rem;
  }

  .cicle input {
    color: var(--secondary);
    border: 1px solid var(--secondary);
    background-color: var(--main);
  }

  .cicle label:last-of-type {
    margin-bottom: 0;
  }

  .btn {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--main);
    color: var(--main);
    cursor: pointer;
    background-color: transparent;
  }

  .btn.delete {
    width: 80px;
    margin-right: 10px;
  }

  .btn.inverse {
    border: 1px solid var(--secondary);
    color: var(--secondary);
    background-color: var(--main);
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 1rem 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border: 1px solid var(--main);
    margin-bottom: 1rem;
    position: relative;
  }

  li > div {
    flex: 1;
  }

  li p {
    text-align: left;
    margin: 0;
  }

  li button {
    margin-bottom: 0;
  }

  .cicles-bar {
    display: flex;
    border-radius: 4px;
    height: 10px;
    overflow: hidden;
    position: absolute;
    bottom: 10px;
    width: 80%;
  }

  .small-cicle {
    display: flex;
    flex: 1;
    transition: flex-basis 0.2s ease-in-out;
  }

  .small-cicle.work {
    background-color: var(--red);
  }

  .small-cicle.rest {
    background-color: var(--blue);
  }

  form .cicles-bar {
    position: static;
    margin: 1rem 0;
    width: 100%;
  }
</style>

<form on:submit|preventDefault={handleTimerSubmit}>
  <label for="name">
    Workout Name:
    <input type="text" id="name" name="name" />
  </label>

  {#each cicles as cicle}
    <div id={`cicle-${cicle.id}`} class="cicle">
      <button
        type="button"
        class="close"
        on:click={() => removeCicle(cicle.id)}>
        &times;
      </button>
      <label for={`cicle-${cicle.id}-name`}>
        Cicle name:
        <input
          bind:value={cicle.name}
          type="text"
          id={`cicle-${cicle.id}-name`}
          name={`cicle-${cicle.id}-name`} />
      </label>
      <label for={`cicle-${cicle.id}-duration`}>
        Duration (seconds):
        <input
          bind:value={cicle.duration}
          type="number"
          id={`cicle-${cicle.id}-duration`}
          name={`cicle-${cicle.id}-duration`} />
      </label>
      <label class="rest" id={`cicle=${cicle.id}-isRest`}>
        Rest?
        <input
          type="checkbox"
          bind:checked={cicle.isRest}
          id={`cicle=${cicle.id}-isRest`}
          name={`cicle=${cicle.id}-isRest`} />
        <div class="fake-input">
          <p>&check;</p>
        </div>
      </label>
    </div>
  {/each}

  <button class="btn" type="button" on:click={addNewCicleInput}>
    Add Cicle
  </button>

  <p>Workout duration: {cicles.reduce((acc, c) => acc + c.duration, 0)}</p>
  <div class="cicles-bar">
    {#each cicles as cicle}
      <div
        class={cicle.isRest ? 'small-cicle rest' : 'small-cicle work'}
        style={`flex-basis: ${(cicle.duration * 100) / cicles.reduce((acc, c) => acc + c.duration, 0)}%`} />
    {/each}
  </div>

  <button class="btn inverse">Save</button>
</form>

<ul>
  {#each storedWorkouts || [] as workout}
    <li>
      <div>
        <p>{workout.name}</p>
        <p>
          <small>{workout.cicles.length} cicle(s)</small>
        </p>
      </div>
      <button class="btn delete" on:click={() => deleteWorkout(workout.name)}>
        Delete &times;
      </button>
      <PlayButton klass="" on:click={() => selectWorkout(workout)} />
      <div class="cicles-bar">
        {#each workout.cicles as cicle}
          <div
            class={cicle.isRest ? 'small-cicle rest' : 'small-cicle work'}
            style={`flex-basis: ${(cicle.duration * 100) / workout.duration}%`} />
        {/each}
      </div>
    </li>
  {/each}
</ul>

{#if countMode}
  <ComplexTimerView
    {playing}
    on:start={startCounter}
    on:stop={stopCounter}
    on:close={closeCountMode}
    {isRest}
    {totalTime}
    {seconds}
    cicles={ciclesLeft} />
{/if}
