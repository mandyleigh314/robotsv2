const data = require('./data.js')
const pgPromise = require('pg-promise')()

const database = pgPromise({ database: 'robotlog' })

data.robots.forEach(robot => {
  let newRobot = {
    username: robot.username,
    name: robot.name,
    avatar: robot.avatar,
    email: robot.email,
    university: robot.university,
    job: robot.job,
    company: robot.company,
    phone: robot.phone,
    street_num: robot.address.street_num,
    street_name: robot.address.stret_name,
    city: robot.address.city,
    state_or_province: robot.address.state_or_province,
    postal_code: robot.address.postal_code,
    country: robot.address.country
  }
  database
    .none(
      `INSERT INTO "robots" (username, name, avatar, email, university, job, company, phone, street_num, street_name, city, state_or_province, postal_code, country) VALUES ($(username), $(name), $(avatar), $(email), $(university), $(job), $(company), $(phone), $(street_num), $(street_name), $(city), $(state_or_province), $(postal_code), $(country))`,
      newRobot
    )
    .then()
})
