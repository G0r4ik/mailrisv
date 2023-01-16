<script>
  import { i18n, _language } from '../js/language.js'
  const theme =
    JSON.parse(localStorage.getItem('user-theme'))?.id ??
    document.documentElement.className
  let _class
  if (theme.includes('light')) {
    _class = 'light'
  } else if (theme.includes('dark')) {
    _class = 'dark'
  } else {
    _class = 'another'
  }
</script>

<div class="empty {_class}">
  <span class="empty__text">{i18n('another', 'noLetters', $_language)}</span>
</div>

<style>
  .empty {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .empty__text {
    color: var(--color-sidebar-icon);
    position: relative;
    top: 110px;
    left: -5px;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
  }
  .empty.another .empty__text {
    top: 70px;
  }
  .empty.dark {
    background-image: url(../assets/dark-message-empty.png);
  }
  .empty.light {
    background-image: url(../assets/light-message-empty.png);
  }
  .empty.another {
    background-image: url(../assets/another-message-empty.png);
  }
</style>
