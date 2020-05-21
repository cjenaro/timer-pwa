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
    margin-bottom: 0;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: 2px solid var(--main);
    background-color: transparent;
    position: relative;
    cursor: pointer;
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }

  .triangle {
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-left-color: var(--main);
    border-top-width: 10px;
    border-bottom-width: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -10px;
    margin-left: -8px;
    transition: border-color 0.2s ease-in-out;
  }

  button.active {
    border-color: transparent;
    background-color: var(--main);
    pointer-events: none;
  }

  button.active .triangle {
    border-left-color: var(--secondary);
  }
</style>

<button class={klass} on:click={dispatchClick}>
  <div class="triangle" />
</button>
