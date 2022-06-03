<script>
	import {onMount} from 'svelte';
	import Process from 'components/Process.svelte';
	let seed = 0;
    let appBody, saving = false, appInstance, applications =[];
	
	const onNewApp = () =>{
		const key = ++seed;
		const id = new Date().getTime();
		const name = `DemoApp${key}`
		const app = {
			name,
			id,
			description:`${name} description`,
			isNew:true
		};
		appInstance = app;
		//applications = [...applications, app];
	}

	onMount(() =>{
		onNewApp();
	})

</script>
<style lang="less">
@Blu:#068;
@Gren:#26A65B;
@Green:#1fbf41;
@Green-dark:darken(@Green, 5);
@Blue:#01aaef;
@Blue-dark:darken(@Blue, 5);
@Asphalt:#29343a;
@Asphalt-dark:darken(@Asphalt, 5);
@Emerald: #16c4bb;
@Emerald-dark:darken(@Emerald, 5);
@Purple:#9b59b6;
@Purple-dark:#8e44ad;
@Orange:#f1c40f;
@Orange-dark:#f39c12;
@Carrot:#e67e22;
@Carrot-dark:#d35400;
@Red:#e74c3c;
@Red-dark:#d62c1a;
@Clouds:#ecf0f1;
@Clouds-dark:#bdc3c7;
@Concrete:#95a5a6;
@Concrete-dark:#7f8c8d;
@white-color:#fff;
@black-color:#000;
@text-color:#333;

:global(*){
	padding:0;
    margin:0;
    box-sizing: border-box;
}
:global(body){
	background-color:@Asphalt-dark;
}

  
  .canvas {
	width: 100vw;
	height: 100vh;
	color:#fff;
	overflow:hidden;
	background-color:@Asphalt-dark;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath opacity='.4' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

 
  
</style>
<div class="canvas">
	<article class="canvas-box">
		<Process {appInstance} />
	</article>
</div>

