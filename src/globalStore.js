import { writable } from 'svelte/store'
import { getMessagesByFolder, getNumberOfMessagesInFolder } from './api'
import locale from './locale'

export const _currentFolder = writable('Входящие')
export const _currentMessages = writable([])
export const _pageOfMessages = writable(1)
export const _currentMessage = writable(null)
export const _sortOfMessages = writable('newToOld')
export const _numberOfMessagesReceived = writable(25)
export const _pagesOfMessages = writable(1)
export const _language = writable(localStorage.getItem('language') || 'ru')
export const _filtersOfMessages = writable({
  unread: false,
  bookmark: false,
  withAttachments: false,
})

let currentFolderCopy
_currentFolder.subscribe(data => (currentFolderCopy = data))
let pageOfMessagesCopy
_pageOfMessages.subscribe(data => (pageOfMessagesCopy = data))
let filtersOfMessagesCopy
_filtersOfMessages.subscribe(data => (filtersOfMessagesCopy = data))
let sortOfMessagesCopy
_sortOfMessages.subscribe(data => (sortOfMessagesCopy = data))
let numberOfMessagesReceivedCopy
_numberOfMessagesReceived.subscribe(
  data => (numberOfMessagesReceivedCopy = data)
)

export async function setPagesOfMessages() {
  const numberOfPages = await getNumberOfMessagesInFolder(
    currentFolderCopy,
    filtersOfMessagesCopy
  )
  _pagesOfMessages.set(numberOfPages)
}

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
    return value
  })
}
export function changeSort(sort) {
  _sortOfMessages.set(sort)
}

export function changeLanguage(language) {
  localStorage.setItem('language', language)
  _language.set(language)
}
export function i18n(folder, string, language = 'ru') {
  const translationString = locale[folder][string][language]
  if (translationString) return translationString
  const languagesForString = Object.keys(locale[folder][string])
  if (languagesForString) return locale[folder][languagesForString[0]]
  return 'Ошибка перевода'
}

export function setCurrentMessage(currentMessage) {
  _currentMessage.set(currentMessage)
}

export function getAttach(message, img) {
  _currentMessages.update(data => {
    data.find(m => m.id === message.id).doc.img.push(img)
    return data
  })
}

export async function loadMessages(isOverwritingMessages) {
  let messages = await getMessagesByFolder(
    numberOfMessagesReceivedCopy,
    currentFolderCopy,
    pageOfMessagesCopy,
    filtersOfMessagesCopy,
    sortOfMessagesCopy
  )
  if (!isOverwritingMessages) return _currentMessages.set(messages)
  _currentMessages.update(data => [...data, ...messages])
}

export function changePageOfMessages(page) {
  _pageOfMessages.set(page)
}

export async function setCurrentFolder(currentFolder) {
  _currentFolder.set(currentFolder)
  changePageOfMessages(1)
  setPagesOfMessages()
  loadMessages(false)
}
