<script>
  import '$lib/styles/colors.scss'
</script>

<svelte:head>
	<script>
    (function(d) {
      var config = {
        kitId: 'ney6oku',
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
    })(document);
  </script>
</svelte:head>

<div class='header-foreground-section'>
  <div class='title-container'>

    <div class='title-background'>
      <h1>漢字</h1>
    </div>

    <div class='title-foreground'>
      <div class='top-decoration-container'>
        <svg width={70} height={50} style='background-color: none;'>
          <g transform='scale(1.8)'>
            <rect class="cls-1" x="6.44" width="8.28" height="8.28"/>
            <rect class="cls-2" x="17.08" width="12.38" height="12.38"/>
            <rect class="cls-3" x="25.36" y="14.9" width="8.2" height="8.2"/>
            <rect class="cls-4" x="17.78" y="15.85" width="5.19" height="5.19"/>
            <rect class="cls-5" y="12.38" width="14.73" height="14.73"/>
            <rect class="cls-6" x="31.27" y="7.79" width="4.59" height="4.59"/>
          </g>
        </svg>
      </div>
      <div class='title-kanji-container'>
        <h1 class='background-text'>Kanji</h1>
        <h1 class='foreground-text'>Kanji</h1>
      </div>
      <div class='title-withradicals-conatiner'>
        <h2 class='background-text'>with radicals</h2>
        <h2 class='foreground-text'>with radicals</h2>
      </div>
    </div>

  </div>
</div>



<style lang='scss'>
  @import '../../../lib/styles/global.scss';
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&display=swap');
  @import url("https://use.typekit.net/pso5rde.css");

  $top-position: 30%;
  $kanji-position: 40%;
  $withradicals-position: 58%;

  .header-foreground-section {
    width: 100%;
    height: 100vh;
    //max-width: 750px;
    margin: auto;
    background-color: $light-color;
  }
  .title-container {
    position: relative;
    width: 100%;
    height: 100%;
    //margin: 70px auto 80px;
    @media (max-width: 500px) {
      margin: 20px auto;
    }
  }

  //////////////////////////////////
  ///// Background - huge kanji ////
  //////////////////////////////////
  .title-background {
    text-align: center;
    z-index: -1;
    transform: translateY(50%);
    h1 {
      padding: 0;
      margin: 0;
      font-size: 450px;
      line-height: 1;
      opacity: 0.3;
      font-family: 'dnp-shuei-mgothic-std', sans-serif;
      color: #fff;
      font-weight: 300;
    }
  }

  //////////////////////////////////////
  // Foreground - Kanji with Radicals //
  //////////////////////////////////////
  .title-foreground {
    .top-decoration-container {
      position: absolute;
      top: $top-position;
      left: 50%;
      transform: translate(-50%, 0);
      .cls-1{fill:#cfa1cb;}
      .cls-2{fill:#c170ab;}
      .cls-3{fill:#844588;}
      .cls-4{fill:#ce8cbd;}
      .cls-5{fill:#8dcaab;}
      .cls-6{fill:#a0d0c0;}
      @media (max-width: 500px) {
        top: 20%;
      }
    }
    // Kanji
    .title-kanji-container {
      h1.foreground-text, h1.background-text {
        position: absolute;
        margin: 0;
        padding: 0;
        font-size: 200px;
        text-align: center;
        font-family: 'houschka-rounded', sans-serif;
        @media (max-width: 800px) {
          font-size: 150px;
        }
        @media (max-width: 500px) {
          font-size: 120px;
        }
      }
      h1.foreground-text {
        top: $kanji-position;
        left: 50%;
        transform: translate(-50%, -$kanji-position);
        color: #fff;
        @media (max-width: 500px) {
          top: 40%;
        }
      }
      h1.background-text {
        top: calc($kanji-position - 5px);
        left: calc(50% + 5px);
        transform: translate(-50%, -$kanji-position);
        color: $col-pink-primary;
        @media (max-width: 500px) {
          top: calc(40% - 5px);
        }
      }
    }
    
    // With radicals
    .title-withradicals-conatiner {
      h2.foreground-text, h2.background-text {
        position: absolute;
        margin: 0;
        padding: 0;
        font-size: 80px;
        text-align: left;
        line-height: 1;
        font-family: 'lores-12', sans-serif;
        font-weight: 400;
        @media (max-width: 800px) {
          font-size: 60px;
        }
        @media (max-width: 500px) {
          font-size: 45px;
        }
      }
      h2.foreground-text {
        top: $withradicals-position;
        left: calc(50% + 20px);
        transform: translate(calc(-50% + 20px), -$withradicals-position);
        color: $col-pink-primary;
        @media (max-width: 800px) {
          left: calc(50%);
          transform: translate(calc(-50%), -$withradicals-position);
        }
        @media (max-width: 500px) {
          top: 50%;
          left: calc(15%);
          transform: translate(0, 0);
        }
      }
      h2.background-text {
        top: calc($withradicals-position + 2px);
        left: calc(50% + 20px + 2px);
        transform: translate(calc(-50% + 20px + 2px), -$withradicals-position);
        color: $col-green-primary;
        @media (max-width: 800px) {
          left: calc(50% + 2px);
          transform: translate(calc(-50% + 2px), -$withradicals-position);
        }
        @media (max-width: 500px) {
          top: calc(50% + 2px);
          left: calc(15% + 2px);
          transform: translate(0, 0);
        }
      }
    }
  }
</style>