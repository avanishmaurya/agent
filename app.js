const express = require('express');
const morgan = require('morgan')
require('dotenv').config();
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();

const router = require('./routes')

const corsOption = {
    origin: true,
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true,
}
app.use(cors(corsOption))

//middlewares
app.use(morgan('dev'))
app.use(express.json());                            
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());

app.use('/',router)


// app.get('/', (req, res) => {
//     res.send('Welcome to Agent App!');
// });


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
