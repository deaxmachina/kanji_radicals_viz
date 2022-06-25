<script>
    import _ from 'lodash'
    import { onMount } from 'svelte'
    import * as d3 from 'd3'
    import '$lib/styles/global.scss';
    import { selectedKanji } from '$lib/stores.js'

    // Grades colours
    const grades = ['1', '2', '3', '4', '5', '6', 'S']
    const colours = {
      colLevels: ['#8dcaab', '#9fcfc0', '#bdb7cc', '#cfa1cb', '#ce8cbd', '#c170ab', '#a15da2'],
      colMissingKanji: '#4d5054',
    }
    const colourByGradeScale = d3.scaleOrdinal()
      .domain(grades)
      .range(colours.colLevels)

    // Load font 
    onMount(() => {
      (function(d) {
        var config = {
          kitId: 'ney6oku',
          scriptTimeout: 3000,
          async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);
      })
</script>


<div class='popup-container'>
  <div class='kanji-popup-wrapper'>

    <div class='kanji-level-radicals'>
      <div class='kanji-and-level'>
        <div 
          class='grade-rect' 
          style='background-color: {$selectedKanji.grade === 'none' ? colours.colMissingKanji : colourByGradeScale($selectedKanji.grade)}'
          ></div>
        <h2 class=kanji>{$selectedKanji.kanji}</h2>
      </div>
      <div class='radicals'>
        <!-- <span class='radicals-label'>radicals:</span>  -->
        <h3>{$selectedKanji.radicals.length > 0 ? $selectedKanji.radicals.join('、 ') : ''}</h3>
      </div>
    </div>

    <div class='entry-wrapper'>
      <span class='reading-label'>kun</span> 
      <h3 class='jp'>{$selectedKanji.kun_readings.length > 0 ? $selectedKanji.kun_readings.join('、 ') : '-'}</h3>   
    </div>
    <div class='entry-wrapper'>
      <span class='reading-label'>on </span>
      <h3 class='jp'>{$selectedKanji.on_readings.length > 0 ? $selectedKanji.on_readings.join('、 ') : '-'}</h3>
    </div>
    <div class='entry-wrapper'>
      <span class='reading-label'>meanings </span>
      <h3 class='en'>{$selectedKanji.meanings.length > 0 ? $selectedKanji.meanings.join(', ') : '-'}</h3>
    </div>

    <div class='jisho'>
      <a 
        style='color: {$selectedKanji.grade === 'none' ? colours.colMissingKanji : colourByGradeScale($selectedKanji.grade)}'
        href='https://jisho.org/search/{$selectedKanji.kanji}' target='_blank'
      >jisho</a>
    </div>

  </div>
</div>



<style lang='scss'>
  @import '../../../lib/styles/global.scss';
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&display=swap');
  @import url("https://use.typekit.net/pso5rde.css");

  .popup-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f7ede2b6;
    pointer-events: none;
    z-index: 2;
  }
  .kanji-popup-wrapper {
    box-sizing: border-box;
    position: sticky;
    top: 20%;
    left: 50%;
    z-index: 3;
    transform: translate(-50%, 0);
    transition: all 0.3s ease;
    background-color: white;
    width: 400px;
    padding: 25px 40px 30px 40px;
    border-radius: 20px;
    border: 5px solid $col-mid-grey;
    pointer-events: all;
    @media (max-width: 900px) {
    }
    @media (max-width: 400px) {
      width: calc(100% - 10px);
    }
  }

  div.kanji-level-radicals {
    //background-color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
  }

  div.kanji-and-level {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 25px;
    div.grade-rect {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    h2.kanji {
      color: $col-dark;
      font-family: 'dnp-shuei-mgothic-std', sans-serif;
      font-size: 60px;
      font-weight: 200;
      //background-color: red;
      margin-top: 0;
      margin-bottom: 0;
      padding: 0;
      line-height: 1;
    }
  }

  div.radicals {
    max-width: 150px;
    h3 {
      font-family: 'dnp-shuei-mgothic-std', sans-serif;
      line-height: 1.2;
    }
  }

  .entry-wrapper {
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 20px;
    }
    .reading-label {
      display: inline;
      color: #fff;
      font-weight: 600;
      background-color: #4d505488;
      padding: 0 4px;
    }
    h3 {
      display: inline;
      color: $col-dark;
      &.jp {
        font-family: 'dnp-shuei-mgothic-std', sans-serif;
        line-height: 1.2;
        font-weight: 400;
      }
      &.en {
        font-weight: 400;
      }
    }
  }

  .jisho {
    text-align: right;
    margin-top: 20px;
    a {
      font-weight: 600;
      font-family: 'lores-12', sans-serif;
    }
  }


</style>