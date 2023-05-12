const express = require('express');
const mongoose = require('mongoose');
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  MONGO_RECONNECT_EVERY,
  MONGO_RECONNECT_COUNT,
  REDIS_IP,
  REDIS_PORT,
  SESSION_SECRET,
} = require('../config/config');
const postRouter = require('../routes/post');
const userRouter = require('../routes/user');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const protectRoutes = require('../middlewares/authentication');
const cors = require('cors');
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/`; // ?authSource=admin
const mongoOptions = {
  serverSelectionTimeoutMS: MONGO_RECONNECT_EVERY * 1000,
};

const redisURL = `redis://${REDIS_IP}:${REDIS_PORT}`;
const redisClient = redis.createClient({
  url: redisURL,
});

let mongoRetryCount = MONGO_RECONNECT_COUNT;

const mongoConnectWithRetry = async () => {
  try {
    await mongoose.connect(mongoURL, mongoOptions);
    console.log('connected successfully to the database :)');
  } catch (err) {
    if (!mongoRetryCount) console.log(err);
    else {
      console.log(`${mongoRetryCount} attempts left to reconnect to mongoDB`);
      mongoRetryCount--;
      await mongoConnectWithRetry();
    }
  }
};

const app = express();
const PORT = +process.env.PORT + 5;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
    maxAge: 3600, //[s] one hour
    allowedHeaders: ['X-Custom-Header', 'Content-Type'],
    exposedHeaders: ['X-Server-Header'],
  })
);
app.use(express.json());
app.use(
  session({
    name: 'userSession',
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000, httpOnly: true, sameSite: 'lax' },
  })
);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/posts', protectRoutes, postRouter);
app.get('/', async function (req, res) {
  res.send('Hello World <(:)>');
});

(async () => {
  try {
    console.log(
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_IP,
      MONGO_PORT,
      MONGO_RECONNECT_EVERY,
      MONGO_RECONNECT_COUNT,
      REDIS_IP,
      REDIS_PORT,
      SESSION_SECRET
    );
    await mongoConnectWithRetry();
    await redisClient.connect();
    app.listen(PORT, async function () {
      console.log(`App running on ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();

// while (true) {
//   // Check for pending events in the event callback queues
//   const event = getNextEvent();

//   if (event) {
//     // Execute the corresponding callback function in the app space
//     executeCallback(event.callback);
//   } else {
//     // Wait for new events to arrive
//     waitForEvents();
//   }
// }
