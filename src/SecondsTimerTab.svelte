<script>
  import { onMount } from "svelte";
  import SecondsTimerView from "./SecondsTimerView.svelte";
  import { parseMinutes } from "./utils/time";
  import PlayButton from "./PlayButton.svelte";
  let secondsUrl = "";
  let promise,
    cicles,
    currentCicle,
    ciclesLeft,
    seconds,
    interval,
    storedWorkouts,
    workoutName,
    selectedWorkout;
  let playing = false;
  let countMode = false;

  onMount(() => {
    const workouts = window.localStorage.getItem("seconds_workouts");
    if (workouts) {
      storedWorkouts = JSON.parse(workouts);
    }
  });

  const closeCountMode = () => {
    countMode = false;
    stopCounter();
  };

  const handlePlaying = e => {
    setTimeout(() => {
      e.target.pause();
    }, 550);
  };

  const selectWorkout = workout => {
    selectedWorkout = workout;
  };

  const deleteWorkout = name => {
    storedWorkouts = storedWorkouts.filter(workout => workout.name !== name);
    window.localStorage.setItem(
      "seconds_workouts",
      JSON.stringify(storedWorkouts)
    );
  };

  const startCounter = () => {
    const audio = document.querySelector("#audio");
    audio.addEventListener("play", handlePlaying);
    playing = true;
    ciclesLeft = selectedWorkout.cicles.length;
    currentCicle = selectedWorkout.cicles[0];
    seconds = currentCicle.duration;
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
          if (ciclesLeft > 0) {
            currentCicle =
              selectedWorkout.cicles[
                selectedWorkout.cicles.length - ciclesLeft
              ];
            seconds = currentCicle.duration;
          }
        }
      } else {
        countMode = false;
        playing = false;
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleStart = workout => {
    selectWorkout(workout);
    countMode = true;
    startCounter();
  };

  const stopCounter = () => {
    playing = false;
    clearInterval(interval);
  };

  const handleLoadFromSeconds = e => {
    promise = fetch(`https://timer-pwa-back.herokuapp.com/?url=${secondsUrl}`)
      .then(blob => blob.json())
      .then(res => (cicles = res));
  };

  const handleAddWorkout = () => {
    let newWorkout = {
      name: workoutName,
      cicles: cicles.map(c => ({ ...c })),
      duration: cicles.reduce((acc, value) => acc + value.duration, 0)
    };

    if (storedWorkouts) {
      storedWorkouts = [...storedWorkouts, newWorkout];
    } else {
      storedWorkouts = [newWorkout];
    }

    window.localStorage.setItem(
      "seconds_workouts",
      JSON.stringify(storedWorkouts)
    );
  };
</script>

<style>
  label {
    color: var(--main);
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 1rem;
  }

  input {
    width: 100%;
    border: 1px solid var(--main);
    color: var(--main);
    background-color: var(--secondary);
    margin-top: 4px;
    border-radius: 4px;
  }

  button {
    border: 1px solid var(--main);
    border-radius: 4px;
    text-transform: uppercase;
    background-color: var(--secondary);
    color: var(--main);
    cursor: pointer;
    padding: 1rem 0.875rem;
  }

  .cicles-bar {
    display: flex;
    border-radius: 4px;
    height: 10px;
    overflow: hidden;
    margin: 1rem 0;
    width: 100%;
  }

  .small-cicle {
    border-right: 2px solid var(--secondary);
    display: flex;
    flex: 1;
    transition: flex-basis 0.2s ease-in-out;
  }

  .small-cicle:last-of-type {
    border-right: 0;
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

  li button.delete {
    margin-right: 10px;
  }

  li .cicles-bar {
    position: absolute;
    bottom: 10px;
    width: 80%;
    margin: 0;
  }

  label.add-workout {
    flex-direction: row;
    flex-wrap: wrap;
  }

  label.add-workout p {
    text-align: left;
    width: 100%;
  }

  label.add-workout input {
    width: 70%;
    padding: 1rem;
    margin: 0 10px 0 0;
  }

  label.add-workout button {
    width: 25%;
    padding: 1rem;
    margin: 0;
  }
</style>

<form on:submit|preventDefault={handleLoadFromSeconds}>
  <label for="url">
    Paste seconds timer url here:
    <input type="text" bind:value={secondsUrl} />
  </label>
  <button>Submit</button>
</form>

{#await promise}
  <p>Loading...</p>
{:then values}
  {#if values}
    <p>
      Workout duration: {parseMinutes(values.reduce((acc, c) => acc + c.duration, 0))}
    </p>
    <div class="cicles-bar">
      {#each values as cicle}
        <div
          class="small-cicle"
          style={`
            flex-basis: ${(cicle.duration * 100) / values.reduce((acc, c) => acc + c.duration, 0)}%;
            background-color: ${cicle.color};
          `} />
      {/each}
    </div>

    <label for="workoutName" class="add-workout">
      <p>Name:</p>
      <input id="workoutName" type="name" bind:value={workoutName} />
      <button on:click={handleAddWorkout}>Add &check;</button>
    </label>
  {/if}
{:catch error}
  <pre>{JSON.stringify(error, null, 2)}</pre>
{/await}

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
      <PlayButton klass="" on:click={() => handleStart(workout)} />
      <div class="cicles-bar">
        {#each workout.cicles as cicle}
          <div
            class="small-cicle"
            style={`
            background-color: ${cicle.color};
            flex-basis: ${(cicle.duration * 100) / workout.duration}%`} />
        {/each}
      </div>
    </li>
  {/each}
</ul>

{#if countMode}
  <SecondsTimerView
    {playing}
    on:start={startCounter}
    on:stop={stopCounter}
    on:close={closeCountMode}
    {seconds}
    totalCicles={selectedWorkout.cicles.length}
    cicle={currentCicle}
    {ciclesLeft} />
{/if}
