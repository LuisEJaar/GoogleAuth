const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
//For logging - making it so anytime there is a request log it
const morgan = require('morgan')
const exphbs = require('express-handlebars')
//What we're using for passwords
const passport = require('passport')
// Needed for passport to work
const session = require('express-session')

//For letting your session continue *must be below  session*
const MongoStore = require('connect-mongo')(session)


// Load config
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Loggin in dev mode (morgan)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Handlebars / sets our template engine
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// Sessions *Must be above passport middleware*
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // lets you store your session
  store: new MongoStore({mongooseConnection: mongoose.connection}) 
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000 

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV}`,'\n',`on port ${PORT}`,'\n',`Link: http://localhost:${PORT}`))