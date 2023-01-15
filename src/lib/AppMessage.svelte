<script>
  import { getMessageImageById } from '../api'
  import IconBookmark from './svg-icons/IconBookmark.svelte'
  import IconImportant from './svg-icons/IconImportant.svelte'
  import UserAvatar from './UserAvatar.svelte'
  import {
    setCurrentMessage,
    i18n,
    _currentMessage,
    _language,
  } from '../globalStore'
  import { onMount } from 'svelte'

  let allRecipients = []
  let defaultMaxRecipients = 4
  let imagesCount = null
  let isVisibleAllRecipients
  $: isVisibleAllRecipients = $_currentMessage.to.length > defaultMaxRecipients

  $: recipients = $_currentMessage.to
    .map(user => `${user.name} ${user.surname}`)
    .slice(0, defaultMaxRecipients)
    .join(', ')

  function notVisibleRecipients() {
    const recipients = $_currentMessage.to.length - defaultMaxRecipients
    if ($_language === 'en') {
      if (recipients === 1) {
        return `${recipients} recipient`
      } else {
        return `${recipients} recipients`
      }
    }
    if (recipients === 1) return `${recipients} получатель`
    if ([2, 3, 4].includes(recipients)) return `${recipients} получателя`
    return `${recipients} получателей`
  }

  onMount(async () => {
    if ($_currentMessage.doc) {
      for (let i = 0; i < $_currentMessage.imagesCount; i++) {
        const imgSrc = await getMessageImageById($_currentMessage.id, i)
        $_currentMessage.doc.img.push(window.URL.createObjectURL(imgSrc))
        await setCurrentMessage($_currentMessage)
        imagesCount += imgSrc.size
      }
    }
  })

  function loadImgs() {
    for (let i = 0; i < $_currentMessage.doc.img.length; i++) {
      const link = document.createElement('a')
      link.href = $_currentMessage.doc.img[i]
      link.download = `${i}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  function getSizeOfDoc() {
    if (!imagesCount) return '...'
    if (imagesCount <= 1000) {
      return imagesCount + ' bit'
    } else if (imagesCount > 1000 && imagesCount < 1_000_000) {
      return (imagesCount / 1000).toFixed(0) + 'Kb'
    } else if (imagesCount > 1_000_000 && imagesCount < 1_000_000_000) {
      return (imagesCount / 1_000_000).toFixed(2) + 'Mb'
    } else {
      return (imagesCount / 1_000_000_000).toFixed(2) + 'Gb'
    }
  }

  function changeMaxRecipients() {
    defaultMaxRecipients = $_currentMessage.to.length
  }
  function getFlagIcon(flag) {
    return new URL(`../assets/${flag}.svg`, import.meta.url).href
  }
  function formatedDate(date) {
    const _date = new Date(date)
    const day = String(_date.getDate()).padStart(2, '0')
    const mounth = String(_date.getMonth() + 1).padStart(2, '0')
    const year = String(_date.getFullYear()).slice(2)
    return `${day}.${mounth}.${year}`
  }
  function nameOfGetMessage(users) {
    allRecipients = users.map(user => `${user.name} ${user.surname}`)
    if (allRecipients.length >= defaultMaxRecipients) {
      return allRecipients.slice(0, defaultMaxRecipients).join(', ')
    } else {
      return allRecipients.join(', ')
    }
  }
</script>

<div class="full-message">
  {#if $_currentMessage}
    <h2 class="full-message__title">{$_currentMessage.title}</h2>
    {#if $_currentMessage.flag}
      <div class="full-message__flag">
        <img
          src={getFlagIcon($_currentMessage.flag)}
          class="full-message__flag-img"
          alt=""
        />
        {#if $_currentMessage.flag}
          <span class="full-message__flag-text">
            {$_currentMessage.flag}
          </span>
        {/if}
      </div>
    {/if}
    <div class="full-message__info">
      <div class="full-message__status" />
      {#if $_currentMessage.author.avatar}
        <img class="author__img" src={$_currentMessage.author.avatar} alt="" />
      {:else}
        <div class="message__user-img">
          <UserAvatar firstChar={$_currentMessage.author.surname[0]} />
        </div>
      {/if}

      <div>
        <div class="full-message__author author">
          <span class="author__name">
            {$_currentMessage.author.name}
            {$_currentMessage.author.surname}
          </span>
          <div class="full-message__time">
            {formatedDate($_currentMessage.date)}
          </div>
          {#if $_currentMessage.important}
            <div
              on:click|stopPropagation={() => changeImportant($_currentMessage)}
              on:keypress|stopPropagation={() =>
                changeImportant($_currentMessage)}
              class="message__important"
            >
              <IconImportant />
            </div>
          {/if}
          {#if $_currentMessage.important}
            <div
              on:click|stopPropagation={() => changeMark($_currentMessage)}
              on:keypress|stopPropagation={() => changeMark($_currentMessage)}
              class="message__mark"
              class:message__mark_active={$_currentMessage.bookmark}
            >
              <IconBookmark active={$_currentMessage.bookmark} />
            </div>
          {/if}
        </div>
        <div class="full-message__address">
          {i18n('another', 'whoIs', $_language)}: {i18n(
            'another',
            'you',
            $_language
          )}, {recipients}
          {#if isVisibleAllRecipients}
            <button
              class="full-message__get-all-recipients"
              on:click={changeMaxRecipients}
            >
              {notVisibleRecipients()}
            </button>
          {/if}
        </div>
      </div>
    </div>
    {#if $_currentMessage.imagesCount}
      <div class="full-message__attaches attaches">
        <div class="attaches__items">
          {#each $_currentMessage.doc.img as attach (attach)}
            <img class="attaches__img" src={attach} alt="" loading="lazy" />
          {/each}
        </div>
        <div class="attaches__count">
          {i18n('another', 'files', $_language)}: {$_currentMessage.imagesCount}
          <button class="attaches__download" on:click={loadImgs}>
            {i18n('another', 'download', $_language)}
          </button>
          <span class="attaches__size"> ({getSizeOfDoc()}) </span>
        </div>
      </div>
    {/if}
    <div class="full-message__text">
      {$_currentMessage.text}
    </div>
  {/if}
</div>

<style>
  .full-message {
    background: var(--color-accent-bg);
    border-radius: var(--border-radius-main);
    padding: 32px;
    position: relative;
  }
  .full-message__title {
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: var(--unit);
    max-width: 80%;
  }
  .full-message__flag {
    position: absolute;
    right: var(--unit);
    top: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .full-message__flag-img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
  .full-message__flag-text {
    font-weight: 400;
    font-size: var(--text-small);
    line-height: 20px;
  }
  .full-message__info {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
  }
  .full-message__status {
    width: 5px;
    height: 5px;
    background: var(--color-primary);
    position: relative;
    left: -12px;
    border-radius: 50%;
    cursor: pointer;
  }
  .author {
    display: flex;
    align-items: center;
  }
  .author__img,
  .message__user-img {
    width: 32px;
    min-width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: var(--unit);
  }
  .author__name {
    font-weight: 400;
    font-size: var(--text-middle);
    line-height: 20px;
    margin-right: var(--unit);
  }
  .full-message__time {
    font-weight: 400;
    font-size: var(--text-small);
    line-height: 18px;
    color: var(--color-gray);
  }
  .full-message__address {
    font-weight: 400;
    font-size: var(--text-small);
    line-height: 18px;
    color: var(--color-gray);
  }
  .full-message__get-all-recipients {
    border-bottom: 1px solid var(--color-gray);
  }
  .attaches__items {
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    min-height: 196px;
  }
  .attaches__img {
    height: 196px;
    border-radius: var(--border-radius-main);
    object-fit: contain;
    margin-right: var(--unit);
  }
  .attaches__count {
    margin-top: 8px;
  }
  .attaches__download {
    margin-left: 6px;
    color: var(--color-primary);
  }
  .attaches__size {
    color: var(--color-gray);
    font-size: 13px;
  }
  .full-message__text {
    margin-top: 18px;
  }
  .skeleton {
    position: relative;
    overflow: hidden;
    background-color: var(--color-gray);
    height: 196px;
    width: 300px;
    border-radius: var(--border-radius-main);
  }
  .skeleton::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgb(255 255 255 / 0),
      rgb(255 255 255 / 0.3),
      rgb(37 22 22 / 0)
    );
    animation: shimmer 1.5s infinite;
    content: '';
  }
  @media (max-width: 1366px) {
    .full-message__flag-text {
      display: none;
    }
  }
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
</style>
