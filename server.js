require('./config/sequelize.config');
const express = require('express')
const cors= require('cors')

const app= express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const port=8000;

app.listen(port, () => {
    console.log("Server listening at port", port);
    })
