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

export const getFullMessage = async (folder, id) => {
  const data = await fetch(
    `${BASE_URL}/getFullMessage?folder=${folder}&id=${id}`
  )
  return data.json()
}

export const getMessagesByFolder = async (
  limit,
  folder,
  page,
  filters,
  sort
) => {
  const filtersString = JSON.stringify(filters)
  const data = await fetch(
    `${BASE_URL}/getMessagesByFolder?page=${page}&limit=${limit}&folder=${folder}&filter=${filtersString}&sort=${sort}`
  )
  return data.json()
}

export const getNumberOfMessagesInCurrentFolder = async (folder, filters) => {
  const filtersString = JSON.stringify(filters)
  const data = await fetch(
    `${BASE_URL}/getNumberOfMessagesInCurrentFolder?folder=${folder}&filter=${filtersString}`
  )
  return data.json()
}

export const getNumberOfMessagesInAllFolders = async () => {
  const data = await fetch(`${BASE_URL}/getNumberOfMessagesInAllFolders`)
  return data.json()
}
