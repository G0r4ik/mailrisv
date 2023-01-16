import { writable } from 'svelte/store'
import { getNumberOfMessagesInAllFolders } from './api'
import {
  setCurrentFolder,
  _currentMessage,
  _currentFolder,
} from './globalStore'

let currentFolderCopy
_currentFolder.subscribe(data => (currentFolderCopy = data))

export let _currentRoute = writable('')

export async function handleRouteChange(isNeedLoadMessages = true) {
  const urlDecode = str => decodeURIComponent((str + '').replace(/\+/g, '%20'))
  const isOpenMessage = window.location.pathname.split('/')[2]?.split('-')[0]
  if (isOpenMessage !== 'message') _currentMessage.set(null)
  const folder = urlDecode(window.location.pathname.split('/')[1])

  if (window.location.pathname === `/${folder}`) setCurrentFolder(folder)
  if (currentFolderCopy !== folder) setCurrentFolder(folder)

  const allFolders = await getNumberOfMessagesInAllFolders()
  if (!allFolders[folder]) window.location.pathname = 'Incoming'

  _currentRoute.set(window.location.pathname)
}
