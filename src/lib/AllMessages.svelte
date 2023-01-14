<script>
  import PopupAttach from './PopupAttach.svelte'
  import IconBookmark from './svg-icons/IconBookmark.svelte'
  import IconImportant from './svg-icons/IconImportant.svelte'
  import IconAttach from './svg-icons/IconAttach.svelte'
  import IconStatus from './svg-icons/IconStatus.svelte'
  import { getNumberOfMessagesInFolder, getMessageImageById } from '../api.js'
  import { onMount } from 'svelte'

  import {
    setCurrentMessage,
    i18n,
    _currentFolder,
    _filtersOfMessages,
    loadMessages,
    changePageOfMessages,
    _pageOfMessages,
    _currentMessages,
    _language,
    _numberOfMessagesReceived,
    getAttach,
    setPagesOfMessages,
    _pagesOfMessages,
  } from '../globalStore'

  let page = 1
  let visibleMessage = null
  let currentAttaches = null
  let throttledResize = null
  let firstCountOfLoadImages = null

  $: maxPages = Math.ceil($_pagesOfMessages / $_numberOfMessagesReceived)

  onMount(async () => {
    throttledResize = throttle(resize, 1000)
    const main = document.querySelector('.main')
    main.addEventListener('scroll', throttledResize)
    window.addEventListener('resize', throttledResize)
    await setPagesOfMessages()
    await loadMessages(false)
  })

  function changeStatus(message) {
    message.read = !message.read
  }
  function changeImportant(message) {
    message.important = !message.important
  }
  function changeMark(message) {
    message.bookmark = !message.bookmark
  }
  function closeCurrentMessage() {
    visibleMessage = null
  }
  function throttle(callee, timeout) {
    let timer = null
    return (...args) => {
      if (timer) return
      timer = setTimeout(() => {
        callee(...args)
        clearTimeout(timer)
        timer = null
      }, timeout)
    }
  }
  async function resize(e, isButtonClick = false) {
    if (maxPages <= $_pageOfMessages || !$_currentMessages.length) return

    const main = document.querySelector('.main')
    if (main.scrollTop >= main.scrollHeight - 1500 || isButtonClick) {
      console.log('load')
      changePageOfMessages($_pageOfMessages + 1)
      await loadMessages(true)
    }
  }
  function getFlagIcon(flag) {
    return new URL(`../assets/${flag}.svg`, import.meta.url).href
  }
  async function goToMessage(message) {
    const main = document.querySelector('.main')
    main.removeEventListener('scroll', throttledResize)
    window.removeEventListener('resize', throttledResize)
    await setCurrentMessage(message)
  }
  function timeMessage(date) {
    const mounth = [
      i18n('months', 'January', $_language),
      i18n('months', 'February', $_language),
      i18n('months', 'March', $_language),
      i18n('months', 'April', $_language),
      i18n('months', 'May', $_language),
      i18n('months', 'June', $_language),
      i18n('months', 'July', $_language),
      i18n('months', 'August', $_language),
      i18n('months', 'September', $_language),
      i18n('months', 'October', $_language),
      i18n('months', 'November', $_language),
      i18n('months', 'December', $_language),
    ]
    const now = new Date()
    const dateMessage = new Date(date)
    const diffYear = dateMessage.getFullYear() !== now.getFullYear()
    if (diffYear) {
      const day = String(dateMessage.getDate()).padStart(2, '0')
      const mounth = String(dateMessage.getMonth() + 1).padStart(2, '0')
      const year = String(dateMessage.getFullYear()).slice(2)

      return `${day}.${mounth}.${year}`
    }
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const diff = +start - +dateMessage
    if (diff <= 0) return i18n('another', 'today', $_language)
    if (diff <= 1000 * 60 * 60 * 24) i18n('another', 'yesterday', $_language)

    return dateMessage.getDate() + ' ' + mounth[dateMessage.getMonth()]
  }
  async function showAttach(message) {
    currentAttaches = message
    if (message.isDocLoad) return
    message.isDocLoad = true
    for (let i = 0; i < message.imagesCount; i++) {
      const img = await getMessageImageById(message.id, i)
      await getAttach(message, img)
    }
  }

  function closePopup() {
    currentAttaches = null
  }
</script>

<div class="messages" id="id1">
  {maxPages}
  {#if $_currentMessages.length}
    {#each $_currentMessages as message (message.id)}
      <div
        class="messages__item message"
        on:click={() => goToMessage(message)}
        on:keypress={() => goToMessage(message)}
      >
        <div
          class="message__status-wrapper"
          on:click|preventDefault
          on:keypress|preventDefault
        >
          <IconStatus
            on:keypress={() => changeStatus(message)}
            on:click={() => changeStatus(message)}
            isRead={message.read}
          />
        </div>
        <div class="message__user">
          {#if message.author.avatar}
            <img
              class="message__user-img"
              src={message.author.avatar}
              alt="logo"
            />
          {:else}
            <div class="message__user-img message__user-img_word">
              {message.author.surname[0]}
            </div>
          {/if}
          <span
            class:message__user-name_bold={!message.read}
            class="message__user-name"
          >
            {message.author.name}
            {message.author.surname}
          </span>
        </div>
        {#if message.important}
          <div
            class="message__important"
            on:click|stopPropagation={() => changeImportant(message)}
            on:keypress|stopPropagation={() => changeImportant(message)}
          >
            <IconImportant />
          </div>
        {/if}
        {#if !message.important}
          <div
            class:message__mark_active={message.bookmark}
            class="message__mark"
            on:click|stopPropagation={() => changeMark(message)}
            on:keypress|stopPropagation={() => changeMark(message)}
          >
            <IconBookmark active={message.bookmark} />
          </div>
        {/if}

        <div class="message__text-wrapper">
          <span
            class:message__user-name_bold={!message.read}
            class="message__title">{message.title}</span
          >
          <span class="message__text">{message.text} </span>
        </div>
        {#if message.flag}
          <img
            src={getFlagIcon(message.flag)}
            class="messages__flag"
            width="24"
            height="24"
            alt=""
          />
        {/if}
        {#if message.doc}
          <div
            class="messages__has-attach"
            on:click|stopPropagation={() => showAttach(message)}
            on:keypress|stopPropagation={() => showAttach(message)}
          >
            <IconAttach />
          </div>
        {/if}
        <span class="time">{timeMessage(message.date)}</span>
        {#if currentAttaches && currentAttaches === message}
          <PopupAttach
            on:closePopup={closePopup}
            attaches={message.doc.img}
            idOfMessage={message.id}
          />
        {/if}
      </div>
    {/each}
  {/if}
</div>
{#if $_pageOfMessages < maxPages && $_currentMessages}
  <button class="messages__load-more" on:click={e => resize(e, true)}>
    {i18n('another', 'showMore', $_language)}
  </button>
{/if}

<style>
  .messages {
    background: var(--color-accent-bg);
    border-radius: 12px;
  }
  .message:hover {
    background: var(--color-hover);
    border-radius: var(--border-radius-main);
  }
  :global(.message:hover .message__status) {
    visibility: visible;
  }
  :global(.message:hover .message__mark) {
    visibility: visible;
  }
  .messages__item {
    padding: 0 var(--unit);
    display: flex;
    align-items: center;
    height: 48px;
    position: relative;
  }
  .messages__item:not(:last-child) {
    border-bottom: 1px solid var(--color-border-bottom-message);
  }
  :global(.message__status-wrapper) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    margin-right: var(--unit);
    cursor: pointer;
  }

  .message__status-wrapper {
  }
  .message__status-wrapper:hover {
    cursor: pointer;
  }

  :global(.message__status_not-read) {
    visibility: visible;
    background: var(--color-primary);
  }
  .message__user {
    display: flex;
    align-items: center;
    width: 216px;
  }
  .message__user-img {
    margin-right: var(--unit);
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    border-radius: 50%;
  }
  .message__user-img_word {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    background: #d3b3ff;
    color: #874dd6;
  }
  .message__user-name {
    font-weight: 400;
    font-size: var(--text-middle);
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 450px;
  }
  .message__user-name_bold {
    font-weight: 700;
  }
  .message__important {
    text-align: center;
  }
  .message__important,
  .message__mark {
    width: 32px;
    margin: 0 var(--unit);
    cursor: pointer;
  }
  :global(.message__mark) {
    visibility: hidden;
  }
  :global(.message__mark_active) {
    visibility: visible;
  }
  .messages__flag {
    margin-left: 6px;
  }
  .messages__has-attach {
    cursor: pointer;
  }
  .message__text-wrapper {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
  .message__title_bold {
    font-weight: 700;
  }
  .message__title ~ .message__text {
    margin-left: var(--unit);
  }
  .message__text {
    color: var(--color-gray);
  }
  .time {
    color: var(--color-gray);
    white-space: nowrap;
    font-weight: 400;
    min-width: 51px;
    margin-left: 6px;
    font-size: var(--text-small);
    line-height: 20px;
    text-align: right;
  }
  .messages__load-more {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .message-not-found {
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  @media (max-width: 767px) {
    .message__user-name,
    .message__title,
    .message__text-wrapper {
      font-size: var(--text-small);
    }
    .message__text-wrapper {
      flex-direction: column;
      white-space: normal;
      height: 44px;
    }
    .message__user {
      order: -2;
      display: inline;
      width: auto;
    }
    .time {
      position: absolute;
      top: var(--unit);
      right: var(--unit);
      font-size: var(--text-extra-small);
      min-width: 38px;
      order: -1;
      display: inline;
      width: auto;
    }
    .message__mark,
    .messages__flag,
    .messages__has-attach,
    .message__status,
    .message__user-img {
      display: none;
    }
    .messages__item {
      padding: 6px;
      flex-direction: column;
      height: auto;
      align-items: flex-start;
      position: relative;
    }
    .message__user-name {
      white-space: normal;
    }
  }
</style>
