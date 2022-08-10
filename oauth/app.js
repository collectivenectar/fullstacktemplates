// stopped at 51:00

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

// load config
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(methodOverride(function(request, response) {
  if(request.body && typeof request.body === 'object' && '_method' in request.body){
    let method = request.body._method
    delete request.body._method
    return method
  }
}))

// Logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

// Handlebars
app.engine(
  '.hbs',
  exphbs.engine({
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  },
  defaultLayout: 'main',
  extname: '.hbs'}))
app.set('view engine', '.hbs')

// Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


// Set global var
app.use(function(request, response, next){
  response.locals.user = request.user || null
  next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))
