const fs = require('fs');
module.exports = {
    getTicket: (req, res) => {
        let query ="SELECT * FROM ticket ORDER BY id ASC"

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }

            res.render('ticket.ejs', {
             
                ticket: result
            });
        });
        
    },
    
    addTicketPage: (req, res) => {
        res.render('add-ticket.ejs', {
            title: "Welcome to Socka | Add a new Ticket",
            message: ''
        });
    },
    
    addTicket: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }
    
        let message = '';
        let topic = req.body.topic;
        let zoneID = req.body.zoneID;
        let locID = req.body.locID;
        let detail = req.body.detail;
        let assigneeID = req.body.assigneeID;
        let name = req.body.name;
        let floor = req.body.floor;
        let userID = req.body.userID;
        let adminID = req.body.adminID;
       
        var date = new Date();
        var dateStr =
          ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
          ("00" + date.getDate()).slice(-2) + "/" +
          date.getFullYear() + " " +
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2) + ":" +
          ("00" + date.getSeconds()).slice(-2);

        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name =name + '.' + fileExtension;

       // let usernameQuery = "SELECT * FROM `ticket`";
        let usernameQuery = "SELECT * FROM `ticket` WHERE topic = '" + topic + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Topic already exists';
                res.render('add-ticket.ejs', {
                    message,
                    //title: "Welcome to Socka | Add a new user"
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
                        let query = "INSERT INTO `ticket` (userID, adminID, dt, topic, detail, attach, zoneID, floor, locID, assigneeID, score, comment, buildingID) VALUES ('" +
                        userID + "', '" + userID + "', '" + dateStr + "','" + topic + "', '" + detail + "', '" + image_name + "', '" + 
                        zoneID + "', '" + floor + "', '" + locID + "', '" + assigneeID + "', '" + zoneID + "', '" + zoneID + "', '" + zoneID + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/ticket');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-ticket.ejs', {
                        message,
                       // title: "Welcome to Socka | Add a new user"
                    });
                }
            }
            
        });       
    },
    
    editTicketPage: (req, res) => {
        let ticketId = req.params.id;
        let query = "SELECT * FROM `ticket` WHERE id = '" + ticketId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-ticket.ejs', {
                title: "Edit ticket",
                ticket: result[0],
                message: ''
            });
        });
    },
    
    editTicket: (req, res) => {
        let ticketId = req.params.id;
        let topic = req.body.topic;
        let zoneID = req.body.zoneID;
        let locID = req.body.locID;
        let detail = req.body.detail;
        let assigneeID = req.body.assigneeID;
        let floor = req.body.floor;
        let userID = req.body.userID;
    
        let query = "UPDATE `ticket` SET `topic` = '" + topic + "', `zoneID` = '" + zoneID +
         "', `locID` = '" + locID + "', `assigneeID` = '" + assigneeID + "', `detail` = '" + detail + "', `floor` = '" + floor + "', `userID` = '" + userID + "' WHERE `ticket`.`id` = '" + ticketId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/ticket');
        });
    },
    deleteTicket: (req, res) => {
        let userId = req.params.id;
        let getImageQuery = 'SELECT attach from `ticket` WHERE id = "' + ticketId + '"';
        let deleteUserQuery = 'DELETE FROM ticket WHERE id = "' + ticketId + '"';
    
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
                    res.redirect('/ticket');
                });
            });
        });
    }
    
}