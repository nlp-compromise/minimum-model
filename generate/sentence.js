import { streamXml } from './_giga.js'
const giga = '/Users/spencer/data/opus/en/giga-fren/xml/en/giga-fren.release2.fixed.'
const punct = /[-:;)(.]/
const alpha = /[a-z]/

const nope = new Set('(', ')', '.', '?', ',')

const ignore = function (str) {
  if (!str) {
    return true
  }
  if (punct.test(str)) {
    return true
  }
  if (!alpha.test(str)) {
    return true
  }
  return false
}

// kick them off
const parseXml = function (id, cb) {
  const parseEN = function (item) {
    item.w = item.w || []
    item.w.forEach(o => {
      o = o || {}
      let word = o['$text'] || ''
      let lem = o['$'].lem || ''
      let tag = o['$'].tree || ''
      if (!word || !lem) {
        return
      }
      if (lem === '@card@') {
        lem = word
      }
      if (!nope.has(lem) && !ignore(lem) && !ignore(word)) {
        cb(word, lem, tag)
      }
    })
  }
  return new Promise((resolve, reject) => {
    const doneMaybe = () => resolve([])
    try {
      streamXml(giga + `${id}.xml`, parseEN, doneMaybe)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

export default parseXml