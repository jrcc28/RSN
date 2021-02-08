const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const User = require('../models/users');
const Product = require('../models/product');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded'
            }
        });


    // Valid types
    let validTypes = ['users', 'products'];
    if (validTypes.indexOf(type) < 0) { // extension is not in the valid extensions
        return res.status(400).json({
            ok: false,
            err: {
                message: `Type: '${type}' not valid. Valid types are: ` + validTypes.join(' ')
            }
        });
    }

    let uploadFile = req.files.file;

    // Valid extensions
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    let splitName = uploadFile.name.split('.');
    let extension = splitName[splitName.length - 1];
    extension = extension.toLowerCase();

    if (validExtensions.indexOf(extension) < 0) { // extension is not in the valid extensions
        return res.status(400).json({
            ok: false,
            err: {
                message: `File extension: '${extension}' not valid. Valid extensions are: ` + validExtensions.join(' ')
            }
        });
    }

    // Change name file
    let newNameFile = `${id}-${new Date().getMilliseconds()}.${extension}`

    uploadFile.mv(`uploads/${type}/${newNameFile}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Update img loaded
        if (type === 'users')
            imgUser(id, res, newNameFile);
        else
            imgProduct(id, res, newNameFile);
    })
});

/**
 * Update img user
 * @param {UserDB id} id 
 */
function imgUser(id, res, nameFile) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(nameFile, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            deleteFile(nameFile, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exists'
                }
            });
        }

        deleteFile(userDB.img, 'users');
        userDB.img = nameFile;
        userDB.save((err, updateUser) => {
            res.json({
                ok: true,
                user: updateUser,
                img: nameFile
            });
        });
    });
}


function imgProduct(id, res, nameFile) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(nameFile, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteFile(nameFile, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product does not exists'
                }
            });
        }

        deleteFile(productDB.img || 'none', 'products');
        productDB.img = nameFile;
        productDB.save((err, updateProduct) => {
            res.json({
                ok: true,
                product: updateProduct,
                img: nameFile
            });
        });
    });
}

function deleteFile(nameImg, type) {
    // create path to the img
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${nameImg}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;