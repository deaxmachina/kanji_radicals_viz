<script>
  import '$lib/styles/colors.scss'
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let selectedView = 'topic'
  const setView = (view) => {
    selectedView = view 
    dispatch('view', {
			text: selectedView
		});
  }


</script>

<div class='selection-buttons-section'>
  <button class='topic-btn' on:click={() => setView('topic')}><h5>topic</h5></button>
  <button class='grade-btn' on:click={() => setView('grade')}><h5>grade</h5></button>
  <p>by</p>
</div>


<style lang='scss'>
  @import '../../../lib/styles/global.scss';
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&display=swap');
  @import url("https://use.typekit.net/pso5rde.css");

  h1, h2, div {
    margin: 0;
    padding: 0;
  }

  button {
    box-sizing: border-box;
    width: 300px;
    height: 150px;
    cursor: pointer;
    border: none;
    background-color: white;
    //border: none;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(0.95);
    }
  }

  .selection-buttons-section {
    position: absolute;
    display: inline-block;
    right: 10%;
    top: 60%;
    z-index: 20;

    .grade-btn {
      position: absolute;
      right: 70%;
      top: 70%;
      //background-color: $col-pink-primary;
      border: 2px solid $col-pink-primary;
      display: flex;
      justify-content: flex-start;
      &:hover {
        background-color: $col-pink-primary;
      }
      h5 {
        color: $col-green-primary;
        font-size: 50px;
        margin: 0;
        margin-left: 10px;
        padding: 0;
        font-weight: 300;
      }
    }

    .topic-btn {
      //background-color: $col-green-primary;
      border: 2px solid $col-green-primary;
      z-index: 21 !important;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      &:hover {
        background-color: $col-green-primary;
      }
      h5 {
        color: $col-pink-primary;
        font-size: 50px;
        margin: 0;
        margin-right: 10px;
        padding: 0;
        font-weight: 300;
      }
    }

    p {
      position: absolute;
      left: -10%;
      top: 40%;
      color: $col-mid-grey;
      font-size: 18px;
      font-family: 'lores-12', sans-serif;
    }
  }


</style>