<script>
  import AppHeader from './lib/AppHeader.svelte'
  import AppSidebar from './lib/AppSidebar.svelte'
  import AllMessages from './lib/AllMessages.svelte'
  import AppMessage from './lib/AppMessage.svelte'
  import {
    _currentRoute,
    _currentMessage,
    setPagesOfMessages,
    _currentMessages,
    setCurrentFolder,
    handleRouteChange,
    allFolders,
  } from './globalStore'
  import { onMount } from 'svelte'

  onMount(async () => {
    const urlDecode = str =>
      decodeURIComponent((str + '').replace(/\+/g, '%20'))

    const folder = urlDecode(window.location.pathname.split('/')[1])
    if (!allFolders.includes(folder)) {
      window.location.pathname = 'Incoming'
    }
    window.addEventListener('popstate', handleRouteChange)
    handleRouteChange()
    setCurrentFolder(folder)
    await setPagesOfMessages()
  })
</script>

<AppHeader />
<div class="page">
  <AppSidebar />
  <main class="main">
    {$_currentRoute}
    {#if $_currentRoute.includes('message')}
      <AppMessage />
    {:else}
      <AllMessages />
    {/if}
  </main>
</div>

<style>
  .page {
    display: flex;
    gap: var(--unit);
    padding-left: var(--unit);
    padding-right: 6px;
    height: calc(100vh - 56px - var(--unit));
    width: 100vw;
  }
  .main {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--color-main-scroll);
    width: 100%;
  }
  .main::-webkit-scrollbar {
    width: 10px;
  }
  .main::-webkit-scrollbar-track {
    background: transparent;
  }
  .main::-webkit-scrollbar-thumb {
    background-color: var(--color-main-scroll);
    border-radius: 20px;
  }
</style>
