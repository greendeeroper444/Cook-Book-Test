const express = require('express')
const dotenv = require('dotenv').config();
const mongoose = require('mongoose')
const middleware = require('./middlewares/middleware');


const app = express();

app.use(middleware);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected'))
.catch((error) => console.log('Database not connected', error))


app.use('/', require('./routes/userRoute'));
app.use('/recipe', require('./routes/recipeRoute'));
app.use('/ingredient', require('./routes/ingredientRoute'));
app.use('/recipe-ingredient', require('./routes/recipeIngredientRoute'));

const port = 8080;
app.listen(port, () => console.log(`Server is running on ${port}`));