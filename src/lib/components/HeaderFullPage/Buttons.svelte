<script>
  import '$lib/styles/colors.scss'
</script>

<div class='selection-buttons-section'>
  <button class='topic-btn'><h5>topic</h5></button>
  <button class='grade-btn'><h5>grade</h5></button>
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
      background-color: $col-pink-primary;
      display: flex;
      justify-content: flex-start;
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
      background-color: $col-green-primary;
      z-index: 21 !important;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      h5 {
        color: $col-pink-primary;
        font-size: 50px;
        margin: 0;
        margin-right: 10px;
        padding: 0;
        font-weight: 300;
      }
    }
  }


</style>