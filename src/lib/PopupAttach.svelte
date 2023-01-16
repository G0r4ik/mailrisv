<script>
  import { createEventDispatcher } from 'svelte'

  import { _currentMessage } from '../js/globalStore'
  import { i18n, _language } from '../js/language'

  const dispatch = createEventDispatcher()

  export let message
  export let idOfMessage
  let currentAttach = null
  let timer = null
  let timer2 = null

  function url(attach) {
    if (message.doc.img.length === message.imagesCount)
      return window.URL.createObjectURL(message.doc.img[0])
    return window.URL.createObjectURL(attach)
  }
  function getSizeOfDoc(imagesCount) {
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
  function showFullAttach(attach) {
    clearTimeout(timer)
    timer2 = setTimeout(() => {
      currentAttach = null
    }, 3000)
    currentAttach = url(attach)
  }
  function downloadImage() {
    const link = document.createElement('a')
    link.href = currentAttach
    link.download = `1.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  function closeFullImage() {
    currentAttach = null
    timer = setTimeout(() => dispatch('closePopup'), 2000)
  }
  function mouseOnPopup() {
    clearTimeout(timer)
    clearTimeout(timer2)
  }
</script>

<div
  class="popup-atcach"
  on:click|stopPropagation
  on:mouseenter={mouseOnPopup}
  on:keypress|stopPropagation
>
  {#each message.doc.img as attach, i (i)}
    <div
      class="popup-attach__item"
      on:mouseenter={() => showFullAttach(attach)}
    >
      <img class="popup-atcach__img" src={url(attach)} alt="" />
      <span class="popup-atcach__name">
        {`image_${idOfMessage}_${i}.jpeg`}
        {getSizeOfDoc(attach.size)}
      </span>
    </div>
  {/each}
  {#if currentAttach}
    <div
      class="popup-atcach__full-image full-image"
      on:mouseleave={closeFullImage}
    >
      <div class="full-image__inner">
        <img class="full-image__img" src={currentAttach} alt="" />
        <span
          on:click={downloadImage}
          on:keypress={downloadImage}
          class="full-image__text"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            fill="none"
          >
            <path
              fill="var(--color-text)"
              fill-rule="evenodd"
              d="M5.15 6.876a1 1 0 0 0-1.3 1.518L8 11.952l4.15-3.558a1 1 0 0 0-1.3-1.518L9 8.46V2.635a1 1 0 1 0-2 0V8.46L5.15 6.876ZM2 13.635a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H2Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{i18n('another', 'download', $_language)}</span>
        </span>
      </div>
    </div>
  {/if}
</div>

<style>
  .popup-atcach {
    position: absolute;
    right: 95px;
    z-index: 100;
    top: 0;
    background: var(--color-background);
    border-radius: 12px;
    padding: var(--unit) 0;
    box-shadow: 0 4px 32px rgb(0 16 61 / 0.24);
  }
  .popup-attach__item {
    padding: 0 var(--unit);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .popup-attach__item:hover {
    background: var(--color-hover);
  }
  .popup-attach__item:not(:last-child) {
    margin-bottom: 8px;
  }
  .popup-atcach__img {
    object-fit: cover;
    height: 32px;
    width: 32px;
    margin-right: 8px;
    border-radius: 4px;
  }
  .full-image {
    position: absolute;
    padding: 4px;
    right: 205px;
    top: 0px;
    background: var(--color-background);
    box-shadow: 0 4px 32px rgb(0 16 61 / 0.24);
    border-radius: 12px;
  }
  .full-image:hover .full-image__text {
    display: flex;
  }
  .full-image__inner {
    position: relative;
  }
  .full-image__img {
    height: 100%;
    display: block;
    width: 256px;
    object-fit: contain;
    border-radius: 12px;
  }
  .full-image__text {
    display: none;
    align-items: center;
    position: absolute;
    width: 100%;
    bottom: 10px;
    color: var(--color-text);
    justify-content: center;
    cursor: pointer;
    padding: 10px 0;
    background: rgb(44 44 45 / 0.5);
  }
  .full-image__text svg {
    margin-right: 8px;
  }
</style>
