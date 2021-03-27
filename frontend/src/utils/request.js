import fetch from 'dva/fetch'

function parseJSON(response) {
  return response.json()
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else if (response.status === 601) {
        parseJSON(response).then(data => {
            let url = data.url
            window.location.href = url
        })
    } else {
        const error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data}))
    .catch(err => ({ err }))
}