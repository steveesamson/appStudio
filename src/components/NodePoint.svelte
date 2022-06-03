<script>
    export let width, type, nodeInput, nodeOutput
</script>
{#if type && width}
        {#if type === "goback"}
          <circle
            stroke="orange"
            stroke-width={3}
            fill="#333"
            cx={width + 10}
            cy="27"
            r={5}
            class="process-input"
            bind:this={nodeInput}
          />
          <circle
            stroke="lime"
            stroke-width={3}
            fill="#333"
            cx="10"
            cy="27"
            r={5}
            class="process-output"
            bind:this={nodeOutput}
          />
        {:else}
            {#if type !== 'start'}
            <circle
                stroke="orange"
                stroke-width={3}
                fill="#333"
                cx="10"
                cy="27"
                r={5}
                class="process-input"
                bind:this={nodeInput}
            />
            {/if}
            {#if type !== "end"}
            <circle
                stroke="lime"
                stroke-width={3}
                fill="#333"
                cx={width + 10}
                cy="27"
                r={5}
                class="process-output"
                bind:this={nodeOutput}
            />
            {/if}
        {/if}
{/if}