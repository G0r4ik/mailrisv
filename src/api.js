const BASE_URL = 'http://localhost:3000'

export const getMessageImageById = async (idOfMessage, imageNumber) => {
  const data = await fetch(
    `${BASE_URL}/getMessageImageById?idOfMessage=${idOfMessage}&imageNumber=${imageNumber}`
  )
  return data.blob()
}

export const getAnotherFolders = async () => {
  const data = await fetch(`${BASE_URL}/getAnotherFolders`)
  return data.json()
}

export const getMessagesByFolder = async (
  limit,
  folder,
  page,
  filters,
  sort
) => {
  const filterString = JSON.stringify(filters)
  const data = await fetch(
    `${BASE_URL}/getMessagesByFolder?page=${page}&limit=${limit}&folder=${folder}&filter=${filterString}&sort=${sort}`
  )
  return data.json()
}

export const getNumberOfMessagesInFolder = async (folder, filters) => {
  const filterString = JSON.stringify(filters)
  const data = await fetch(
    `${BASE_URL}/getNumberOfMessagesInFolder?folder=${folder}&filter=${filterString}`
  )
  return data.json()
}

export const getNumberOfMessagesInAllFolders = async () => {
  const data = await fetch(`${BASE_URL}/getNumberOfMessagesInAllFolders`)
  return data.json()
}
