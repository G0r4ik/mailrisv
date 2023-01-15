import { writable } from 'svelte/store'
import {
  getMessagesByFolder,
  getNumberOfMessagesInAllFolders,
  getNumberOfMessagesInFolder,
  getMessageImageById,
} from './api'
import locale from './locale'

export const _currentFolder = writable(
  window.location.pathname.split('/')[1] || 'Incoming'
)
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

export let _currentRoute = writable('')

export async function getImages(message) {
  if (message.imagesCount === message.doc.img.length) return
  for (let i = 0; i < message.imagesCount; i++) {
    const img = await getMessageImageById(message.id, i)
    _currentMessages.update(data => {
      data.find(m => m.id === message.id).doc.img.push(img)
      return data
    })
  }
}

export const allFolders = Object.keys(await getNumberOfMessagesInAllFolders())

export function handleRouteChange(isNeedLoadMessages = true) {
  const urlDecode = str => decodeURIComponent((str + '').replace(/\+/g, '%20'))
  const isOpenMessage = window.location.pathname.split('/')[2]?.split('-')[0]
  if (isOpenMessage !== 'message') _currentMessage.set(null)
  const folder = urlDecode(window.location.pathname.split('/')[1])

  if (currentFolderCopy !== folder) setCurrentFolder(folder)
  if (!allFolders.includes(folder)) {
    window.location.pathname = 'Incoming'
  }
  _currentRoute.set(window.location.pathname)
}

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
let currentMessagesCopy
_currentMessages.subscribe(data => (currentMessagesCopy = data))

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
