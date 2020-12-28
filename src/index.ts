import apiRoutes from './routes/api'
import express from "express";
import parser from "body-parser";
import chalk from 'chalk';
import { connectToDB } from './database/mongodb';

connectToDB()

const app = express();
const port = process.env.PORT || 3000

app.use(parser.urlencoded({ extended: false }));

app.use('/api', apiRoutes)

app.get('/', (req, res) => {
    return res.send('meow')
})

app.listen(port, () => {
    console.log(chalk`{bgGreen.bold Server started at} {bold http://localhost:${port}}`)
})