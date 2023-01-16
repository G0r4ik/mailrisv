<script>
  import { getAnotherFolders, getNumberOfMessagesInAllFolders } from '../js/api'
  import { _currentFolder } from '../js/globalStore'
  import { handleRouteChange } from '../js/routing'
  import { i18n, _language } from '../js/language'

  import { onMount } from 'svelte'
  import AppSettings from './AppSettings.svelte'
  import IconImportant from './svg-icons/staticFolders/IconImportant.svelte'
  import IconSent from './svg-icons/staticFolders/IconSent.svelte'
  import IconDrafts from './svg-icons/staticFolders/IconDrafts.svelte'
  import IconArchive from './svg-icons/staticFolders/IconArchive.svelte'
  import IconSpam from './svg-icons/staticFolders/IconSpam.svelte'
  import IconBasket from './svg-icons/staticFolders/IconBasket.svelte'
  import IconIncoming from './svg-icons/staticFolders/IconIncoming.svelte'
  import IconSettings from './svg-icons/IconSettings.svelte'
  import IconBurgerMenu from './svg-icons/IconBurgerMenu.svelte'
  import IconWriteMessage from './svg-icons/IconWriteMessage.svelte'
  import IconNewFolderPlus from './svg-icons/IconNewFolderPlus.svelte'
  import { addEvent, deleteEvent } from '../js/events'

  function showSettings() {
    isOpenSettings = true
    addEvent(closeSettings, {
      node: 'body',
      wrapper: 'showSettings',
      functionOnActions: 'pressEsc',
      eventDOM: 'keydown',
    })
  }

  let numberOfMessageInFolders = []
  getNumberOfMessagesInAllFolders().then(
    res => (numberOfMessageInFolders = res)
  )

  let anotherFolders = null
  let isOpenSettings = false

  onMount(async () => {
    anotherFolders = await getAnotherFolders()
  })

  function serCurrentFolder(folder) {
    window.history.pushState({}, '', `/${folder}`)
    handleRouteChange()
    // setCurrentFolder(folder)
  }
  function showFullSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('sidebar_mobile')
  }
  function closeSettings() {
    isOpenSettings = false
    deleteEvent('body', 'keydown', 'showSettings')
    // document.body.removeEventListener('keydown', pressEsc)
  }
</script>

<aside class="sidebar sidebar_mobile">
  <button class="sidebar__write-message">
    <div class="sidebar__write-message-icon">
      <IconWriteMessage />
    </div>
    <div class="sidebar__write-message-text">
      {i18n('another', 'writemessage', $_language)}
    </div>
  </button>
  <div
    class="sidebar__burger"
    on:click={showFullSidebar}
    on:keypress={showFullSidebar}
  >
    <div class="sidebar__burger-icon">
      <IconBurgerMenu />
    </div>
    <span class="sidebar__burger-text"
      >{i18n('another', 'hide', $_language)}</span
    >
  </div>

  <ul class="sidebar__folders">
    <li
      class="folders__item {$_currentFolder === 'Incoming'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Incoming')}
      on:keypress={() => serCurrentFolder('Incoming')}
    >
      <div class="folders__icon">
        <IconIncoming />
      </div>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Incoming', $_language)}
      </span>
      <span class="folders__item-count">
        {numberOfMessageInFolders['Incoming'] || ''}
      </span>
    </li>
    <li
      class="folders__item {$_currentFolder === 'Important'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Important')}
      on:keypress={() => serCurrentFolder('Important')}
    >
      <div class="folders__icon">
        <IconImportant />
      </div>
      <span class="folders__item-text">
        {i18n('staticFolders', 'Important', $_language)}</span
      >
      <span class="folders__item-count">
        {numberOfMessageInFolders['Important'] || ''}
      </span>
    </li>
    <li
      class="folders__item {$_currentFolder === 'Sent'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Sent')}
      on:keypress={() => serCurrentFolder('Sent')}
    >
      <div class="folders__icon">
        <IconSent />
      </div>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Sent', $_language)}</span
      >
      <span class="folders__item-count">
        {numberOfMessageInFolders['Sent'] || ''}
      </span>
    </li>
    <li
      class="folders__item {$_currentFolder === 'Drafts'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Drafts')}
      on:keypress={() => serCurrentFolder('Drafts')}
    >
      <div class="folders__icon">
        <IconDrafts />
      </div>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Drafts', $_language)}</span
      >
      <span class="folders__item-count">
        {numberOfMessageInFolders['Drafts'] || ''}
      </span>
    </li>
    <li
      class="folders__item {$_currentFolder === 'Archive'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Archive')}
      on:keypress={() => serCurrentFolder('Archive')}
    >
      <div class="folders__icon">
        <IconArchive />
      </div>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Archive', $_language)}</span
      >
      <span class="folders__item-count">
        {numberOfMessageInFolders['Archive'] || ''}
      </span>
    </li>
    <li
      class="folders__item {$_currentFolder === 'Spam'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Spam')}
      on:keypress={() => serCurrentFolder('Spam')}
    >
      <div class="folders__icon">
        <IconSpam />
      </div>

      <span class="folders__item-text"
        >{i18n('staticFolders', 'Spam', $_language)}</span
      >
      <span class="folders__item-count">
        {numberOfMessageInFolders['Spam'] || ''}
      </span>
    </li>
    <li
      class="folders__item {$_currentFolder === 'Basket'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Basket')}
      on:keypress={() => serCurrentFolder('Basket')}
    >
      <div class="folders__icon">
        <IconBasket />
      </div>

      <span class="folders__item-text"
        >{i18n('staticFolders', 'Basket', $_language)}</span
      >
      <span class="folders__item-count">
        {numberOfMessageInFolders['Basket'] || ''}
      </span>
    </li>
  </ul>
  <hr class="sidebar__hr" />
  <div class="sidebar__users-folder user-folders">
    {#if anotherFolders}
      {#each anotherFolders as folder (folder)}
        <div
          class="user-folders__item {$_currentFolder === folder
            ? 'folders__item_active'
            : ''}"
          on:click={() => serCurrentFolder(folder)}
          on:keypress={() => serCurrentFolder(folder)}
        >
          <span class="user-folders__item-text">
            {folder}
          </span>
          <span class="folders__item-count">
            {numberOfMessageInFolders[folder] || ''}
          </span>
        </div>
      {/each}
    {/if}
  </div>
  <button class="sidebar__new-folder">
    <IconNewFolderPlus />
    {i18n('another', 'newFolder', $_language)}
  </button>
  <button class="sidebar__settings" on:click={showSettings}>
    <IconSettings />
    <span class="sidebar__settings-text">
      {i18n('another', 'sidebarSettings', $_language)}
    </span>
  </button>
  <AppSettings on:closeSettings={closeSettings} {isOpenSettings} />
</aside>

<style>
  .sidebar {
    width: 200px;
    min-width: 200px;
    color: var(--color-sidebar-text);
    margin-bottom: 50px;
    overflow-y: auto;
  }
  .sidebar__write-message {
    margin: 0 auto;
    height: 36px;
    border-radius: 8px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    margin-bottom: var(--unit);
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
  .sidebar__write-message-icon {
    display: none;
  }
  .sidebar__write-message-text {
    color: #333;
    padding: 8px 0;
    font-weight: 700;
    font-size: var(--text-middle);
    line-height: 20px;
  }
  .sidebar__burger {
    display: none;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    margin-bottom: 10px;
    align-items: center;
    padding: 8px var(--unit);
  }
  .sidebar__burger-icon {
    /* display: block; */
  }
  .sidebar__burger-text {
    margin-left: 8px;
    display: none;
  }
  .sidebar__folders {
  }
  .folders__item {
  }
  .folders__item_active {
    font-weight: 700;
    background: var(--color-active-folder);
  }
  .folders__icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .folders__item-text {
    margin-left: 10px;
  }
  .folders__item-count {
    margin-left: auto;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
  }
  .sidebar__hr {
    background: var(--color-hr);
    margin: 8px 0;
    border: none;
    height: 1px;
  }
  .sidebar__users-folder {
  }
  .user-folders {
    margin-bottom: var(--unit);
  }
  .user-folders__item {
  }
  .folder {
  }
  .user-folders__item-text {
  }
  .sidebar__new-folder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px var(--unit);
  }
  .sidebar__settings {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: var(--unit);
    padding: 8px var(--unit);
  }
  .sidebar__settings-text {
    margin-left: 8px;
  }

  .folders__item,
  .user-folders__item {
    padding: 8px var(--unit);
    cursor: pointer;
    list-style: none;
    width: 100%;
    font-size: var(--text-middle);
    line-height: 20px;
    display: flex;
    align-items: center;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-radius: 8px;
  }
  .folders__item:hover,
  .user-folders__item:hover {
    background: var(--color-hover);
  }
  .sidebar__write-message svg {
    display: none;
  }

  @media (max-width: 1366px) {
    .sidebar_mobile {
      width: 45px;
      min-width: 45px;
    }

    .sidebar_mobile .sidebar__write-message-icon {
      display: block;
    }
    .folders__item,
    .user-folders__item {
      position: relative;
    }
    .sidebar_mobile .sidebar__write-message-text {
      display: none;
    }
    .sidebar_mobile .sidebar__write-message {
      width: auto;
      padding: 10px;
    }
    .sidebar_mobile .folders__item-text {
      display: none;
    }
    .sidebar__burger {
      display: block;
    }
    .sidebar_mobile .sidebar__settings-text {
      display: none;
    }
    .sidebar_mobile .sidebar__new-folder {
      display: none;
    }
    .sidebar_mobile .folders__item-count {
      position: absolute;
      font-size: 10px;
      top: 0;
      right: 0;
    }
  }
</style>
