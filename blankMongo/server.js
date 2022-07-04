const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

let db,
    dbConnectionString = process.env.DB_STRING,
    dbName = 'sample_airbnb',
    collection

MongoClient.connect(dbConnectionString)
  .then(client => {
    console.log("connected to MongoDB database soundslip")
    db = client.db(dbName)
    collection = db.collection("listingsAndReviews")
  })

app.listen(process.env.PORT || PORT, () => {
  console.log(`your server is running on port ${process.env.PORT || PORT}`)
})
