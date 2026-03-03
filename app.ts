import user_router from './routes/users.ts';
import body_parser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import express from 'express';

const app = express();

// Set up mongoose connection

const mongoDB: any = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));

app.use('/user', user_router);

const port = 3000;

db.once('open', function() {
    console.log('Connected!');
    app.listen(port, () => {
        console.log('Server is up and running on port number ' + port);
    });
});