const express = require('express');
const bodyParser = require('body-parser');

let { verifyToken } = require('../middlewares/authentication')
let app = express();
const Product = require('../models/product');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

/**
 * Get all products
 */
app.get('/product', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ disponibility: true })
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) { // If product wasn't created
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        })

})

/**
 * Get product by id
 */
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) { // If product wasn't created
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id not found'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        })
})

/**
 * Search product
 */
app.get('/product/search/:text', verifyToken, (req, res) => {

    let text = req.params.text;

    let regex = new RegExp(text, 'i'); // i : not case-sensitive

    Product.find({ name: regex })
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id not found'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        })
});

/**
 * Create product
 */
app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id
    })

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) { // If product wasn't created
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    })

})

/**
 * Update product
 * Params: id of the product to update
 */
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;

    let data = {
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        disponibility: body.disponibility || true,
        category: body.category
    }

    Product.findByIdAndUpdate(id, data, { new: true, runValidators: true, useFindAndModify: false }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) { // If category wasn't created
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    })
})

/**
 * Delete - Remove
 * Change product disponibility to false.
 */
app.delete('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findByIdAndUpdate(id, { disponibility: false }, { new: true, runValidators: true, useFindAndModify: false }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) { // If category wasn't created
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB,
            message: 'Product was deleted'
        });
    })
});

module.exports = app