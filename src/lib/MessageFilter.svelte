<script>
  import IconBookmark from './svg-icons/IconBookmark.svelte'
  import IconAttach from './svg-icons/IconAttach.svelte'
  import IconStatus from './svg-icons/IconStatus.svelte'
  import IconCheck from './svg-icons/IconCheck.svelte'
  import IconSelectControl from './svg-icons/IconSelectControl.svelte'
  import {
    i18n,
    _filtersOfMessages,
    _sortOfMessages,
    clearFilter,
    setFilter,
    changeSort,
    changePageOfMessages,
    loadMessages,
    _language,
    _currentFolder,
    setPagesOfMessages,
  } from '../globalStore'

  const sortText = [
    'newToOld',
    'oldToNew',
    'authorFirstToLast',
    'authorLastToFirst',
    'titleFirstToLast',
    'titleLastToFirst',
  ]

  $: isAllFilterDisabled = Object.values($_filtersOfMessages).every(
    k => k === false
  )
  $: isAllFilterAndSortDisabled =
    isAllFilterDisabled && $_sortOfMessages === 'newToOld'

  let isShowFilterMenu = false
  let isShowSortMenu = false

  const changeSortAndLoadMessages = async sort => {
    if ($_sortOfMessages === sort) return
    changeSort(sort)
    changePageOfMessages(1)
    await loadMessages(false)
  }

  const filteredMessages = async filter => {
    if (filter === 'all') {
      clearFilter()
      if (isAllFilterDisabled) return
    } else if (filter === 'reset') {
      clearFilter()
      changeSort('newToOld')
      isShowSortMenu = false
    } else {
      setFilter(filter)
    }
    changePageOfMessages(1)
    await setPagesOfMessages()
    await loadMessages(false)
  }

  function closeFilterPopup() {
    isShowFilterMenu = false
    document.body.removeEventListener('click', clickOutside)
    document.body.removeEventListener('keydown', pressEsc)
  }

  let clickOutside = event => {
    const filterNode = document.querySelector('.filter-messages')
    if (!filterNode.contains(event.target)) closeFilterPopup()
  }
  let pressEsc = event => {
    if (event.key === 'Escape') closeFilterPopup()
  }

  function showFilterMenu() {
    isShowFilterMenu = !isShowFilterMenu
    isShowSortMenu = false
    document.body.addEventListener('click', clickOutside)
    document.body.addEventListener('keydown', pressEsc)
  }

  function showSortMenu() {
    isShowSortMenu = !isShowSortMenu
  }

  function getNameOfLocale(sort) {
    return `sort${sort[0].toUpperCase()}${sort.slice(1)}`
  }
</script>

<div class="filter-messages">
  <div
    class="filter-messages__select filter-select-control"
    on:click={event => showFilterMenu()}
    on:keypress={e => (e.key === 'Enter' ? showFilterMenu() : '')}
  >
    <div class="filter-select-control__icons">
      {#if $_filtersOfMessages.unread}
        <div class="filter-select-control__icon">
          <IconStatus isRead={false} />
        </div>
      {/if}
      {#if $_filtersOfMessages.bookmark}
        <div class="filter-select-control__icon">
          <IconBookmark active={true} />
        </div>
      {/if}
      {#if $_filtersOfMessages.withAttachments}
        <div class="filter-select-control__icon">
          <IconAttach />
        </div>
      {/if}
    </div>
    <span class="filter-select-control__text">
      {#if $_sortOfMessages !== 'newToOld'}
        {i18n('sortOfMessages', getNameOfLocale($_sortOfMessages), $_language)}
      {:else if $_filtersOfMessages.bookmark && !$_filtersOfMessages.unread && !$_filtersOfMessages.withAttachments}
        {i18n('another', 'bookmark', $_language)}
      {:else if $_filtersOfMessages.unread && !$_filtersOfMessages.bookmark && !$_filtersOfMessages.withAttachments}
        {i18n('another', 'unread', $_language)}
      {:else if $_filtersOfMessages.withAttachments && !$_filtersOfMessages.bookmark && !$_filtersOfMessages.unread}
        {i18n('another', 'withAttachments', $_language)}
      {:else if isAllFilterAndSortDisabled}
        {i18n('another', 'headerFilter', $_language)}
      {:else}
        {i18n('another', 'headerFilters', $_language)}
      {/if}
    </span>
    <div class="filter-select-control__control">
      <IconSelectControl />
    </div>
  </div>
  {#if isShowFilterMenu}
    <div class="filter-messages__list filter-list">
      <ul class="filter-list__inner">
        <li
          class="filter-list__item"
          class:filter-list__item_checked={isAllFilterDisabled}
          on:click={() => filteredMessages('all')}
          on:keypress={e => (e.key === 'Enter' ? filteredMessages('all') : '')}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          {i18n('another', 'allmessages', $_language)}
        </li>
        <li
          class="filter-list__item"
          class:filter-list__item_checked={$_filtersOfMessages.unread}
          on:click={() => filteredMessages('unread')}
          on:keypress={e =>
            e.key === 'Enter' ? filteredMessages('unread') : ''}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          <div class="filter-select-control__icon">
            <IconStatus isRead={false} />
          </div>
          {i18n('another', 'unread', $_language)}
        </li>
        <li
          class="filter-list__item"
          class:filter-list__item_checked={$_filtersOfMessages.bookmark}
          on:click={() => filteredMessages('bookmark')}
          on:keypress={e =>
            e.key === 'Enter' ? filteredMessages('bookmark') : ''}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          <div class="filter-select-control__icon">
            <IconBookmark active={true} />
          </div>
          {i18n('another', 'bookmark', $_language)}
        </li>
        <li
          class="filter-list__item"
          class:filter-list__item_checked={$_filtersOfMessages.withAttachments}
          on:click={() => filteredMessages('withAttachments')}
          on:keypress={e =>
            e.key === 'Enter' ? filteredMessages('withAttachments') : ''}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          <div class="filter-select-control__icon">
            <IconAttach />
          </div>
          {i18n('another', 'withAttachments', $_language)}
        </li>
      </ul>
      <hr class="filter-list__hr" />
      <div
        class="filter-list__sort filter-sort"
        on:click={() => showSortMenu()}
        on:keypress={e => (e.key === 'Enter' ? showSortMenu() : '')}
      >
        {i18n('another', 'sort', $_language)}
        {#if isShowSortMenu}
          <ul
            on:click|stopPropagation
            on:keypress|stopPropagation
            class="filter-sort__list"
          >
            {#each sortText as sort}
              <li
                class="filter-sort__item"
                class:filter-sort__item_active={$_sortOfMessages === sort}
                on:click={() => changeSortAndLoadMessages(sort)}
                on:keypress={() => changeSortAndLoadMessages(sort)}
              >
                <div class="filter-sort__item-arrow">
                  <IconCheck />
                </div>
                {i18n('sortOfMessages', getNameOfLocale(sort), $_language)}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      {#if !isAllFilterAndSortDisabled}
        <hr class="filter-list__hr" />
        <button
          class="filter-list__reset"
          on:click={() => filteredMessages('reset')}
        >
          {i18n('another', 'resetEverything', $_language)}
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .filter-select-control {
    display: flex;
    align-items: center;
    padding: 6px 18px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
  }
  .filter-select-control:hover,
  .filter-list__item:hover {
    background: var(--color-hover);
    transition: 0.3s;
  }
  .filter-select-control__icons {
    display: flex;
    align-items: center;
  }
  .filter-select-control__icon {
    min-width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }
  .filter-select-control__text {
    margin-right: var(--unit);
  }
  .filter-list {
    position: fixed;
    right: var(--unit);
    width: 240px;
  }
  .filter-list,
  .filter-sort__list {
    padding: 6px 0;
    background: var(--color-popup-bg);
    color: var(--color-text);
    box-shadow: 0px 4px 32px rgba(0, 16, 61, 0.16);
    border-radius: 12px;
  }
  .filter-list_visible {
    display: block;
  }
  .filter-list__inner {
    list-style: none;
  }
  .filter-list__item,
  .filter-list__sort,
  .filter-sort__item,
  .filter-list__reset {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
    transition: 0.3s;
  }
  .filter-list__sort,
  .filter-list__reset {
    padding-left: 24px;
  }
  .filter-sort__item:hover,
  .filter-list__sort:hover,
  .filter-list__reset:hover {
    background: var(--color-hover);
    transition: 0.3s;
  }
  .filter-list__item-arrow,
  .filter-sort__item-arrow {
    opacity: 0;
    padding: 0 8px;
  }
  .filter-list__item_checked .filter-list__item-arrow,
  .filter-sort__item_active .filter-sort__item-arrow {
    opacity: 1;
  }
  .filter-list__hr {
    border-color: var(--color-border-bottom-message);
    transform: scaleY(0.5);
    margin: 8px 0;
  }
  .filter-sort__list {
    position: absolute;
    z-index: 100;
    left: -165px;
    top: -50px;
    list-style: none;
  }
  .filter-sort__list_visible {
    display: block;
  }
  .filter-sort__item {
    padding: 8px 24px 8px 0;
  }
  .filter-sort__item-arrow {
  }
  .filter-list__reset {
    width: 100%;
  }

  /*  */
</style>
