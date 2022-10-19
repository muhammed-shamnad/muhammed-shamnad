const express = require('express');
const app = express();
const router = express.Router();
const port = 8000;
const cors = require('cors')

const routes = require('./routes/index');

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use('/', routes)

app.listen(port, () => {
    console.log(`server is running at port http://localhost:${port}`)
})