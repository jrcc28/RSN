/**
 * Port:
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Environment:
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * MongoDB:
 */
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/**
 * ExpiresIn Token:
 */
process.env.EXPIRES_IN = '12h';

/**
 * Seed:
 */
process.env.SEED = process.env.SEED || 'secret-dev';


/**
 * Google Client ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '853750050076-f15bm5hspf281mj87f6f57f6v5tke6jl.apps.googleusercontent.com'