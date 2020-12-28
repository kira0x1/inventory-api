import chalk from 'chalk';
import { connect, connection, ConnectionOptions } from 'mongoose';
import { dbURI } from '../config';

const mongooseOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

export async function connectToDB() {
    connect(dbURI, mongooseOptions)
}

export const db = connection

db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => {
    console.log(chalk.bgGreen.bold('Connected to MongoDB'))
})