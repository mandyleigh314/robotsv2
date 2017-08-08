const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgPromise = require('pg-promise')()

const app = express()

const database = pgPromise({ database: 'robotlog' })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('mst', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mst')
app.use(express.static('public'))

app.get('/', (req, res) => {
  database.any('SELECT * FROM "robots"').then(robots => {
    res.render('index', { robots: robots })
  })
})

app.listen(3000, () => {
  console.log('Greetings from the year 3000')
})
