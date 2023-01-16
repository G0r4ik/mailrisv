<script>
  export let message
  import PopupAttach from './PopupAttach.svelte'
  import IconBookmark from './svg-icons/IconBookmark.svelte'
  import IconImportant from './svg-icons/IconImportant.svelte'
  import IconAttach from './svg-icons/IconAttach.svelte'
  import IconStatus from './svg-icons/IconStatus.svelte'
  import UserAvatar from './UserAvatar.svelte'

  import {
    setCurrentMessage,
    _currentFolder,
    loadMessages,
    changePageOfMessages,
    _pageOfMessages,
    _currentMessages,
    _numberOfMessagesReceived,
    _numberOfMessagesInCurrentFolder,
    getImages,
  } from '../js/globalStore'

  import { handleRouteChange } from '../js/routing'
  import { i18n, _language } from '../js/language'
  import {
    _filtersOfMessages,
    _sortOfMessages,
  } from '../js/filterAndSortMessages'
  import { deleteEvent } from '../js/events'

  let currentAttaches = null
  function changeStatus(message) {
    message.read = !message.read
  }
  function changeImportant(message) {
    message.important = !message.important
  }
  function changeMark(message) {
    message.bookmark = !message.bookmark
  }

  function getFlagIcon(flag) {
    return new URL(`../assets/${flag}.svg`, import.meta.url).href
  }
  async function goToMessage(message) {
    await setCurrentMessage(message)
    // const node = document.body.querySelector('.main')
    deleteEvent('.main', 'scroll', 'scrollMessages')
    window.history.pushState({}, '', `${$_currentFolder}/message-${message.id}`)
    handleRouteChange()
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
    await getImages(message)
    message.isDocLoad = true
  }

  let selectedMessages = {}

  function closePopup() {
    currentAttaches = null
  }

  function showSelect(event) {
    event.target.classList.add('messages__item_select')
  }
  function closeSelect(event) {
    event.target.classList.remove('messages__item_select')
  }

  function handleSelect(id) {
    selectedMessages = { ...selectedMessages, [id]: true }
    const messageNode = document.querySelector(`#message${id}`)
    messageNode.classList.toggle('messages__item_select-static')
  }
</script>

<div
  id={`message${message.id}`}
  class="messages__item message"
  class:messages__item_select={selectedMessages[message.id]}
  on:click={() => goToMessage(message)}
  on:keypress={() => goToMessage(message)}
  on:mouseenter={event => showSelect(event)}
  on:mouseleave={event => closeSelect(event)}
>
  <div
    class="message__status-wrapper"
    on:click|stopPropagation
    on:keypress|stopPropagation
  >
    <IconStatus
      on:keypress={() => changeStatus(message)}
      on:click={() => changeStatus(message)}
      isRead={message.read}
    />
  </div>
  <div class="message__user ">
    <div class="message__user-img">
      {#if message.author.avatar}
        <img src={message.author.avatar} alt="logo" />
      {:else}
        <UserAvatar firstChar={message.author.surname[0]} />
      {/if}
    </div>
    <div
      class="messages__item-select checkbox"
      on:click|stopPropagation
      on:keypress|stopPropagation
    >
      <input
        class="checkbox-input"
        on:click|stopPropagation
        on:change={() => handleSelect(message.id)}
        type="checkbox"
        name="message"
        id={message.id}
      />
      <label for={message.id} class="checkmark" />
    </div>
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
    <span class:message__user-name_bold={!message.read} class="message__title"
      >{message.title}</span
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
      {message}
      idOfMessage={message.id}
    />
  {/if}
</div>

<style>
  .message:hover {
    background: var(--color-hover);
    border-radius: var(--border-radius-main);
  }

  .message:hover .message__status {
    visibility: visible;
  }
  .message:hover .message__mark {
    visibility: visible;
  }
  .messages__item {
    cursor: pointer;
    padding: 0 var(--unit);
    display: flex;
    align-items: center;
    height: 48px;
    position: relative;
  }
  .messages__item:not(:last-child) {
    border-bottom: 1px solid var(--color-border-bottom-message);
  }

  :global(.messages__item_select),
  :global(.messages__item_select:hover),
  :global(.messages__item_select-static) {
    background: var(--color-hover) !important;
  }
  :global(.messages__item_select .message__user-img),
  :global(.messages__item_select-static .message__user-img) {
    transform: scale(0.1);
    transition: 0.1s;
  }
  .messages__item-select {
    cursor: pointer;
    position: absolute;
    left: 47px;
    opacity: 0;
    width: 100%;
    margin-right: var(--unit);
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    border-radius: 50%;
  }

  .checkmark {
    cursor: pointer;

    background-color: white;
    width: 16px;
    height: 16px;
    display: inline-block;
    position: relative;
    border: 1px solid rgba(0, 16, 61, 0.12);
    border-radius: 4px;
  }
  .checkmark::before {
    content: '';
    position: absolute;
    display: none;
  }
  .checkbox-input {
    display: none;
  }
  .checkbox-input:checked + .checkmark {
    background-color: #005ff9;
  }

  .checkbox-input:checked + .checkmark::before {
    display: block;
    content: url("data:image/svg+xml,<svg width='24' height='17' viewBox='0 0 24 17' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M23 1C22 1.49012e-08 20.5 1.49012e-08 19.5 1L9.5 11L4.5 6C3.5 5 2 5 1 6C1.49012e-08 7 1.49012e-08 8.5 1 9.5L7.75 16.25C8.25 16.75 8.75 17 9.5 17C10.25 17 10.75 16.75 11.25 16.25L23 4.5C24 3.5 24 2 23 1V1V1Z' fill='white'/></svg>");
    color: white;
    text-align: center;
    position: absolute;
    left: -2px;
    top: 0;
    transform: scale(0.5);
    width: 100%;
    height: 100%;
  }

  :global(.messages__item_select .messages__item-select),
  :global(.messages__item_select-static .messages__item-select) {
    opacity: 1 !important;
    transition: 0.4s;
  }

  .message__status-wrapper {
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

  .message__status_not-read {
    visibility: visible;
    background: var(--color-primary);
  }
  .message__user {
    display: flex;
    align-items: center;
    width: 216px;
  }
  .message__user-img img {
    width: 100%;
    border-radius: 50%;
  }
  .message__user-img {
    margin-right: var(--unit);
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    border-radius: 50%;
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
  .message__mark {
    visibility: hidden;
  }
  .message__mark_active {
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

  .message-not-found {
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  /* @media (max-width: 767px) {
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
  } */
</style>
