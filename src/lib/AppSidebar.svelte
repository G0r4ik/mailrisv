<script>
  import { getAnotherFolders } from '../api'
  import {
    i18n,
    setCurrentFolder,
    _currentFolder,
    _language,
  } from '../globalStore'
  import { onMount } from 'svelte'
  import AppSettings from './AppSettings.svelte'

  let anotherFolders = null
  let isOpenSettings = false

  onMount(async () => {
    anotherFolders = await getAnotherFolders()
  })

  function serCurrentFolder(folder) {
    setCurrentFolder(folder)
  }
  function showFullSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('sidebar_mobile-full')
    sidebar.classList.toggle('sidebar_dekstop')
  }
  function closeSettings() {
    isOpenSettings = false
  }
</script>

<aside class="sidebar sidebar_dekstop">
  <button class="sidebar__write-message">
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.3471 7.04251L5.0409 14.4567L3.4665 14.7152L3.64849 13.0203L10.9225 5.63871L12.3471 7.04251ZM13.7509 5.61796L14.4528 4.9057C14.8404 4.51232 14.8358 3.87917 14.4424 3.49152C14.049 3.10387 13.4158 3.10852 13.0282 3.5019L12.3263 4.21416L13.7509 5.61796ZM15.8773 6.3095L6.00803 16.3246L1.19738 17.1145L1.73438 12.1132L11.6037 2.0981C12.7666 0.917962 14.666 0.904028 15.8462 2.06697C17.0263 3.22992 17.0402 5.12936 15.8773 6.3095Z"
        fill="#333333"
      />
    </svg>
    <div class="sidebar__write-message-text">
      {i18n('another', 'writeLetter', $_language)}
    </div>
  </button>
  <div
    class="sidebar__burger"
    on:click={showFullSidebar}
    on:keypress={showFullSidebar}
  >
    <svg
      class="sidebar__burger-icon"
      width="21"
      height="22"
      viewBox="0 0 21 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.3076 14.9512C16.8596 14.9472 17.3109 15.3919 17.3149 15.9438C17.319 16.4958 16.8743 16.9471 16.3223 16.9512L4.32263 17.0392C3.77064 17.0432 3.31937 16.5985 3.31532 16.0465C3.31127 15.4946 3.75597 15.0433 4.30795 15.0392L16.3076 14.9512ZM16.271 9.95134C16.8229 9.94729 17.2742 10.392 17.2783 10.944C17.2823 11.496 16.8376 11.9472 16.2856 11.9513L4.28594 12.0393C3.73396 12.0434 3.28269 11.5987 3.27864 11.0467C3.27459 10.4947 3.71929 10.0434 4.27127 10.0394L16.271 9.95134ZM16.2343 4.95148C16.7863 4.94743 17.2375 5.39213 17.2416 5.94411C17.2456 6.4961 16.8009 6.94737 16.2489 6.95142L4.24926 7.03945C3.69728 7.0435 3.246 6.5988 3.24196 6.04682C3.23791 5.49483 3.68261 5.04356 4.23459 5.03951L16.2343 4.95148Z"
        fill="var(--color-sidebar-icon)"
      />
    </svg>
    <span class="sidebar__burger-text"
      >{i18n('another', 'hide', $_language)}</span
    >
  </div>

  <ul class="sidebar__folders">
    <li
      class="folders__item {$_currentFolder === 'Входящие'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Входящие')}
      on:keypress={() => serCurrentFolder('Входящие')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.29289 11.5429C4.90237 11.9334 4.90237 12.5666 5.29289 12.9571C5.68342 13.3476 6.31658 13.3476 6.70711 12.9571L8.44557 11.2186L9.3415 12.0026C9.71852 12.3325 10.2815 12.3325 10.6585 12.0026L11.5544 11.2186L13.2929 12.9571C13.6834 13.3476 14.3166 13.3476 14.7071 12.9571C15.0976 12.5666 15.0976 11.9334 14.7071 11.5429L13.0629 9.89871L14.6585 8.50258C15.0741 8.13889 15.1163 7.50713 14.7526 7.0915C14.3889 6.67586 13.7571 6.63374 13.3415 6.99742L10 9.92123L6.6585 6.99742C6.24287 6.63374 5.61111 6.67586 5.24742 7.0915C4.88374 7.50713 4.92586 8.13889 5.3415 8.50258L6.93708 9.89871L5.29289 11.5429Z"
          fill="var(--color-sidebar-icon)"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2 6C2 4.34315 3.34315 3 5 3H15C16.6569 3 18 4.34315 18 6V14C18 15.6569 16.6569 17 15 17H5C3.34315 17 2 15.6569 2 14V6ZM5 5C4.44772 5 4 5.44772 4 6V14C4 14.5523 4.44772 15 5 15H15C15.5523 15 16 14.5523 16 14V6C16 5.44772 15.5523 5 15 5H5Z"
          fill="var(--color-sidebar-icon)"
        />
      </svg>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Incoming', $_language)}</span
      >
    </li>
    <li
      class="folders__item {$_currentFolder === 'Важное'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Важное')}
      on:keypress={() => serCurrentFolder('Важное')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 5C3 3.89543 3.89543 3 5 3H8.38197C9.13951 3 9.83204 3.428 10.1708 4.10557L10.618 5H14C15.6569 5 17 6.34315 17 8V14C17 15.6569 15.6569 17 14 17H6C4.34315 17 3 15.6569 3 14V5ZM8.38197 5H5V14C5 14.5523 5.44772 15 6 15H14C14.5523 15 15 14.5523 15 14V8C15 7.44772 14.5523 7 14 7H9.38197L8.38197 5Z"
          fill="var(--color-sidebar-icon)"
        />
      </svg>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Important', $_language)}</span
      >
    </li>
    <li
      class="folders__item {$_currentFolder === 'Отправленные'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Отправленные')}
      on:keypress={() => serCurrentFolder('Отправленные')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.3827 3.07612C10.7564 3.2309 11 3.59554 11 4V6.5H12C14.7614 6.5 17 8.73858 17 11.5V16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 14.6193 13.8807 13.5 12.5 13.5H11V16C11 16.4045 10.7564 16.7691 10.3827 16.9239C10.009 17.0787 9.57889 16.9931 9.29289 16.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289L9.29289 3.29289C9.57889 3.00689 10.009 2.92134 10.3827 3.07612ZM15 12.2578V11.5C15 9.84314 13.6569 8.5 12 8.5H10C9.44772 8.5 9 8.05228 9 7.5V6.41421L5.41421 10L9 13.5858V12.5C9 11.9477 9.44772 11.5 10 11.5H12.5C13.4251 11.5 14.285 11.7791 15 12.2578Z"
          fill="var(--color-sidebar-icon)"
        />
      </svg>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Sent', $_language)}</span
      >
    </li>
    <li
      class="folders__item {$_currentFolder === 'Черновики'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Черновики')}
      on:keypress={() => serCurrentFolder('Черновики')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 7C13 7.55228 12.5523 8 12 8H8C7.44771 8 7 7.55228 7 7C7 6.44772 7.44771 6 8 6H12C12.5523 6 13 6.44772 13 7Z"
          fill="var(--color-sidebar-icon)"
        />
        <path
          d="M12 11C12.5523 11 13 10.5523 13 10C13 9.44772 12.5523 9 12 9H8C7.44771 9 7 9.44772 7 10C7 10.5523 7.44771 11 8 11H12Z"
          fill="var(--color-sidebar-icon)"
        />
        <path
          d="M10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H8C7.44771 12 7 12.4477 7 13C7 13.5523 7.44771 14 8 14H10Z"
          fill="var(--color-sidebar-icon)"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 15C3 16.6569 4.34315 18 6 18H14C15.6569 18 17 16.6569 17 15V5C17 3.34315 15.6569 2 14 2H6C4.34315 2 3 3.34315 3 5V15ZM6 16C5.44772 16 5 15.5523 5 15V5C5 4.44771 5.44772 4 6 4H14C14.5523 4 15 4.44772 15 5V15C15 15.5523 14.5523 16 14 16H6Z"
          fill="var(--color-sidebar-icon)"
        />
      </svg>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Drafts', $_language)}</span
      >
    </li>
    <li
      class="folders__item {$_currentFolder === 'Архив'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Архив')}
      on:keypress={() => serCurrentFolder('Архив')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.82843 3C7.03278 3 6.26972 3.31607 5.70711 3.87868L3.87868 5.70711C3.31607 6.26972 3 7.03278 3 7.82843V14C3 15.6569 4.34315 17 6 17H14C15.6569 17 17 15.6569 17 14V7.82843C17 7.03278 16.6839 6.26972 16.1213 5.70711L14.2929 3.87868C13.7303 3.31607 12.9672 3 12.1716 3H7.82843ZM7.12132 5.29289C7.30886 5.10536 7.56321 5 7.82843 5H12.1716C12.4368 5 12.6911 5.10536 12.8787 5.29289L14.7071 7.12132C14.8946 7.30886 15 7.56321 15 7.82843V14C15 14.5523 14.5523 15 14 15H6C5.44772 15 5 14.5523 5 14V7.82843C5 7.56321 5.10536 7.30886 5.29289 7.12132L7.12132 5.29289ZM6.74076 9.69064C7.10018 9.27131 7.73148 9.22275 8.15081 9.58217L9.00002 10.1672V7.34143C9.00002 6.78915 9.44773 6.34143 10 6.34143C10.5523 6.34143 11 6.78915 11 7.34143V10.1672L11.8492 9.58217C12.2686 9.22275 12.8999 9.27131 13.2593 9.69064C13.6187 10.11 13.5701 10.7413 13.1508 11.1007L10 13.6585L6.84923 11.1007C6.4299 10.7413 6.38134 10.11 6.74076 9.69064Z"
          fill="var(--color-sidebar-icon)"
        />
      </svg>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Archive', $_language)}</span
      >
    </li>
    <li
      class="folders__item {$_currentFolder === 'Спам'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Спам')}
      on:keypress={() => serCurrentFolder('Спам')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.9866 4C15.4343 4 14.9866 4.44772 14.9866 5V12C14.9866 12.5523 15.4343 13 15.9866 13C16.5389 13 16.9866 12.5523 16.9866 12V5C16.9866 4.44772 16.5389 4 15.9866 4ZM9.18924 14.838L9.93877 13.8076L10.1129 13.5682L11.7212 11.3573C11.8884 11.1361 12 10.8501 12 10.5765V8.00022C12 6.89556 11.1043 6.00011 9.99967 6.00011L6.25068 6.00001C5.8262 6.00001 5.46628 6.24066 5.34436 6.57241L3.43316 5.98307L3.4488 5.93235L3.46711 5.88254C3.92025 4.64948 5.11631 4.00001 6.25068 4.00001H6.25073L9.99965 4.00011H9.99972C12.2086 4.00014 14 5.79072 14 8.00022V10.5765C14 11.3499 13.7053 12.042 13.3302 12.5452L10.8066 16.0145L10.756 16.0841L10.6996 16.1491C10.2276 16.6928 9.49595 17.047 8.68658 16.9952C8.20568 16.9806 7.64783 16.8576 7.13939 16.4923C6.5843 16.0936 6.29782 15.5572 6.16144 15.0989C6.03698 14.6805 6.02291 14.2862 6.03202 14H4.99923C4.46215 14 3.56819 13.8799 2.84936 13.2021C1.97773 12.3802 1.87377 11.2519 2.12946 10.3148C2.25768 9.84484 2.5894 8.74432 2.87732 7.79822C3.02376 7.31705 3.16266 6.86344 3.26492 6.53025L3.38733 6.13192L3.42118 6.02198L3.43007 5.9931L3.43236 5.98566L3.43295 5.98375L3.43311 5.98326L3.43315 5.98313C3.43316 5.98309 3.43316 5.98307 5.34436 6.57241C5.34436 6.57241 4.29635 9.97107 4.05894 10.8412C3.82152 11.7114 4.41623 12 4.99923 12H8C8.29158 12 8.29315 12.3264 8.22486 12.7638C8.20621 12.8833 8.18235 13.011 8.15777 13.1426L8.15776 13.1426L8.15451 13.1601C8.11248 13.3851 8.06891 13.6209 8.04606 13.8457C8.04084 13.897 8.0367 13.9477 8.03391 13.9976C8.0031 14.5479 8.13573 14.9967 8.78675 14.9967C8.94159 15.0156 9.09112 14.951 9.18924 14.838ZM10.03 14.1453C10.0299 14.1453 10.0297 14.1426 10.0298 14.1367C10.0301 14.1423 10.0301 14.1452 10.03 14.1453Z"
          fill="var(--color-sidebar-icon)"
        />
      </svg>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Spam', $_language)}</span
      >
    </li>
    <li
      class="folders__item {$_currentFolder === 'Корзина'
        ? 'folders__item_active'
        : ''}"
      on:click={() => serCurrentFolder('Корзина')}
      on:keypress={() => serCurrentFolder('Корзина')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 2C11.1038 2 12 2.8962 12 4H15C15.5523 4 16 4.44772 16 5C16 5.55228 15.5523 6 15 6H5C4.44772 6 4 5.55228 4 5C4 4.44772 4.44772 4 5 4H8C8 2.8962 8.8962 2 10 2Z"
          fill="var(--color-sidebar-icon)"
        />
        <path
          d="M7.07284 7.97676C7.00823 7.42826 6.51121 7.036 5.96272 7.10062C5.41423 7.16523 5.02197 7.66225 5.08658 8.21074L6.03174 16.234C6.15038 17.2411 7.00395 18 8.01801 18H11.985C12.9991 18 13.8527 17.2411 13.9713 16.234L14.9165 8.21074C14.9811 7.66225 14.5888 7.16523 14.0403 7.10062C13.4918 7.036 12.9948 7.42826 12.9302 7.97676L11.985 16H8.01801L7.07284 7.97676Z"
          fill="var(--color-sidebar-icon)"
        />
      </svg>
      <span class="folders__item-text"
        >{i18n('staticFolders', 'Basket', $_language)}</span
      >
    </li>
  </ul>
  <hr class="sidebar__hr" />
  <div class="sidebar__users-folder user-folder">
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
        </div>
      {/each}
    {/if}
  </div>
  <button class="sidebar__new-folder">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 12C7 12.5523 7.44772 13 8 13C8.55229 13 9 12.5523 9 12V9H12C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7H9V4C9 3.44772 8.55228 3 8 3C7.44771 3 7 3.44772 7 4L7 7H4C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9H7L7 12Z"
        fill="var(--color-gray)"
      />
    </svg>
    {i18n('another', 'newFolder', $_language)}
  </button>
  <button class="sidebar__settings" on:click={() => (isOpenSettings = true)}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.67178 5.50022C9.17843 5.17058 8.59841 4.99463 8.00507 4.99463C7.20942 4.99463 6.44635 5.3107 5.88375 5.87331C5.32114 6.43592 5.00507 7.19898 5.00507 7.99463C5.00507 8.58797 5.18101 9.16799 5.51066 9.66134C5.8403 10.1547 6.30884 10.5392 6.85702 10.7663C7.40519 10.9933 8.00839 11.0527 8.59034 10.937C9.17228 10.8212 9.70683 10.5355 10.1264 10.1159C10.5459 9.69639 10.8317 9.16184 10.9474 8.5799C11.0632 7.99796 11.0038 7.39476 10.7767 6.84658C10.5496 6.2984 10.1651 5.82986 9.67178 5.50022ZM7.1736 8.5502C7.06371 8.38575 7.00507 8.19241 7.00507 7.99463C7.00507 7.72941 7.11042 7.47506 7.29796 7.28752C7.4855 7.09999 7.73985 6.99463 8.00507 6.99463C8.20285 6.99463 8.39619 7.05328 8.56064 7.16316C8.72508 7.27304 8.85326 7.42922 8.92895 7.61195C9.00463 7.79467 9.02444 7.99574 8.98585 8.18972C8.94727 8.3837 8.85203 8.56188 8.71217 8.70174C8.57232 8.84159 8.39414 8.93683 8.20016 8.97541C8.00618 9.014 7.80511 8.9942 7.62238 8.91851C7.43966 8.84282 7.28348 8.71465 7.1736 8.5502Z"
        fill="var(--color-sidebar-icon)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.02511 0.0547045H9.02511C9.19769 0.0536994 9.3676 0.0973773 9.5183 0.18149C9.669 0.265602 9.79537 0.387286 9.88511 0.534704L10.7351 1.9547C10.8248 2.10212 10.9512 2.22381 11.1019 2.30792C11.2526 2.39203 11.4225 2.43571 11.5951 2.4347H13.7851C13.9596 2.43576 14.1308 2.48246 14.2817 2.57018C14.4326 2.65789 14.5579 2.78357 14.6451 2.9347L15.7051 4.8547C15.7929 5.00672 15.8391 5.17917 15.8391 5.3547C15.8391 5.53024 15.7929 5.70269 15.7051 5.8547L14.7051 7.5447C14.6173 7.69672 14.5711 7.86917 14.5711 8.0447C14.5711 8.22024 14.6173 8.39268 14.7051 8.5447L15.7051 10.2347C15.7929 10.3867 15.8391 10.5592 15.8391 10.7347C15.8391 10.9102 15.7929 11.0827 15.7051 11.2347L14.6451 13.0747C14.5579 13.2258 14.4326 13.3515 14.2817 13.4392C14.1308 13.5269 13.9596 13.5737 13.7851 13.5747H11.5951C11.4225 13.5737 11.2526 13.6174 11.1019 13.7015C10.9512 13.7856 10.8248 13.9073 10.7351 14.0547L9.88511 15.4547C9.7966 15.604 9.67077 15.7277 9.51998 15.8136C9.3692 15.8995 9.19865 15.9447 9.02511 15.9447H7.02511C6.85156 15.9447 6.68102 15.8995 6.53023 15.8136C6.37945 15.7277 6.25361 15.604 6.16511 15.4547L5.27511 14.0347C5.18537 13.8873 5.059 13.7656 4.9083 13.6815C4.7576 13.5974 4.58769 13.5537 4.41511 13.5547H2.22511C2.05059 13.5537 1.87939 13.5069 1.72852 13.4192C1.57765 13.3315 1.45236 13.2058 1.36511 13.0547L0.295107 11.1547C0.207339 11.0027 0.161133 10.8302 0.161133 10.6547C0.161133 10.4792 0.207339 10.3067 0.295107 10.1547L1.29511 8.4647C1.38288 8.31269 1.42908 8.14024 1.42908 7.9647C1.42908 7.78917 1.38288 7.61672 1.29511 7.4647L0.295107 5.7747C0.207339 5.62269 0.161133 5.45024 0.161133 5.2747C0.161133 5.09917 0.207339 4.92672 0.295107 4.7747L1.36511 2.9347C1.45236 2.78357 1.57765 2.65789 1.72852 2.57018C1.87939 2.48246 2.05059 2.43576 2.22511 2.4347H4.41511C4.58769 2.43571 4.7576 2.39203 4.9083 2.30792C5.059 2.22381 5.18537 2.10212 5.27511 1.9547L6.16511 0.534704C6.25485 0.387286 6.38122 0.265602 6.53192 0.18149C6.68262 0.0973773 6.85252 0.0536994 7.02511 0.0547045ZM9.02511 2.9847L8.46511 2.0547H7.54511L6.98511 2.9847C6.71798 3.42736 6.341 3.79348 5.89071 4.04753C5.44042 4.30158 4.93212 4.43495 4.41511 4.4347H2.80511L2.62511 4.7547L2.32511 5.2647L3.03511 6.4947C3.31544 6.9613 3.46354 7.49537 3.46354 8.0397C3.46354 8.58404 3.31544 9.11811 3.03511 9.5847L2.32511 10.7747L2.61511 11.2647L2.80511 11.6047H4.41511C4.93212 11.6045 5.44042 11.7378 5.89071 11.9919C6.341 12.2459 6.71798 12.612 6.98511 13.0547L7.54511 13.9847H8.46511L9.02511 13.0547C9.28727 12.6046 9.66211 12.2305 10.1127 11.9693C10.5634 11.708 11.0742 11.5686 11.5951 11.5647H13.2051L13.3951 11.2347L13.6851 10.7347L12.9651 9.5447C12.6848 9.07811 12.5367 8.54404 12.5367 7.9997C12.5367 7.45537 12.6848 6.9213 12.9651 6.4547L13.6451 5.2647L13.3451 4.7447L13.1651 4.4347H11.5951C11.0781 4.43495 10.5698 4.30158 10.1195 4.04753C9.66922 3.79348 9.29223 3.42736 9.02511 2.9847Z"
        fill="var(--color-sidebar-icon)"
      />
    </svg>
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
  }
  .sidebar_dekstop,
  .sidebar_mobile-full {
    width: 200px;
    min-width: 200px;
    flex-direction: column;
    justify-content: space-between;
  }
  .sidebar__write-message {
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
  .sidebar__write-message-text {
    color: #333;
    padding: 8px 0;
    font-weight: 700;
    font-size: var(--text-middle);
    line-height: 20px;
  }
  .sidebar__write-message svg,
  .sidebar_mobile-full .sidebar__write-message svg {
    display: none;
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
  .sidebar__burger-text {
    margin-left: 8px;
    display: none;
  }
  .sidebar_mobile-full .sidebar__burger-text {
    display: inline;
  }
  .folders__item:hover,
  .user-folders__item:hover {
    background: var(--color-hover);
  }
  .folders__item,
  .user-folders__item,
  .sidebar_mobile-full .folders__item {
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
  .folders__item-text,
  .user-folders__item-text,
  .sidebar__settings-text {
    color: var(--color-sidebar-text);
  }
  .sidebar_mobile-full .folders__item-text,
  .sidebar_mobile-full .sidebar__settings-text {
    display: block;
  }
  .sidebar_mobile-full .sidebar__settings-text {
    padding: 10px;
  }
  .folders__item svg {
    margin-right: 8px;
  }
  .folders__item_active {
    font-weight: 700;
    background: var(--color-active-folder);
  }
  .sidebar__hr {
    background: var(--color-hr);
    margin: 8px 0;
    border: none;
    height: 1px;
  }
  .sidebar__new-folder,
  .sidebar_mobile-full .sidebar__new-folder {
    display: flex;
    align-items: center;
    color: var(--color-gray);
    font-size: var(--text-middle);
    padding: 8px var(--unit);
  }
  .sidebar__change-theme {
    /* display: flex;
  align-items: center;
  position: absolute;
  bottom: var(--unit);
  padding: 8px var(--unit); */
  }
  .sidebar__settings svg {
    margin-right: 8px;
  }
  .sidebar_mobile-full .sidebar__settings {
    display: flex;
  }
  .sidebar__settings {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: var(--unit);
    padding: 8px var(--unit);
  }
  @media (max-width: 1366px) {
    .sidebar_dekstop {
      width: 45px;
      min-width: 45px;
    }
    .sidebar__write-message {
      margin-left: auto;
      margin-right: auto;
      width: auto;
      padding: 10px;
    }
    .sidebar__write-message-text {
      padding: 0;
      width: 100%;
    }
    .sidebar_dekstop .sidebar__write-message-text {
      display: none;
      padding: 0;
    }
    .sidebar_mobile-full .sidebar__write-message {
      width: 100%;
    }
    .sidebar_mobile-full .sidebar__write-message-text {
      padding: 0;
    }
    .sidebar_mobile-full .sidebar__write-message-text,
    .sidebar_mobile-full .sidebar__users-folder {
      display: block;
    }
    .sidebar__write-message svg {
      display: block;
    }
    .folders__item {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .folders__item svg {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .sidebar_mobile-full .folders__item svg {
      margin: 0;
      margin-right: 8px;
    }
    .sidebar_mobile-full .change-theme-text {
      display: inline;
    }
    .sidebar__burger {
      display: flex;
    }

    .sidebar_dekstop .folders__item-text,
    .sidebar_dekstop .sidebar__settings-text {
      display: none;
    }
    .sidebar_mobile-full .folders__item-text,
    .sidebar_mobile-full .sidebar__settings-text {
      display: block;
    }
    .sidebar__new-folder {
      display: none;
    }
    .users-folder__item-text {
      overflow: hidden;
    }
    .change-theme-text {
      display: none;
    }
  }
</style>
