<script>
  export let isRead = false
</script>

<div
  class="message__status"
  style="background-color: {isRead
    ? 'var(--color-gray)'
    : 'var(--color-primary)'};"
/>

<style>
  .message__status {
    background: var(--color-gray);
    border-radius: 50%;
    width: 6px;
    height: 6px;
    min-width: 6px;
    min-height: 6px;
  }
</style>
