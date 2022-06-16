<script>
  import '$lib/styles/colors.scss'
  import { selectedCategory, selectedLevel } from '$lib/stores.js'
  export let categories
  export let levels = ['Primary school', 'Secondary school']
  export let view

</script>

<div class='category-select-wrapper'>
  <h2 class='label'>
    Select a kanji {view}
  </h2>
  <div class='custom-select'>
    {#if view === 'topic'}
      <select bind:value={$selectedCategory}>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    {:else if view === 'grade'}
      <select bind:value={$selectedLevel}>
        {#each levels as level}
          <option value={level}>{level}</option>
        {/each}
      </select>
    {:else}
      <div></div>
    {/if}
    <span class='custom-arrow'></span>
  </div>
</div>


<style lang='scss'>
  @import '../../../lib/styles/colors.scss';
  $width: 300px;
  $mobile-width: 540px;

  .category-select-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    flex-wrap: wrap;
    @media (max-width: $mobile-width) {
    }
  }

  .label {
    color: $col-mid-grey;
    margin-right: 10px;
    font-weight: 400;
    @media (max-width: $mobile-width) {
      margin-bottom: 5px;
    }
  }

  .custom-select {
    box-sizing: border-box;
    position: relative;
    width: $width;
    height: 30px;
    margin-bottom: 10px;
    @media (max-width: $mobile-width) {
      margin-bottom: 30px;
    }
  }

  select {
    box-sizing: border-box;
    padding: 7px 10px;
    border-radius: 10px;
    color: $col-mid-grey;
    background-color: #fff;
    border: 3px solid $col-mid-grey;
    width: $width;
    font-size: 16px;
  }

  .custom-arrow {
    box-sizing: border-box;
    position: absolute;
    top: 10px;
    right: 5px;
    background-color: #fff;
    display: block;
    height: 24px;
    width: 24px;
    padding-right: 35px;
    // border-radius: 0 10px 10px 0;
    // border: 3px solid $col-mid-grey;
    // border-left: none;
    pointer-events: none; // pointer events will not work on this element
  }

  .custom-arrow::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  // Create a triangle
  .custom-arrow::after {
    border-left: 10px solid transparent;
    border-right:  10px solid transparent;
    border-top: 10px solid $col-pink-primary;
    //top: 60%;
  }


</style>