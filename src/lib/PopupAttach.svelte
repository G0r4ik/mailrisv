<script>
  import { createEventDispatcher } from 'svelte'

  import { i18n, _language } from '../globalStore'
  const dispatch = createEventDispatcher()

  export let attaches
  export let idOfMessage
  let currentAttach = null
  let timer = null
  let timer2 = null

  function url(attach) {
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
  {#each attaches as attach, i (i)}
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
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.15081 6.87563C4.73148 6.51621 4.10018 6.56477 3.74076 6.9841C3.38134 7.40342 3.4299 8.03472 3.84923 8.39414L8.00002 11.952L12.1508 8.39414C12.5701 8.03472 12.6187 7.40342 12.2593 6.9841C11.8999 6.56477 11.2686 6.51621 10.8492 6.87563L9.00002 8.46067V2.63489C9.00002 2.0826 8.5523 1.63489 8.00002 1.63489C7.44773 1.63489 7.00002 2.0826 7.00002 2.63489V8.46067L5.15081 6.87563ZM2 13.6349C1.44772 13.6349 1 14.0826 1 14.6349C1 15.1872 1.44772 15.6349 2 15.6349H14C14.5523 15.6349 15 15.1872 15 14.6349C15 14.0826 14.5523 13.6349 14 13.6349H2Z"
              fill="#ffffff"
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
    color: #fff;
    justify-content: center;
    cursor: pointer;
    padding: 10px 0;
    background: rgb(44 44 45 / 0.5);
  }
  .full-image__text svg {
    margin-right: 8px;
  }
</style>
