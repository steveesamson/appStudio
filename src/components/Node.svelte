<script>
  import { onMount, createEventDispatcher, beforeUpdate } from "svelte";
  import NodeIcon from "components/NodeIcon.svelte";
  import NodePoint from "components/NodePoint.svelte";

  export let data, save, canvasEl;

  let el, node, nodeText, nodeInput, nodeOutput;

  let lastPoint, startDimension, operation, next;

  const dispatch = createEventDispatcher();
  //   nexts = [],
  //   prevs = [];

  const sendCanvasEvent = (type, payload) => {
    dispatch(type, payload || data);
  };
  const updateConnectors = async () => {
    data.nexts.forEach((n) => {
      if (data.type !== "goback") {
        n.x1 = data.x + data.width + 18;
        n.y1 = data.y + 27;
      } else {
        n.x1 = data.x + 10;
        n.y1 = data.y + 27;
      }
      //   await save(n);
    });

    data.prevs.forEach((p) => {
      if (data.type !== "goback") {
        p.x2 = data.x - 7;
        p.y2 = data.y + 27;
      } else {
        p.x2 = data.x + data.width + 27;
        p.y2 = data.y + 27;
      }
      //   await save(p);
    });
    // await save(data);
  };

  export const setPrev = async (prev) => {
    // this.prev = prev;
    if (prev) {
      if (data.type !== "goback") {
        prev.y2 = data.y + 27;
        prev.x2 = data.x - 7;
      } else {
        prev.y2 = data.y + 27;
        prev.x2 = data.x + data.width + 27;
      }
      data.prevs.push(prev);
      await save(data);
    }

    // this.setState((pr) => ({ tick: pr.tick + 1 }));
  };

  export const removeNext = async (nxt) => {
    if (nxt) {
      data.nexts.forEach((n, i) => {
        if (nxt.id == n.id) {
          data.nexts.splice(i, 1);
        }
      });
      await save(data);
    }
  };
  const removePrev = async (prev) => {
    if (prev) {
      data.prevs.forEach((n, i) => {
        if (prev.id == n.id) {
          data.prevs.splice(i, 1);
        }
      });
      await save(data);
    }
  };
  export const setNext = async (nxt) => {
    if (nxt) {
      if (data.type !== "goback") {
        nxt.x1 = data.x + data.width + 10;
        nxt.y1 = data.y + 27;
      } else {
        nxt.x1 = data.x + 10;
        nxt.y1 = data.y + 27;
      }
      data.nexts.push(nxt);
      await save(data);
      updateConnectors();
    }

    // this.setState((pr) => ({ tick: pr.tick + 1 }));
  };

  const update = (options) => {
    let delta = { ...options };

    const { name } = options;
    if (name && data.text !== name) {
      nodeText.textContent = name;
      let coords = nodeText.getBBox();
      Object.assign(delta, {
        text: name,
        width: coords.width + 40,
      });
    }
    data = { ...data, ...delta };
    updateConnectors();
  };

  const bindEvents = () => {
    el.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener(
      "mousedown",
      (e) => {
        if (el && el.contains(e.target)) {
          // canvas.isFocused(this);
          sendCanvasEvent("focus");
        }
      },
      false
    );

    //   el.addEventListener(
    //     "dblclick",
    //     (e) => {
    //       // console.log('double clicked: ', e.target)
    //       canvas.openProperty(this);
    //     },
    //     false
    //   );
    // }
  };

  const svgPoint = (evt) => {
    var CTM = canvasEl.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  };
  const onMouseDown = async (e) => {
    if (
      e.target == nodeOutput &&
      (data.type !== "start" || (data.type === "start" && !data.nexts.length))
    ) {
      operation = "onConnecting";

      lastPoint = svgPoint(e);
      lastPoint.y = data.y + 27; //centering...

      // console.log('Compare: svgPoint el:\n ', lastPoint, ' getBox el:\n ', this.el.getBBox() , ' svgPoint process_out\n: ', svgPoint(this.processOutput,e));
      // console.log('Type: ', data.type);
      next = {
        x1: lastPoint.x,
        y1: lastPoint.y,
        x2: lastPoint.x,
        y2: lastPoint.y,
        start: data.id,
        type: "connector",
        direction: data.type === "goback" ? "back" : "front",
      };
      dispatch("connect", next);
      setNext(next);
      // next = _data;
      // setNext(_data);

      //   const _data = await save(
      //     {
      //       x1: lastPoint.x,
      //       y1: lastPoint.y,
      //       x2: lastPoint.x,
      //       y2: lastPoint.y,
      //       start: data.id,
      //       type: "path",
      //       direction: data.type === "goback" ? "back" : "front",
      //     });

      //     if(_data){
      //         next = _data;
      //         setNext(_data);
      //         // await save({ id: _data.id, next: next });
      //     }
    } else {
      operation = "move";
      lastPoint = svgPoint(e);
      startDimension = {
        x: data.x,
        y: data.y,
      };
    }

    //  sendCanvasEvent('focus');

    // prevent browsers from visually dragging the element's outline
    if (e.preventDefault && !e.target.getAttribute("contenteditable")) {
      e.preventDefault();
    } else if (!e.target.getAttribute("contenteditable")) {
      e.returnValue = false; // IE10
    }
    onDown(e);
  };

  const onDown = (e) => {
    // attach to document so mouse doesn't have to stay precisely on the 'handle'
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const onMove = async (e) => {
    e.preventDefault();
    let curPoint = null;
    switch (operation) {
      case "move":
        curPoint = svgPoint(e);

        let xX = curPoint.x - lastPoint.x,
          xY = curPoint.y - lastPoint.y,
          x = startDimension.x + xX,
          y = startDimension.y + xY;

        data = { ...data, x, y };
        dispatch("move", data);
        //   await save({ id: data.id, x: x, y: y });
        //   await save(data);
        updateConnectors(xX, xY);
        break;
      case "onConnecting":
        curPoint = svgPoint(e);
        next.x2 = curPoint.x;
        next.y2 = curPoint.y;
        dispatch("connecting", next);
        // if (!next.name) {
        //   const { start, end } = next;
        //   next.name = `path-${start}-2-${end}`;
        // }
        // await save(next);
        break;
      case "endConnect":
        break;
    }
  };

  const onUp = (e) => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);

    switch (operation) {
      case "onConnecting":
        next.task = data.id;
        next.targetAt = svgPoint(e);
        dispatch("connected", { ...next });
        next = null;
        return;

        // if (e.target.classList.contains("process-input")) {
        if (e.target.classList.contains("process-input")) {
          let to = e.target.parentNode.getAttribute("id");

          next.end = to; //parseInt(to, 10);
          next.task = data.id;
          dispatch("connected", { ...next });
          next = null;

          //   let real = {},
          //     copy = {};
          //   Object.assign(real, next);
          //   Object.assign(copy, next);

          //   real.task = data.id;

          //   delete real.id;

          //   canvas.tasks.save(real, (e, m, data) => {
          //     if (!e) {
          //       canvas.remove(copy);
          //       next = null;
          //       setNext(data);
          //       canvas.tasks.add(data);
          //       canvas.setPrev(to, data);
          //       let path = canvas.UIs[data.id];
          //       if (path) {
          //         path.setState(data);
          //       }
          //     }
          //   });
        } else {
          //   canvas.remove(next);
          sendCanvasEvent("remove", next);
          next = null;
        }

        break;
      case "move":
        break;
    }
    operation = null;
  };

  onMount(() => {
    bindEvents();
    update({ name: data.name });
  });

  $: {
    if (data.name && nodeText) {
      update({ name: data.name });
    }
  }
</script>

<g
  id={data.id}
  class="svgPaneCanvas"
  transform={`translate(${data.x},${data.y})`}
  bind:this={el}
>
  <rect
    x="10"
    y="0"
    width={data.width}
    height={data.height}
    rx={data.radius}
    class={`svgPane ${data.type}`}
    bind:this={node}
  />
  <text
    x={data.tx}
    y={data.ty + 5}
    class="svgPaneText"
    bind:this={nodeText}
    fill={["start", "end"].includes(data.type) ? "transparent" : "#eee"}
  >
    {data.text}
  </text>

  <NodePoint
    type={data.type}
    width={data.width}
    bind:nodeInput
    bind:nodeOutput
  />
  <NodeIcon type={data.type} width={data.width} />
</g>

<style lang="less">
  // @colors.Green:#1fbf41;
  // @colors.Purple:#9b59b6;
  // @colors.Red:#e74c3c;
  // @colors.Clouds:#ecf0f1;

  .svgPaneCanvas {
    color: .colors[Clouds];
  }
  // path{
  //     z-index: 100;
  // }

  .svgPane {
    fill: .colors[Purple];
    cursor: move;
    overflow: visible;
    &.start {
      fill: .colors[Green];
    }
    &.end {
      fill: .colors[Red];
    }
  }
  .svgPaneText {
    stroke: none;
    cursor: move;
  }
</style>
