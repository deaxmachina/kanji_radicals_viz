<script></script>


<section class='footer-wrapper'>
  <div class='footer-content'>
    <h2 class='section-heading'>Data</h2>
    <div>
      <span><a class='resource-link' href='https://en.wikipedia.org/wiki/List_of_kanji_by_concept' target='_blank'>Wikipedia: List of kanji by concept</a></span>
    </div>
    <div>
      <span><a class='resource-link' href='https://en.wikipedia.org/wiki/List_of_j%C5%8Dy%C5%8D_kanji' target='_blank'>Wikipedia: List of jōyō kanji</a></span>
    </div>
    <div>
      <span><a class='resource-link' href='https://jisho.org/' target='_blank'>All kanji information – readings, radicals, meanings – from Jisho. </a></span>
    </div>

    <h2 class='section-heading'>About</h2>
    <p>
      Japanese kanji contain one radical each. 
      For example, you can see the radical of each jōyō  
      kanji (常用漢字) on this <a href='https://en.wikipedia.org/wiki/List_of_j%C5%8Dy%C5%8D_kanji'>Wiki page</a>.
      <br>
      As you can see in the graphs above, here each kanji can contain multiple radicals ('building blocks'). 
      My hypothesis was that visualising kanji like this, i.e. using a force graph that naturally nudges kanji 
      which contain similar building blocks together, might help with kanji memorisation. 
      I also used the classification by concept by Wiki dataset to explore patterns between kanji belonging 
      to similar meaning categories and their constituent parts. 
      <br>
      It seems like some interesting clear patterns emerge, such the large number of appearances of 
      the radical <strong>心</strong> 💜 in emotion-revealing kanji. In other cases, it’s harder to see a pattern.
    </p>
    <p>
      I made the kanji graphs just for myself initially, but it grew into a more proper page. However, 
      I am just a humble student of Japanese, so don’t treat it as a rigorous language resource. 
      The page is also very slow. This is because it's made of thousands of svg shapes. I removed responsiveness for the grade graph 
      to speed it up a bit. I might re-do it a different way if there is interest, but in the meantime, be patient with it. 
      Wait a little bit when you click so that the kanji have time to arrange themselves in the final nice graph form. 
    </p>
    <p>
      Ultimately, this page is <strong>hopefully</strong> a fun way to explore kanji and use radical patterns to 
      remember kanji more easily. Click around to discover what it does ✨. 
    </p>
    <div>
      Get in touch with me 
      
      if you see any mistakes or want to chat. 
    </div>

    <div class='madeby'>
      Made with 💖 by Dea Bankova in 2022. 
    </div>
  </div>
</section>



<style lang='scss'>
  @import '../../../lib/styles/colors.scss';
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&display=swap');
  @import url("https://use.typekit.net/pso5rde.css");
  .footer-wrapper {
    box-sizing: border-box;
    width: 100%;
    background-color: $col-pink-secondary;
    color: white;
    margin: 0;
    padding: 30px 50px;
    .footer-content {
      box-sizing: border-box;
      width: 100%;
      max-width: 700px;
      margin: auto;
    }
  }

  .section-heading {
    font-family: 'lores-12', sans-serif;
    color: $col-green-primary;
    font-size: 36px;
  }

  a {
    color: #b5e2d4;
    text-decoration: none;
    border-bottom: 1px dashed #b5e2d4;
    letter-spacing: 1.6px;
    &.resource-link {
      line-height: 2.5;
    }
  }

  p {
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 1.6px;
  }

  .madeby {
    margin-top: 50px;
  }
</style>