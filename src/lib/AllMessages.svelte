<script>
  import EmptyMessages from './EmptyMessages.svelte'
  import { onMount } from 'svelte'

  import {
    _currentFolder,
    loadMessages,
    changePageOfMessages,
    _pageOfMessages,
    _currentMessages,
    _numberOfMessagesReceived,
    _numberOfMessagesInCurrentFolder,
  } from '../js/globalStore'

  import { i18n, _language } from '../js/language'
  import {
    _filtersOfMessages,
    _sortOfMessages,
  } from '../js/filterAndSortMessages'
  import MessageItem from './MessageItem.svelte'
  import { addEvent } from '../js/events'

  $: maxPages = Math.ceil(
    $_numberOfMessagesInCurrentFolder / $_numberOfMessagesReceived
  )

  onMount(async () => {
    addEvent(resize, {
      isThrottle: true,
      node: '.main',
      wrapper: 'scrollMessages',
      functionOnActions: 'scroll',
      eventDOM: 'scroll',
    })
    // addEvent(resize, {
    //   isThrottle: true,
    //   node: '.main',
    //   wrapper: 'resizeWindow',
    //   functionOnActions: 'resize',
    //   eventDOM: 'resize',
    // })
  })

  async function resize(isButtonClick = false) {
    if (maxPages <= $_pageOfMessages || !$_currentMessages.length) return

    const main = document.querySelector('.main')
    if (main.scrollTop >= main.scrollHeight - 1500 || isButtonClick) {
      console.log('load')
      changePageOfMessages($_pageOfMessages + 1)
      await loadMessages(false)
    }
  }
</script>

<div class="messages" id="id1">
  {#if $_currentMessages.length}
    {#each $_currentMessages as message (message.id)}
      <MessageItem {message} />
    {/each}
  {/if}
</div>
{#if $_pageOfMessages < maxPages}
  <button class="messages__load-more" on:click={e => resize(true)}>
    {i18n('another', 'showMore', $_language)}
  </button>
{/if}
{#if !$_currentMessages.length}
  <EmptyMessages />
{/if}

<style>
  .messages {
    background: var(--color-accent-bg);
    border-radius: 12px;
  }
  .messages__load-more {
    margin-top: 6px;
    background: var(--color-accent-bg);
    border-radius: 12px;
    padding: 5px 10px;
    color: color(--color-text);
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
