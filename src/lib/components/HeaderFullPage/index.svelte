<script>
 import Foreground from './Foreground.svelte'
 import Background from './Background.svelte'
 import Buttons from './Buttons.svelte'

</script>


<section class='header-full-page'>
  <Foreground />
  <Buttons on:view />
  <Background />
</section>

<style lang='scss'>
  .header-full-page {
    height: 100vh;
    width: 100%;
    max-width: 1800px;
    margin: auto;
    //background-color: pink;
  }
</style>