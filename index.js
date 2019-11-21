const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const app = express()
const server = require('http').Server(app)
const io = socket(server)

const port = process.env.PORT || 3000
const route = require('./app/routes')

app.use(cors())
app.use((req,res,next) => {
  req.io = io
  next()
})
app.use(bodyParser.json())
app.use(validator())
app.use(route)

server.listen(port, () => {
  console.log('Listening on '+port)
})

const random = (min, max) => Math.round(Math.random() * (max - min) + min);

setInterval(() => {
  const subscriptionsTotal = random(500, 3000);

  const stats = {
    appointments: {
      today: {
        total: random(1, 1000),
        completed: random(1, 1000),
        pending: random(1, 1000),
        canceled: random(1, 1000),
      }
    },
    operators: {
      active: random(1, 50),
      inactive: random(1, 50),
    },
    subscriptions: {
      total: subscriptionsTotal,
      completed: random(1, subscriptionsTotal * 0.7),
      waiting: {
        total: random(1, 1000),
        checkedIn: random(1, 1000),
        notCheckedIn: random(1, 1000),
      }
    },
    channels: {
      totem: random(1, 1000),
      app: random(1, 1000),
      entrance: random(1, 1000),
    },
    users: {
      active: random(1, 1000),
      inactive: random(1, 1000)
    }
  };

  console.log('stats', stats);
  io.emit('stats', stats);
}, 1000);