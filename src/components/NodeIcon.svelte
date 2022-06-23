<script>
  export let type, width;
</script>

{#if ["start", "end"].includes(type)}
  <svg class={`svgIcon  ${type}`} y="15" x={width / 2} height="20" width="20">
    <use xlink:href={`#svg${type}`} />
  </svg>
{:else if type === "goback"}
  <svg class="svgIcon  goback" y="0" x={width / 2 + 16} height="20" width="20">
    <use xlink:href="#svggoback" />
  </svg>
  <svg class="svgIcon  human" y="0" x={width / 2} height="20" width="16">
    <use xlink:href="#svghuman" />
  </svg>
{:else}
  <svg class={`svgIcon  ${type}`} y="0" x={width / 2} height="20" width="16">
    <use xlink:href={`#svg${type}`} />
  </svg>
{/if}

<style lang="less">
  // @colors.Clouds:#ecf0f1;

  .svgIcon {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    font-size: 48px;
  }
  :global(.svgIcon.rules) {
    color: .colors[Clouds];
  }

  :global(.svgIcon.start) {
    color: .colors[Clouds];
  }
  :global(.svgIcon.end) {
    color: .colors[Clouds];
  }
  :global(.svgIcon.function) {
    color: .colors[Clouds];
  }
  :global(.svgIcon.human) {
    color: .colors[Clouds];
  }
  :global(.svgIcon.goback) {
    color: .colors[Clouds];
  }
</style>
