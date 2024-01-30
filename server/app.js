if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const errorHandler = require('./middlewares/errorHandler')
const router = require('./routes/index')
const cors = require('cors')


app.use(cors())


app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use(router);

// app.listen(PORT, () => console.log("Successfuly accessing PORT: " + PORT));

app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
})
// error handler
app.use(errorHandler)


module.exports = app
