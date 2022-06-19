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

    <div class='container-background'>
      <h1>漢字</h1>
    </div>

    <div class=container-foreground>
      <div class='content-foreground'>
        <div class='top-decoration-container'>
          <svg width={60} height={50} style='background-color: none;'>
            <g transform='scale(1.7)'>
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

    <i class="arrow down arrow-1"></i>
    <i class="arrow down arrow-2"></i>
</div>



<style lang='scss'>
  @import '../../../lib/styles/global.scss';
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&display=swap');
  @import url("https://use.typekit.net/pso5rde.css");


  h1, h2, div {
    margin: 0;
    padding: 0;
  }

  .header-foreground-section {
    width: 100%;
    height: 100vh;
    margin: auto;
    background-color: $light-color;
  }

  .container-background {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    @media (max-width: 700px) {
      top: 10%;
      transform: translate(-50%, -10%);
    }
    h1 {
      padding: 0;
      margin: 0;
      font-size: 420px;
      line-height: 1;
      opacity: 0.4;
      font-family: 'dnp-shuei-mgothic-std', sans-serif;
      color: #fff;
      font-weight: 300;
      @media (max-width: 600px) {
          font-size: 300px;
      }
    }
  }

  .container-foreground {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // align-items: flex-start;
    // margin-top: 12%; 
    @media (max-width: 1400px) and (max-height: 1250px) {
      align-items: flex-start;
      padding-top: max(250px, 20%);
    }
  }

  .content-foreground {
    display: inline-block;
    z-index: 10;
    cursor: default;
    // Squares decorating the kanji //
    .top-decoration-container {
      margin: auto;
      margin-bottom: -100px;
      margin-right: 50px;
      text-align: right;
      .cls-1{fill:#cfa1cb;}
      .cls-2{fill:#c170ab;}
      .cls-3{fill:#844588;}
      .cls-4{fill:#ce8cbd;}
      .cls-5{fill:#8dcaab;}
      .cls-6{fill:#a0d0c0;}
    }
    // Kanji //
    .title-kanji-container {
      position: relative;
      h1.foreground-text, h1.background-text {
        font-size: 220px;
        font-family: 'houschka-rounded', sans-serif;
        line-height: 1.1;
        @media (max-width: 600px) {
          font-size: 160px;
        }
      }   
      h1.foreground-text {
        color: #fff;
        position: absolute;
        top: -10px;
        left: -10px;
      }
      h1.background-text {
        color: $col-pink-primary;
      }
    }
    // With radicals //
    .title-withradicals-conatiner {
      position: relative;
      h2.foreground-text, h2.background-text {
        font-size: 80px;
        font-family: 'lores-12', sans-serif;
        font-weight: 400;
        @media (max-width: 600px) {
          font-size: 60px;
        }
      } 
      h2.foreground-text {
        position: absolute;
        top: -2px;
        left: -4px;
        color: $col-pink-primary;
      }
      h2.background-text {
        color: $col-green-primary;
      }
    }
  }


  .arrow {
    border: solid $col-green-primary;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    position: absolute;
    left: 50%;
    bottom: 80px;
    &.down {
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      &.arrow-2 {
        bottom: 70px;
        //border: solid $col-green-secondary;
      }
    }
  }

</style>