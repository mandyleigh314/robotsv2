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
  database.any(`SELECT * FROM "robots" ORDER BY name`).then(robots => {
    res.render('index', { robots: robots })
  })
})

app.get('/info/:id', (req, res) => {
  const roboId = req.params.id
  const getOneRobo = database
    .one(`SELECT * FROM "robots" WHERE id = $(id)`, { id: roboId })
    .then(getOneRobo => {
      res.render('info', getOneRobo)
    })
    .catch(error => res.render('error'))
})

app.get('/info/edit/:id', (req, res) => {
  const roboId = req.params.id
  const getOneRobo = database.one(`SELECT * FROM "robots" WHERE id = $(id)`, { id: roboId }).then(getOneRobo => {
    res.render('edit', getOneRobo)
  })
})

app.get('/add', (req, res) => {
  res.render('new')
})

app.post('/info/edit/:id', (req, res) => {
  const roboId = req.params.id
  database
    .none(
      `UPDATE "robots" SET name = $(name), city = $(city), country = $(country), job = $(job), company = $(company), email = $(email), phone = $(phone), university = $(university) WHERE id = $(id)`,
      {
        name: req.body.name,
        city: req.body.city,
        country: req.body.country,
        job: req.body.job,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        university: req.body.university,
        id: roboId
      }
    )
    .then(res.redirect('/'))
})

app.post('/add', (req, res) => {
  database
    .none(
      `INSERT INTO "robots" (name, city, country, job, company, email, phone, university) VALUES($(name), $(city), $(country), $(job), $(company), $(email), $(phone), $(university))`,
      {
        name: req.body.name,
        city: req.body.city,
        country: req.body.country,
        job: req.body.job,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        university: req.body.university
      }
    )
    .then(res.redirect('/'))
})

app.post('/info/delete/:id', (req, res) => {
  const roboId = req.params.id
  database.none(`DELETE FROM "robots" WHERE id = $(id)`, { id: roboId }).then(res.redirect('/'))
})

app.listen(3000, () => {
  console.log('Greetings from the year 3000')
})
