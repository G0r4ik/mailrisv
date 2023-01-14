import { dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import zlib from 'node:zlib'
import stream from 'stream'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const mode = process.env.NODE_ENV
const distPath = path.join(__dirname, mode !== 'production' ? 'dist' : '')
const distAssetsPath = path.join(distPath, 'assets')

const startDate = new Date()
const PORT = 3000
const MIME = {
  js: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  svg: 'image/svg+xml; charset=utf-8',
  jpg: 'image/jpeg; charset=utf-8',
  json: 'application/json; charset=utf-8',
  html: 'text/html; charset=utf-8',
}
const staticFolders = [
  'Входящие',
  'Важное',
  'Отправленные',
  'Черновики',
  'Архив',
  'Спам',
  'Корзина',
]
const userFolders = new Set()
const db = []
const imagesInLetters = {}
const allMessages = {}

const reader = fs.createReadStream(path.join(__dirname, 'db.json'), {
  highWaterMark: 81920, // 10kb = 8 * 1024 * 10
  encoding: 'utf-8',
})
let chunkOfObject = ''
const brackets = { '}': 0, '{': 0 }
reader.on('data', chunk => {
  let start = null
  const length = chunk.length
  for (let i = 0; i < length; i++) {
    const chunkChar = chunk[i]
    const isStart = chunkChar === '{'
    const isEnd = chunkChar === '}'
    if (isEnd || isStart) brackets[chunkChar]++
    try {
      if (length - 1 === i) {
        if (isEnd && brackets['}'] === brackets['{']) {
          chunkOfObject += chunk.slice(start || 0, i + 1)
          const message = JSON.parse(chunkOfObject)
          db.push(message)
          continue
        }
        if (isStart && brackets['}'] === brackets['{'] - 1) {
          chunkOfObject = chunkChar
          start = null
          continue
        }
        if (brackets['}'] === brackets['{']) continue
        chunkOfObject += chunk.slice(start, i + 1)
      } else {
        if (isStart && brackets['}'] === brackets['{'] - 1) start = i
        if (isEnd && brackets['}'] === brackets['{']) {
          chunkOfObject += chunk.slice(start, i + 1)
          const message = JSON.parse(chunkOfObject)
          db.push(message)
          chunkOfObject = ''
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
})

function createFolders(message) {
  if (!message.folder) message.folder = 'Входящие'
  if (!allMessages[message.folder]) allMessages[message.folder] = []
  if (!staticFolders.includes(message.folder)) userFolders.add(message.folder)
  allMessages[message.folder].push(message)
}
function removeImgFromLetterAndMove(message) {
  if (Array.isArray(message.doc.img)) {
    message.imagesCount = message.doc.img.length
    imagesInLetters[message.id] = message.doc.img
  } else {
    message.imagesCount = 1
    imagesInLetters[message.id] = [message.doc.img]
  }
  message.doc.img = []
}
function filterMessages(allMessages, filterObj) {
  let copyOfAllMessages = [...allMessages]
  if (filterObj.withAttachments) {
    copyOfAllMessages = copyOfAllMessages.filter(message => message.imagesCount)
  }
  if (filterObj.bookmark) {
    copyOfAllMessages = copyOfAllMessages.filter(message => message.bookmark)
  }
  if (filterObj.unread) {
    copyOfAllMessages = copyOfAllMessages.filter(message => !message.read)
  }
  return copyOfAllMessages
}
function sortMessages(messages, sort) {
  const copyMessages = [...messages]
  if (sort === 'newToOld') return copyMessages
  if (sort === 'oldToNew') return copyMessages.reverse()
  if (sort === 'titleFirstToLast') {
    return copyMessages.sort((a, b) => a.title.localeCompare(b.title))
  }
  if (sort === 'titleLastToFirst') {
    return copyMessages.sort((a, b) => b.title.localeCompare(a.title))
  }
  if (sort === 'authorLastToFirst') {
    copyMessages.sort((a, b) => a.author.email.localeCompare(b.author.email))
    return copyMessages
  }
  if (sort === 'authorFirstToLast') {
    copyMessages.sort((a, b) => b.author.email.localeCompare(a.author.email))
    return copyMessages
  }
}
const urlDecode = str => decodeURIComponent((str + '').replace(/\+/g, '%20'))

reader.on('end', () => {
  db.sort((a, b) => new Date(b.date) - new Date(a.date))
  for (let i = 0; i < db.length; i++) {
    db[i].id = i
    createFolders(db[i])
    if (db[i].doc) removeImgFromLetterAndMove(db[i])
  }

  server.listen(PORT, () => {
    const diffDate = (new Date() - startDate) / 1000
    console.log(`from entering a npm to turning on the server: ${diffDate}s`)
  })
})

const server = http.createServer((req, res) => {
  const queriesParams = url.parse(req.url, true).query
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    if (req.url === '/getAnotherFolders') {
      res.setHeader('Content-Type', MIME['json'])
      return res.end(JSON.stringify(Array.from(userFolders)))
    }
    console.log(req.url)
    if (req.url.includes('getMessagesByFolder')) {
      res.setHeader('Content-Type', MIME['json'])
      const page = queriesParams.page
      const limit = queriesParams.limit
      const filter = queriesParams.filter
      const folder = queriesParams.folder
      const sort = queriesParams.sort
      if (!page || !limit || !filter || !folder || !sort) {
        console.log('page or limit or filter or folder or sort are incorrect')
        res.statusCode = 400
        return res.end(
          'page or limit or filter or folder or sort are incorrect'
        )
      }
      const startIndex = (page - 1) * limit
      const endIndex = page * limit

      const filterObj = JSON.parse(filter)
      const copyOfAllMessages = filterMessages(allMessages[folder], filterObj)
      const messages = sortMessages(copyOfAllMessages, sort)
      return res.end(JSON.stringify(messages.slice(startIndex, endIndex)))
    }
    if (req.url.startsWith('/getNumberOfMessagesInFolder')) {
      res.setHeader('Content-Type', MIME['json'])
      const filterObj = JSON.parse(queriesParams.filter)
      const folder = queriesParams.folder
      if (!filterObj || !folder) {
        console.log('filterObj or folder are incorrect')
        res.statusCode = 400
        return res.end('filterObj or folder are incorrect')
      }
      const messages = filterMessages(allMessages[folder], filterObj)
      return res.end(JSON.stringify(messages.length))
    }
    if (req.url.startsWith('/getMessageImageById')) {
      const idOfMessage = +queriesParams.idOfMessage
      const imageNumber = +queriesParams.imageNumber

      const hasIdAndNumber = isFinite(idOfMessage) && isFinite(imageNumber)
      if (!hasIdAndNumber) {
        console.log('Invalid id or number')
        res.statusCode = 400
        return res.end('Invalid id or number')
      }
      const img = imagesInLetters[idOfMessage]?.[imageNumber]
      if (!img) {
        console.log("Couldn't find the picture")
        res.statusCode = 404
        return res.end("Couldn't find the picture")
      }
      res.setHeader('Content-Type', MIME['jpg'])
      const image = Buffer.from(img.split(',').at(-1), 'base64')
      return res.end(image)
    }
    //
    const typeFile = req.url.split('.').at(-1)
    if (
      ['js', 'css', 'svg'].includes(typeFile) &&
      req.url.startsWith('/assets')
    ) {
      res.setHeader('Content-Type', MIME[typeFile])
      const nameOfFile = req.url.split('/').at(-1)
      const file = path.join(distAssetsPath, urlDecode(nameOfFile))
      const source = fs.createReadStream(file)
      res.setHeader('Content-Encoding', 'br')
      const br = zlib.createBrotliCompress()
      return stream.pipeline(source, br, res, (e, b) => {})
    }
    fs.readFile(path.join(distPath, 'index.html'), (err, data) => {
      if (err) {
        console.log(err)
        res.statusCode = 500
        return res.end('An error occurred while reading the file.')
      }
      res.setHeader('Content-Type', MIME['html'])
      return res.end(data)
    })
  } catch (error) {
    console.log(error)
  }
})
