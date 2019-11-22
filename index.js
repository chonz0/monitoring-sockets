const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const app = express()
const server = require('http').Server(app)
const io = socket(server)
const _ = require('lodash');

const port = process.env.PORT || 3001
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
  const services = _.sortBy([
    { name: 'Renovación licencias', sla: 10, waitingTime: random(1, 100), type: 'Proceso' },
    { name: 'Pago de servicios', sla: 20, waitingTime: random(1, 100), type: 'Fila' },
    { name: 'Atención al cliente', sla: 20, waitingTime: random(1, 100), type: 'Fila' },
    { name: 'Solicitud de préstamos hipotecarios', sla: 20, waitingTime: random(1, 100), type: 'Fila' },
    { name: 'Reclamos en demoras por podas de árboles', sla: 20, waitingTime: random(1, 100), type: 'Proceso' },
    { name: 'Pedido de residencia para extranjeros', sla: 20, waitingTime: random(1, 100), type: 'Fila' },
  ], ['waitingTime']).reverse();

  const stats = {
    appointments: {
      today: {
        total: random(1, 1000),
        completed: random(1, 1000),
        pending: random(1, 1000),
        canceled: random(1, 1000),
      }
    },
    services,
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
}, 3000);