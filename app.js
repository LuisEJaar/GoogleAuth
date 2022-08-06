const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
//For logging - making it so anytime there is a request log it
const morgan = require('morgan')
const exphbs = require('express-handlebars')

// Load config
dotenv.config({path: './config/config.env'})

connectDB()

const app = express()

//Loggin in dev mode (morgan)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Handlebars / sets our template engine
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 5000 

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV}`,'\n',`on port ${PORT}`,'\n',`Link: localhost:${PORT}`))