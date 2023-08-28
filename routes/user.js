const fs = require('fs');
module.exports = {
    getUser: (req, res) => {
        let query ="SELECT * FROM user ORDER BY id ASC"

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }

            res.render('user.ejs', {
                title: "Welcome to Socka | View Users",
                users: result
            });
        });
    },
    addUserPage: (req, res) => {
        res.render('add-user.ejs', {
            title: "Welcome to Socka | Add a new user",
            message: ''
        });
    },
    
    addUser: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }
    
        let message = '';
        let name = req.body.name;
        let email = req.body.email;
        let telnum = req.body.telnum;
        let orgID = req.body.orgID;
        let type = req.body.type;
        let password = req.body.password;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = name + '.' + fileExtension;
    
        let nameQuery = "SELECT * FROM `user` WHERE name = '" + name + "'";
    
        db.query(nameQuery, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
    
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-user.ejs', {
                    message,
                    title: "Welcome to Socka | Add a new user"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `user` (name, email, orgID, password, telnum, image, type) VALUES ('" +
                        name + "', '" + email + "', '" + orgID + "', '" + password + "', '" + telnum + "', '" + image_name + "', '" + type + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/user');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-user.ejs', {
                        message,
                        title: "Welcome to Socka | Add a new user"
                    });
                }
            }
        });
    },
    
    editUserPage: (req, res) => {
        let userId = req.params.id;
        let query = "SELECT * FROM `user` WHERE id = '" + userId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-user.ejs', {
                title: "Edit User",
                user: result[0],
                message: ''
            });
        });
    },
    
    editUser: (req, res) => {
        let userId = req.params.id;
        let name = req.body.name;
        let email = req.body.email;
        let orgID = req.body.orgID;
        let telnum = req.body.telnum;
    
        let query = "UPDATE `user` SET `name` = '" + name + "', `email` = '" + email + "', `orgID` = '" + orgID + "', `telnum` = '" + telnum + "' WHERE `user`.`id` = '" + userId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/user');
        });
    },
    
    deleteUser: (req, res) => {
        let userId = req.params.id;
        let getImageQuery = 'SELECT image from `user` WHERE id = "' + userId + '"';
        let deleteUserQuery = 'DELETE FROM user WHERE id = "' + userId + '"';
    
        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
    
            let image = result[0].image;
    
            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/user');
                });
            });
        });
    }
}
/*const express = require("express");

const router = express.Router();

const homeController = require('../controllers/home.controller');

router.get('/', homeController.getHomePage);

module.exports = router;*/