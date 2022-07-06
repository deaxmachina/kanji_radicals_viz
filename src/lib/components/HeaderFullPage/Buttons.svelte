<script>
  import '$lib/styles/colors.scss'
  import { createEventDispatcher } from 'svelte';
  import { selectedKanji } from '$lib/stores.js'

  const dispatch = createEventDispatcher();

  let selectedView = 'topic'
  const setView = (view) => {
    selectedView = view 
    dispatch('view', {
			text: selectedView
		});
  }

  let revealQuestion = false

</script>

<div class='selection-buttons-section'>
  <button class:active={selectedView === 'grade'} class='grade-btn' on:click={() => { setView('grade'); selectedKanji.set('') }}>
    <h5>grade</h5>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div 
      on:mouseover={() => { revealQuestion = true }} 
      on:mouseout={() => { revealQuestion = false }} 
      class='question'
    >?</div>
    <div class='message' style='opacity: {revealQuestion ? 1 : 0}'>! very slow, wait patiently~</div>
  </button>
  <button class:active={selectedView === 'topic'} class='topic-btn' on:click={() => { setView('topic'); selectedKanji.set('') }}>
    <h5>topic</h5>
  </button>
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
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(0.95);
    }
    @media (max-width: 600px) {
      width: 240px;
      height: 100px;
    }
    @media (max-width: 500px) {
      width: 180px;
      height: 100px;
    }
  }

  .selection-buttons-section {
    position: absolute;
    display: inline-block;
    right: 10%;
    top: 60%;
    z-index: 20;

    @media (max-width: 600px) {
      top: 60%;
    }

    .topic-btn {
      position: absolute;
      right: 70%;
      top: 70%;
      border: 1px dashed $col-pink-primary;
      display: flex;
      justify-content: flex-start;
      &.active {
        background-color: $col-pink-primary;
      }
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
        @media (max-width: 600px) {
          font-size: 45px;
        }
        @media (max-width: 500px) {
          font-size: 40px;
        }
      }
    }

    .grade-btn {
      border: 1px dashed $col-green-primary;
      z-index: 21 !important;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      &.active {
        background-color: $col-green-primary;
      }
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
        @media (max-width: 600px) {
          font-size: 45px;
        }
        @media (max-width: 500px) {
          font-size: 40px;
        }
      }
      div.question {
        position: absolute;
        top: -25px; 
        right: -10px;
        //background-color: $light-color;
        color: $col-mid-grey;
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-family: 'lores-12', sans-serif;
        font-size: 16px;
        @media (max-width: 700px) {
          top: -35px; 
          right: -20px;
          width: 60px;
          height: 60px;
          font-size: 18px;
          z-index: 200;
        }
      }
      div.message {
        position: absolute;
        top: -25px; 
        right: 20px;
        background-color: $light-color;
        color: $col-mid-grey;
        padding: 0px 5px;
        @media (max-width: 700px) {
          top: -35px; 
          right: 20px;
        }
      }
    }

    p {
      position: absolute;
      left: -10%;
      top: 40%;
      color: $col-mid-grey;
      font-size: 18px;
      font-family: 'lores-12', sans-serif;
      @media (max-width: 600px) {
        top: 30%;
        left: -15%;
      }
    }
  }


</style>