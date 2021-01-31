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
    urlDB = 'mongodb+srv://Ricky:fJaZBAS2b1u5JkAh@cluster0.wj7l3.mongodb.net/Coffee';
}
process.env.URLDB = urlDB;