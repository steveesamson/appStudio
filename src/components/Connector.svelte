<script>
  import { onMount } from "svelte";

  export let data;
  let d = "",
    el,
    path;

  export const update = (uiData) => {
    data = { ...data, ...uiData };
  };
  const draw = () => {
    const { x1, y1, x2, y2 } = data;

    let c1x, c1y, c2x, c2y;

    c1x = x1 + 35;
    c1y = y1;
    if (x2 > x1) {
      c2x = x2 - 35;
      c2y = y2;
    } else {
      c1x = x1 + 70;
      c2x = x2 - 70;
      if (y1 < y2) {
        c1y = y1 + 10;
        c2y = y2 - 10;
      } else {
        c1y = y1 - 10;
        c2y = y2 + 10;
      }
    }

    d = `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
  };

  onMount(() => {
    document.addEventListener(
      "mousedown",
      (e) => {
        if (path && path == e.target) {
          // this.canvas.isFocused(this);
        }
      },
      false
    );
    el.addEventListener(
      "click",
      (e) => {
        // this.canvas.isFocused(this);
      },
      false
    );
  });

  $: if (data) {
    draw();
  }
</script>

<g bind:this={el}>
  <path
    id={data.id}
    fill="none"
    stroke-linecap="round"
    stroke="#cccccc"
    stroke-width={2}
    {d}
    marker-end="url(#arrow)"
    bind:this={path}
  />
  <text fill="#ccc" dy="-5">
    <textPath href={`#${data.id}`} startOffset="30">
      {data.name || ""}
    </textPath>
  </text>
</g>
