<script>
  import { onMount } from "svelte";
  import { useStore } from "utils/store";
  import Defs from "components/Defs.svelte";
  import Node from "components/Node.svelte";
  import Connector from "components/Connector.svelte";

  export let appInstance;
  let tasks,
    UIs = {},
    start,
    end,
    app,
    deleting,
    focused = null,
    el,
    processId;

  let seed = 1;
  // let connector;

  const fakeId = () => `${new Date().getTime()}${seed++}`;
  const connectors = {},
    nodes = {};

  const prep = (data) => {
    let { x, y, type, nexts = [], prevs = [] } = data;

    x = x ? x : 100;
    y = y ? y : 100;

    const radius = type === "start" || type === "end" ? 50 : 5,
      width = type === "start" || type === "end" ? 50 : 100;

    return {
      ...data,
      nexts,
      prevs,
      width,
      height: 50,
      x,
      y,
      tx: 30, //10 offset left
      ty: 30,
      radius,
      text: "",
    };
  };
  const save = async (nodeData) => {
    // console.log({nodeData})
    //boilerplate routines
    if (nodeData.id) {
      tasks.patch(nodeData);
      //   let node = nodes.find( n => n.id == nodeData.id);
      //   if(node){
      //     node = {...node, ...nodeData};
      //   }
      //   nodes.isDirty = true;
      //   cb && cb(null, null, uiData); //added
      // if(uiData.type === 'Path'){
      const connektor = connectors[nodeData.id];
      if (connektor) {
        // path.setState(uiData);
        connektor.update(nodeData);
      }
      return nodeData;
      // }
    } else {
      if (nodeData.type === "start" && start) {
        console.log("Has Start");
        return;
      }
      if (nodeData.type === "end" && end) {
        console.log("Has End");
        return;
      }

      if (nodeData.x < 0 || nodeData.y < 0) return;

      if (nodeData.type === "connector") {
        nodeData.id = fakeId();
        nodeData.app = processId;
        // nodes = [...nodes, nodeData];//.push(nodeData);
        tasks.add(nodeData);
        return nodeData;
        // cb && cb(null, null, uiData);
      } else {
        nodeData = prep(nodeData);
        nodeData.app = processId;
        //added for mock
        nodeData.id = fakeId();
        tasks.add(nodeData);
        // nodes = [...nodes, nodeData];
        // isFocused(nodeData );
        return nodeData;
        //commented real saving here
        // nodes.save(uiData, (e, m, data) => {
        //   if (!e) {
        //     uiData.id = data.id;

        //     isFocused(uiData );
        //   }
        // });
      }
    }
  };

  const update = async (app) => {
    end = start = null;
    app = app;
    processId = app.id;
    tasks = useStore("nodes", { app: processId, nodes: 1 });
    await tasks.sync([]);

    if (app.isNew) {
      save({
        x: 100,
        y: 100,
        type: "start",
        name: "--",
        app: processId,
      });

      save({
        x: 250,
        y: 100,
        type: "function",
        name: "sum",
        app: processId,
      });

      save({
        x: 350,
        y: 100,
        type: "rules",
        name: "sogologobangbose",
        app: processId,
      });

      save({
        x: 550,
        y: 100,
        type: "human",
        name: "collate",
        app: processId,
      });

      save({
        x: 700,
        y: 100,
        type: "end",
        name: "--",
        app: processId,
      });
      delete app.isNew;
    }
    // saveOnDirty();
  };

  const saveOnDirty = (skipScheduling) => {};

  const removeFocus = () => {
    focused &&
      remove(focused, () => {
        focused = null;
        // canvas.setFocus(null);
      });
    deleting = null;
  };
  const registerUI = (taskUi) => {
    if (!taskUi) return;
    UIs[taskUi.id] = taskUi;

    if (taskUi.type === "start") {
      start = 1;
    }

    if (taskUi.type === "end") {
      end = 1;
    }
  };

  const isFocused = (taskData) => {
    if (focused) {
      switch (focused.type) {
        case "function":
        case "rules":
        case "human":
        case "goback":
        case "start":
        case "end":
          //  this.focused.rect.style.fill = 'mediumpurple';
          const { rect } = focused;
          rect && (rect.style.stroke = "none");
          break;
        case "connector":
          const { _path } = focused;
          _path && (_path.style.stroke = "#cccccc");
          _path && (_path.style.strokeDasharray = "none");
          break;
        default:
      }
    }

    focused = taskData;
    // canvas.setFocus(taskData); for properties update should be on AppModule
    if (focused) {
      switch (focused.type) {
        case "function":
        case "rules":
        case "human":
        case "start":
        case "goback":
        case "end":
          const { rect } = focused;
          rect && (rect.style.stroke = "#fff");
          rect && (rect.style.strokeDasharray = "10,10");
          break;
        case "connector":
          const { _path } = focused;
          _path && (_path.style.stroke = "#fff");
          _path && (_path.style.strokeDasharray = "10,10");
          break;
        default:
      }
    }
  };
  const removePath = (taskDatas) => {
    let removeOne = (taskData) => {
      tasks.remove(taskData);
      const { start, end } = taskData;
      start && removeNext(start, taskData);
      end && removePrev(end, taskData);
      // nodes.destroy(taskData.id); for real
    };

    if (_.isArray(taskDatas)) {
      let copy = taskDatas.map((x) => ({ ...x }));
      copy.forEach((n) => {
        removeOne(n);
      });
    } else {
      removeOne(taskDatas);
    }
  };

  const remove = (taskData) => {
    if (taskData.type !== "connector") {
      tasks.remove(taskData);
      let taskUI = UIs[taskData.id];

      if (taskUI) {
        let { nexts, prevs } = taskUI;
        nexts && removePath(nexts);
        prevs && removePath(prevs);

        if (taskData.type === "start") {
          start = 0;
        }
        if (taskData.type === "end") {
          end = 0;
        }
        //   nodes.destroy(taskData.id); //for real;
      }
    } else {
      removePath(taskData);
    }
  };

  const setPrev = (to, taskData) => {
    let taskUI = UIs[to];
    if (taskUI) {
      taskUI.setPrev(taskData);
    }
  };

  const setNext = (to, taskData) => {
    let taskUI = UIs[to];
    if (taskUI) {
      taskUI.setNext(taskData);
    }
  };

  const removeNext = (to, taskData) => {
    let taskUI = UIs[to];
    if (taskUI) {
      taskUI.removeNext(taskData);
    }
  };

  const removePrev = (to, taskData) => {
    let taskUI = UIs[to];
    if (taskUI) {
      taskUI.removePrev(taskData);
    }
  };
  const _keyUp = (e) => {
    if (Keys.isDelete(e)) {
      deleting = focused;
    }
  };
  const deActivateKeys = () => {
    document.removeEventListener("keyup", _keyUp);
  };
  const activateKeys = () => {
    if (el) {
      document.addEventListener("keyup", _keyUp, false);
    }
  };

  const onMove = async (e) => {
    await save(e.detail);
  };
  const onConnect = async (e) => {
    await save(e.detail);

    // console.log('onConnect:',data);
  };
  const onConnecting = async (e) => {
    await save(e.detail);
  };
  const onConnected = async (e) => {
    const data = await save(e.detail);
    // const data = e.detail;
    const { start, targetAt } = data;
    const task = $tasks.data.find(
      (t) =>
        targetAt.x >= t.x &&
        targetAt.x - t.x <= t.width &&
        targetAt.y >= t.y &&
        targetAt.y - t.y <= t.height
    );
    const startNode = nodes[start];
    if (task) {
      const { id: end } = task;
      const endNode = nodes[end];
      // console.log({startNode, endNode})
      if (startNode) {
        startNode.setNext(data);
      }
      if (endNode) {
        endNode.setPrev(data);
      }
      // await save(data);
    } else {
      // data.start = null;
      tasks.remove(data);
      if (startNode) {
        startNode.removeNext(data);
      }
      //  await save(data);
      console.log("no target...");
    }

    // console.log('onConnected:',data);
  };

  onMount(() => {
    activateKeys();
    // console.log('onMount: ', {connectors, nodes});
  });

  $: if (appInstance) {
    // console.log({appInstance})
    update(appInstance);
  }

  // $:{
  //   if(tasks){

  //       console.log('tasks: ', $tasks.data);
  //   }
  // }
</script>

<div class="svgSpace">
  <svg
    class="svgCanvas"
    width="3000"
    height="3000"
    viewBox="0 0 3000 3000"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    bind:this={el}
  >
    <Defs />
    {#if tasks && $tasks.data}
      {#each $tasks.data as data (data.id)}
        {#if data.type !== "connector"}
          <Node
            bind:this={nodes[data.id]}
            {data}
            canvasEl={el}
            {save}
            on:focus={isFocused}
            on:connect={onConnect}
            on:connecting={onConnecting}
            on:connected={onConnected}
            on:move={onMove}
          />
        {:else}
          <Connector bind:this={connectors[data.id]} {data} />
        {/if}
      {/each}
    {/if}
  </svg>
</div>

<style lang="less">
  /*SVGs*/
  .svgSpace {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: left;
    // overflow:auto;
  }
  .svgCanvas {
    background-color: transparent;
    // overflow:hidden;
  }
</style>
