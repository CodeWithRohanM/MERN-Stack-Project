const express = require("express");
const router = new express.Router();
const userData = require("../Model/userDataModel");


router.post("/users", async (req, res) => {
    try {
        const insertData = new userData(req.body);

        const getData = await insertData.save();
        res.status(201).send(getData);
    } catch (err) {
        res.status(404).send(err);
    }

});


// router.post("/register", (req, res)=>{
//     const getFirstName = req.body.firstName;
//     console.log(getFirstName);
// })

module.exports = router;