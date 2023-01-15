<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { i18n, changeLanguage, _language } from '../globalStore'
  import { anotherThemes, darkColors, lightColors } from '../themes'
  import IconCross from './svg-icons/IconCross.svelte'

  const dispatch = createEventDispatcher()

  function closeSettings() {
    dispatch('closeSettings')
  }

  export let isOpenSettings
  let language = $_language
  let currentTheme = null
  let currentSettings = 'theme'

  onMount(() => {
    const initUserTheme = getTheme() || getMediaPreference()
    setTheme(initUserTheme)
    currentTheme = initUserTheme
  })

  function getSrcOfTheme(url) {
    const n = url.split('--')[1]
    return new URL(`../assets/another-theme-mini--${n}.jpg`, import.meta.url)
      .href
  }
  function setTheme(theme) {
    if (theme.basedOn) {
      document.documentElement.className = theme.basedOn
    }
    if (theme.themeBgImg) {
      const img = new URL(`../assets/${theme.themeBgImg}.jpg`, import.meta.url)
        .href
      document.body.style.background = `url(${img}`
      document.body.style.backgroundSize = 'cover'
    }

    //
    document.documentElement.style.setProperty(
      `--color-sidebar-text`,
      `var(--color-text-${theme.colorText})`
    )
    document.documentElement.style.setProperty(
      `--color-sidebar-icon`,
      `var(--color-sidebar-icon-${theme.colorText})`
    )

    //
    document.documentElement.style.setProperty(
      `--color-header-background`,
      theme.backgroundHeader
    )
    document.documentElement.style.setProperty(
      `--color-header-text`,
      `var(--color-text-${theme.colorText})`
    )

    document.body.style.background = theme.themeBg
    currentTheme = theme
    localStorage.setItem('user-theme', JSON.stringify(theme))
  }
  function getTheme() {
    return JSON.parse(localStorage.getItem('user-theme'))
  }
  function getMediaPreference() {
    const hasDarkPreference = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    if (hasDarkPreference)
      return anotherThemes.find(t => t.id === 'default-dark')
    return anotherThemes.find(t => t.id === 'default-light')
  }
  function hexToRgb(hex) {
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return r + ',' + g + ',' + b
  }
  function setLanguage(language) {
    changeLanguage(language)
  }
</script>

{#if isOpenSettings}
  <div class="settings">
    <div class="settings__inner">
      <div
        class="settings__cross"
        on:click={closeSettings}
        on:keypress={closeSettings}
      >
        <IconCross />
      </div>
      <div class="settings__list">
        <div
          class="settings__item"
          class:settings__item_active={currentSettings === 'theme'}
          on:click={() => (currentSettings = 'theme')}
          on:keypress={() => (currentSettings = 'theme')}
        >
          {i18n('another', 'appearance', $_language)}
        </div>
        <div
          class="settings__item"
          class:settings__item_active={currentSettings === 'language'}
          on:click={() => (currentSettings = 'language')}
          on:keypress={() => (currentSettings = 'language')}
        >
          {i18n('another', 'language', $_language)} : {$_language}
        </div>
      </div>
      <div class="settings__main">
        {#if currentSettings === 'theme'}
          <div class="settings__theme theme">
            <div class="theme__title">
              {i18n('another', 'settingsThemeTitle', $_language)}
            </div>
            <div class="theme__color-wrapper">
              {#each darkColors as color}
                <div
                  style:background={color.themeBg}
                  class="theme__color"
                  class:theme__color_active={currentTheme.id === color.id}
                  on:click={() => setTheme(color)}
                  on:keypress={() => setTheme(color)}
                />
              {/each}
            </div>
            <div class="theme__color-wrapper">
              {#each lightColors as color}
                <div
                  style:background={color.themeBg}
                  class="theme__color"
                  class:theme__color_active={currentTheme.id === color.id}
                  on:click={() => setTheme(color)}
                  on:keypress={() => setTheme(color)}
                />
              {/each}
            </div>
            <div class="theme__another-wrapper">
              {#each anotherThemes as theme}
                <div
                  class="theme__another"
                  class:theme__another_active={currentTheme.id === theme.id}
                  on:click={() => setTheme(theme)}
                  on:keypress={() => setTheme(theme)}
                >
                  <img src={getSrcOfTheme(theme.themeBgURL)} alt="" />
                </div>
              {/each}
            </div>
          </div>
        {/if}
        {#if currentSettings === 'language'}
          <div class="settings__language">
            <h5 class="settings__language-title">
              {i18n('another', 'changeLanguage', $_language)}
            </h5>
            <form class="settings__language-form">
              <label
                class="settings__language-label"
                for="settings-language-russian"
              >
                <input
                  class="settings__language-radio"
                  type="radio"
                  name="settings-language"
                  id="settings-language-russian"
                  value="ru"
                  bind:group={language}
                />
                <img src="../../public/languages/russian.svg" alt="" />
                Русский
              </label>
              <label
                class="settings__language-label"
                for="settings-language-english"
              >
                <input
                  class="settings__language-radio"
                  type="radio"
                  name="settings-language"
                  id="settings-language-english"
                  value="en"
                  bind:group={language}
                />
                <img src="../../public/languages/english.svg" alt="" />
                English
              </label>
              <button
                class="settings__language-change-button"
                on:click|preventDefault={() => setLanguage(language)}
              >
                {i18n('another', 'chooseLanguage', $_language)}
              </button>
            </form>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .settings {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    background: var(--color-accent-bg);
    width: 100%;
    box-shadow: 0px -3px 48px rgba(0, 16, 61, 0.28);
    height: 400px;
    color: var(--color-text);
    padding: 26px 20px;
  }
  .settings__inner {
    position: relative;
    display: flex;
  }
  .settings__cross {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .settings__list {
    border-right: 1px solid #dadce0;
    margin-right: 42px;
    min-width: 260px;
  }
  .settings__item {
    cursor: pointer;
    padding: 10px 16px;
  }
  .settings__item_active {
    border-radius: 8px;
    background: rgba(0, 16, 61, 0.08);
    font-weight: 700;
  }
  .settings__main {
    width: 100%;
  }
  .settings__theme {
  }
  .theme {
  }
  .theme__title {
    margin-bottom: 20px;
  }
  .theme__color-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    margin-bottom: 20px;
  }
  .theme__color {
    position: relative;
    height: 40px;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    cursor: pointer;
    max-width: 67.5px;
  }
  .theme__color_active::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 24px;
    height: 17px;
    z-index: 1;
    background-image: url("data:image/svg+xml,<svg width='24' height='17' viewBox='0 0 24 17' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M23 1C22 1.49012e-08 20.5 1.49012e-08 19.5 1L9.5 11L4.5 6C3.5 5 2 5 1 6C1.49012e-08 7 1.49012e-08 8.5 1 9.5L7.75 16.25C8.25 16.75 8.75 17 9.5 17C10.25 17 10.75 16.75 11.25 16.25L23 4.5C24 3.5 24 2 23 1V1V1Z' fill='white'/></svg>");
    background-repeat: no-repeat;
  }
  .theme__color_active::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
  }
  .theme__another-wrapper {
    display: flex;
    gap: 12px 20px;
  }
  .theme__another {
    position: relative;
  }
  .theme__another img {
    display: block;
  }
  .theme__another_active {
  }
  .theme__another_active:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 95, 249, 0.48);
  }
  .theme__another_active::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 24px;
    height: 17px;
    z-index: 1;
    background-image: url("data:image/svg+xml,<svg width='24' height='17' viewBox='0 0 24 17' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M23 1C22 1.49012e-08 20.5 1.49012e-08 19.5 1L9.5 11L4.5 6C3.5 5 2 5 1 6C1.49012e-08 7 1.49012e-08 8.5 1 9.5L7.75 16.25C8.25 16.75 8.75 17 9.5 17C10.25 17 10.75 16.75 11.25 16.25L23 4.5C24 3.5 24 2 23 1V1V1Z' fill='white'/></svg>");
    background-repeat: no-repeat;
  }
  .settings__language {
  }
  .settings__language-title {
    margin-bottom: 20px;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
  }
  .settings__language-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  :global(.settings__language-label:not(:last-of-type)) {
    margin-bottom: 16px;
  }
  .settings__language-radio {
    margin-right: 12px;
  }
  .settings__language-change-button {
    margin-top: 32px;
    background: var(--color-primary);
    color: var(--color-accent-bg);
    padding: 8px 20px;
    border-radius: 8px;
  }
  @media (max-width: 768px) {
    .settings__list {
      min-width: 160px;
    }
  }
</style>
