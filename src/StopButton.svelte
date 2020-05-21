<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let klass;

  const dispatchClick = () => {
    dispatch("click");
  };
</script>

<style>
  button {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: 2px solid var(--main);
    background-color: transparent;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }

  button.active {
    border-color: transparent;
    background-color: var(--main);
    pointer-events: none;
  }

  button.active .bar {
    background-color: var(--secondary);
  }

  .bar {
    width: 6px;
    height: 20px;
    background-color: var(--main);
    transition: background-color 0.2s ease-in-out;
  }

  .bar:first-of-type {
    margin-right: 5px;
  }
</style>

<button class={klass} on:click={dispatchClick}>
  <div class="bar" />
  <div class="bar" />
</button>
