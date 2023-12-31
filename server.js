/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

if (process.env.DB_HOST === 'local')
  mongoose
    .connect(process.env.DB_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection established'));
else
  mongoose
    .connect(
      `${process.env.DB.replace('<password>', process.env.DB_PASSWORD)}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log('DB connection established'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});

// errors out express and mongo
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  // to wait until server process all current requests
  server.close(() => {
    process.exit(1);
  });
});
