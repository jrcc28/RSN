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
 * seg min h days
 * 60 * 60 * 24 * 30
 */
process.env.EXPIRES_IN = 60 * 60 * 24 * 30;

/**
 * Seed:
 */
process.env.SEED = process.env.SEED || 'secret-dev';