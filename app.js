const express = require('express');
const morgan = require('morgan')
require('dotenv').config();


const app = express();


//middlewares
app.use(morgan('dev'))
app.use(express.json());                            
app.use(express.urlencoded({ extended: false }));  


app.get('/', (req, res) => {
    res.send('Welcome to Agent App!');
});


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
