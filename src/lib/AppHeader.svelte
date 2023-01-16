<script>
  import logo from '../assets/logo.svg'
  import IconGoBack from './svg-icons/IconGoBack.svelte'
  import MessageFilter from './MessageFilter.svelte'
  import {
    _currentMessage,
    setCurrentMessage,
    _currentFolder,
  } from '../js/globalStore'
  import { i18n, _language } from '../js/language'

  import { handleRouteChange, _currentRoute } from '../js/routing'
  const goBack = () => {
    window.history.pushState({}, '', `/${$_currentFolder}`)
    handleRouteChange()
    setCurrentMessage(null)
  }
</script>

<header class="header">
  {#if !$_currentRoute.includes('message')}
    <img src={logo} alt="logo" />
  {:else}
    <div
      class="header__go-back"
      on:click={goBack}
      on:keypress={event => (event.key === 'Enter' ? goBack() : '')}
    >
      <IconGoBack />
      {i18n('another', 'goBack', $_language)}
    </div>
  {/if}
  <MessageFilter />
</header>

<style>
  .header {
    position: relative;
    z-index: 10;
    width: 100vw;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 12px;
    margin-bottom: var(--unit);
    background: var(--color-header-background);
    color: var(--color-header-text);
    filter: drop-shadow(0 0 16px rgb(2 13 41 / 0.12));
  }
  .header__go-back {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
</style>
