<script>
  import '$lib/styles/colors.scss'
  let legendDataAll = [
    {
      label: 'Grade 1',
      colour: '#8dcaab'
    },
    {
      label: '2',
      colour: '#9fcfc0'
    },
    {
      label: '3',
      colour: '#bdb7cc'
    },
    {
      label: '4',
      colour: '#cfa1cb'
    },
    {
      label: '5',
      colour: '#ce8cbd'
    },
    {
      label: '6',
      colour: '#c170ab'
    },
    {
      label: 'Secondary school',
      colour: '#a15da2'
    },
    {
      label: 'Not a jouyou kanji',
      colour: '#4d5054'
    },
    {
      label: 'Radical',
      colour: '#fff'
    }
  ]

  export let view
  $: legendData = view === 'topic' ? legendDataAll : legendDataAll.filter(d => d.label !== 'Not a jouyou kanji')
</script>

<div class='grade-legend-wrapper'>
  {#each legendData as entry (entry.colour)}
    <div class='legend-entry'>
      {#if entry.label === 'Radical'}
        <div class='background-rect radical' style='background-color: {entry.colour}'></div>
      {:else}
        <div class='background-rect' style='background-color: {entry.colour};'></div>
      {/if}
      <div class='label'>{entry.label}</div>
    </div>
  {/each}
</div>


<style lang='scss'>
  @import '../../../lib/styles/colors.scss';
  $width: 300px;

  .grade-legend-wrapper {
    //background-color: red;
    margin-left: 40px;
    margin-top: 30px;
    margin-bottom: 30px;
    font-family: 'houschka-rounded', sans-serif;
    color: $col-mid-grey;
    display: flex;
    flex-wrap: wrap;
  }

  .legend-entry {
    display: flex;
    @media (max-width: 850px) {
      margin-bottom: 16px;
    }
  }

  .background-rect {
    box-sizing: border-box;
    width: 22px;
    height: 22px;
    margin-right: 3px;
    @media (max-width: 800px) {
      width: 20px;
      height: 20px;
    }
    &.radical {
      border-radius: 10px;
      border: 2px solid #251926;
    }
  }

  .label {
    margin-right: 22px;
    font-weight: 300;
    @media (max-width: 800px) {
      margin-right: 16px;
    }
  }
</style>