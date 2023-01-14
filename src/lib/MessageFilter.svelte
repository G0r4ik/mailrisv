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

  $: isAllFilterDisabled = Object.values($_filtersOfMessages).every(
    k => k === false
  )
  let isShowFilter = false
  let isShowSort = false

  const changeSortAndLoadMessages = async sort => {
    if ($_sortOfMessages === sort) return
    changeSort(sort)
    changePageOfMessages(1)
    await loadMessages(false)
  }

  const filteredMessages = async filter => {
    if (filter === 'all') {
      clearFilter()
    } else if (filter === 'reset') {
      clearFilter()
      changeSort('newToOld')
    } else {
      setFilter(filter)
    }
    changePageOfMessages(1)
    await setPagesOfMessages()
    await loadMessages(false)
  }

  function showFilterMenu() {
    isShowFilter = !isShowFilter
    isShowSort = false
  }
</script>

<div class="filter-messages">
  <div
    class="filter-messages__select filter-select-control"
    on:click={() => showFilterMenu()}
    on:keypress={e => (e.key === 'Enter' ? showFilterMenu() : '')}
  >
    <div class="filter-select-control__icons">
      {#if $_filtersOfMessages.unread}
        <div class="filter-list__icon">
          <IconStatus isRead={false} />
        </div>
      {/if}
      {#if $_filtersOfMessages.bookmark}
        <div class="filter-list__icon">
          <IconBookmark active={true} />
        </div>
      {/if}
      {#if $_filtersOfMessages.withAttachments}
        <div class="filter-list__icon">
          <IconAttach />
        </div>
      {/if}
    </div>
    <button class="filter-select-control__text">
      {i18n('another', 'headerFilters', $_language)}
    </button>
    <div class="filter-select-control__control">
      <IconSelectControl />
    </div>
  </div>
  {#if isShowFilter}
    <div class="filter-messages__list filter-list">
      <ul class="filter-list__inner">
        <li
          class="filter-list__item"
          class:filter-list__item_checked={isAllFilterDisabled}
          on:click={() => filteredMessages('all')}
          on:keypress={() => filteredMessages('all')}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          {i18n('another', 'allLetters', $_language)}
        </li>
        <li
          class="filter-list__item"
          class:filter-list__item_checked={$_filtersOfMessages.unread}
          on:click={() => filteredMessages('unread')}
          on:keypress={() => filteredMessages('unread')}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          <div class="filter-list__icon">
            <IconStatus isRead={false} />
          </div>

          {i18n('another', 'unread', $_language)}
        </li>
        <li
          class="filter-list__item"
          class:filter-list__item_checked={$_filtersOfMessages.bookmark}
          on:click={() => filteredMessages('bookmark')}
          on:keypress={() => filteredMessages('bookmark')}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          <div class="filter-list__icon">
            <IconBookmark active={true} />
          </div>
          {i18n('another', 'bookmark', $_language)}
        </li>
        <li
          class="filter-list__item"
          class:filter-list__item_checked={$_filtersOfMessages.withAttachments}
          on:click={() => filteredMessages('withAttachments')}
          on:keypress={() => filteredMessages('withAttachments')}
        >
          <div class="filter-list__item-arrow">
            <IconCheck />
          </div>
          <div class="filter-list__icon">
            <IconAttach />
          </div>
          {i18n('another', 'withAttachments', $_language)}
        </li>
      </ul>
      <hr class="filter-list__hr" />
      <div
        class="filter-list__sort filter-sort"
        on:click={() => (isShowSort = !isShowSort)}
        on:keypress={() => (isShowSort = !isShowSort)}
      >
        {i18n('another', 'sort', $_language)}
        {#if isShowSort}
          <ul
            on:click|stopPropagation
            on:keypress|stopPropagation
            class="filter-sort__list"
          >
            <li
              class="filter-sort__item"
              class:filter-sort__item_active={$_sortOfMessages === 'newToOld'}
              on:click={() => changeSortAndLoadMessages('newToOld')}
              on:keypress={() => changeSortAndLoadMessages('newToOld')}
            >
              <div class="filter-sort__item-arrow">
                <IconCheck />
              </div>
              {i18n('_sortOfMessages', 'sortNewToOld', $_language)}
            </li>
            <li
              class="filter-sort__item"
              class:filter-sort__item_active={$_sortOfMessages === 'oldToNew'}
              on:click={() => changeSortAndLoadMessages('oldToNew')}
              on:keypress={() => changeSortAndLoadMessages('oldToNew')}
            >
              <div class="filter-sort__item-arrow">
                <IconCheck />
              </div>
              {i18n('_sortOfMessages', 'sortOldToNew', $_language)}
            </li>

            <li
              class="filter-sort__item"
              class:filter-sort__item_active={$_sortOfMessages ===
                'authorFirstToLast'}
              on:click={() => changeSortAndLoadMessages('authorFirstToLast')}
              on:keypress={() => changeSortAndLoadMessages('authorFirstToLast')}
            >
              <div class="filter-sort__item-arrow">
                <IconCheck />
              </div>
              {i18n('_sortOfMessages', 'sortAuthorFirstToLast', $_language)}
            </li>
            <li
              class="filter-sort__item"
              class:filter-sort__item_active={$_sortOfMessages ===
                'authorLastToFirst'}
              on:click={() => changeSortAndLoadMessages('authorLastToFirst')}
              on:keypress={() => changeSortAndLoadMessages('authorLastToFirst')}
            >
              <div class="filter-sort__item-arrow">
                <IconCheck />
              </div>
              {i18n('_sortOfMessages', 'sortAuthorLastToFirst', $_language)}
            </li>
            <li
              class="filter-sort__item"
              class:filter-sort__item_active={$_sortOfMessages ===
                'titleFirstToLast'}
              on:click={() => changeSortAndLoadMessages('titleFirstToLast')}
              on:keypress={() => changeSortAndLoadMessages('titleFirstToLast')}
            >
              <div class="filter-sort__item-arrow">
                <IconCheck />
              </div>
              {i18n('_sortOfMessages', 'sortTitleFirstToLast', $_language)}
            </li>
            <li
              class="filter-sort__item"
              class:filter-sort__item_active={$_sortOfMessages ===
                'titleLastToFirst'}
              on:click={() => changeSortAndLoadMessages('titleLastToFirst')}
              on:keypress={() => changeSortAndLoadMessages('titleLastToFirst')}
            >
              <div class="filter-sort__item-arrow">
                <IconCheck />
              </div>
              {i18n('_sortOfMessages', 'sortTitleLastToFirst', $_language)}
            </li>
          </ul>
        {/if}
      </div>
      {#if !isAllFilterDisabled}
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
  .filter-messages__select {
    display: flex;
    align-items: center;
  }
  .filter-select-control {
    padding: 6px 18px;
    border-radius: 8px;
    cursor: pointer;
  }
  .filter-select-control:hover,
  .filter-list__item:hover {
    background: var(--color-hover);
  }
  .filter-select-control__icons {
    display: flex;
    align-items: center;
  }
  .filter-list__icon {
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
    /* padding: 18px 24px; */
    padding: 6px 0;
    background: var(--color-popup-bg);
    box-shadow: 0px 4px 32px rgba(0, 16, 61, 0.16);
    border-radius: 12px;
    width: 240px;
  }
  .filter-list_visible {
    display: inline;
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
    margin: 8px 0;
  }
  .filter-sort__list {
    position: absolute;
    z-index: 100;
    left: -165px;
    top: -50px;
    list-style: none;
    background: var(--color-popup-bg);
    box-shadow: 0px 4px 32px rgba(0, 16, 61, 0.16);
    border-radius: 12px;
    padding: 6px 0;
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
