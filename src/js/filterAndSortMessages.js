import { writable } from 'svelte/store'

export const _filtersOfMessages = writable({
  unread: false,
  bookmark: false,
  withAttachments: false,
})
export const _sortOfMessages = writable('newToOld')

export function clearFilter() {
  _filtersOfMessages.set({
    unread: false,
    bookmark: false,
    withAttachments: false,
  })
}
export function setFilter(filter) {
  _filtersOfMessages.update(value => {
    value[filter] = !value[filter]
    console.log(value)
    return value
  })
}
export function changeSort(sort) {
  _sortOfMessages.set(sort)
}
