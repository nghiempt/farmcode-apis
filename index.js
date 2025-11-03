require('dotenv').config();
const path = require('path');
const moduleAlias = require('module-alias');
const fastify = require('fastify')({ logger: true });
const fastifyCors = require('@fastify/cors');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const fastifyStatic = require('@fastify/static');

moduleAlias({ base: path.resolve(__dirname, '.') });

const database = require('~/database/connection');
const router = require('~/router/index');

const fastifyPassport = require('@fastify/passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET IS NOT FOUND');
}

database.connection(async () => {
  try {
    await fastify.register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    });
    await fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
      secret: JWT_SECRET,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
      saveUninitialized: false,
      resave: false,
    });
    await fastify.register(fastifyPassport.initialize());
    await fastify.register(fastifyPassport.secureSession());
    fastifyPassport.registerUserSerializer(async (user, request) => {
      const { id, displayName } = user;
      const userForSession = { id, displayName };
      return userForSession;
    });
    fastifyPassport.registerUserDeserializer(
      async (userFromSession, request) => {
        return userFromSession;
      }
    );
    fastifyPassport.use(
      'google',
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, cb) {
          return cb(null, profile);
        }
      )
    );
    await fastify.register(fastifyStatic, {
      root: path.join(__dirname, 'website'),
    });
    await fastify.register(require('@fastify/formbody'), {
      bodyLimit: 0,
    });
    await fastify.register(require('@fastify/multipart'), {
      limits: {
        fieldSize: 5 * 1024 * 1024,
        fileSize: 5 * 1024 * 1024,
        files: 10,
      },
    });
    fastify.register(router, { prefix: '/v1' });
    fastify.listen({ host: '0.0.0.0', port: PORT });
    fastify.log.info(`App is listening at port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
