import { writable } from 'svelte/store'
import * as api from './api'
import { _filtersOfMessages, _sortOfMessages } from './filterAndSortMessages'

export const _currentFolder = writable(
  window.location.pathname.split('/')[1] || 'Incoming'
)
export const _currentMessages = writable([])
export const _pageOfMessages = writable(1)
export const _currentMessage = writable(null)
export const _numberOfMessagesReceived = writable(15)

export const _numberOfMessagesInCurrentFolder = writable(1)
export let _allFolders
api.getNumberOfMessagesInAllFolders().then(r => (_allFolders = r))

let currentFolderCopy
let pageOfMessagesCopy
let filtersOfMessagesCopy
let sortOfMessagesCopy
let currentMessagesCopy
let numberOfMessagesReceivedCopy
_currentFolder.subscribe(data => (currentFolderCopy = data))
_pageOfMessages.subscribe(data => (pageOfMessagesCopy = data))
_filtersOfMessages.subscribe(data => (filtersOfMessagesCopy = data))
_sortOfMessages.subscribe(data => (sortOfMessagesCopy = data))
_currentMessages.subscribe(data => (currentMessagesCopy = data))
_numberOfMessagesReceived.subscribe(d => (numberOfMessagesReceivedCopy = d))

export async function getImages(message) {
  if (message.imagesCount === message.doc.img.length) return
  for (let i = 0; i < message.imagesCount; i++) {
    const img = await api.getMessageImageById(message.id, i)
    _currentMessages.update(data => {
      data.find(m => m.id === message.id).doc.img.push(img)
      return data
    })
  }
  return message
}

export async function getNumberOfMessagesInCurrentFolder() {
  const numberOfPages = await api.getNumberOfMessagesInCurrentFolder(
    currentFolderCopy,
    filtersOfMessagesCopy
  )
  _numberOfMessagesInCurrentFolder.set(numberOfPages)
}

export function setCurrentMessage(currentMessage) {
  _currentMessage.set(currentMessage)
}

export async function loadMessages(isOverwritingMessages) {
  let messages = await api.getMessagesByFolder(
    numberOfMessagesReceivedCopy,
    currentFolderCopy,
    pageOfMessagesCopy,
    filtersOfMessagesCopy,
    sortOfMessagesCopy
  )
  if (isOverwritingMessages) return _currentMessages.set(messages)
  _currentMessages.update(data => [...data, ...messages])
}

export function changePageOfMessages(page) {
  _pageOfMessages.set(page)
}

export async function setCurrentFolder(currentFolder) {
  _currentFolder.set(currentFolder)
  changePageOfMessages(1)
  getNumberOfMessagesInCurrentFolder()
  loadMessages(true)
}
