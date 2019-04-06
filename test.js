const fetch = require('node-fetch')

fetch('https://www.sulzer.com/shared/system/login', {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  body: JSON.stringify({
    Username: 'lukaszirngibl',
    Password: 'EiBd89zukn?',
    uid: 'f655125b-5455-477c-ad61-dd0f12e4a01c',
  }),
  headers: {
    'Accept-Type': 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(value => {
    return value.json()
  })
  .then(j => {
    console.log(j)
  })
