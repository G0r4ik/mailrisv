import { writable } from 'svelte/store'
import locale from './locale'

export const _language = writable(localStorage.getItem('language') || 'ru')

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
