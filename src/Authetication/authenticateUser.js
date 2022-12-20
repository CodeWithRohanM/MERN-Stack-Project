const jwt = require("jsonwebtoken");
const userData = require("../Model/userDataModel");


const authorize = async (req, res, next) => {
    try {
        const getToken = req.cookies.logInCookie;
        console.log("LOG IN -> " + getToken);
        const verifyUser = jwt.verify(getToken, process.env.SECRET_KEY);

        

        const getData = await userData.findOne({_id: verifyUser.id});
        console.log("Name = "+getData.firstName);
        console.log(verifyUser);




        // Adding this to access the getToken & getData values inside our app.get("/signOut") section in app.js 
        req.token = getToken;
        req.getData = getData;




        next();
    } catch (err) {
        res.send("<h1>Could Not Authenticate User, Please Try Again</h1>");
    }

};

module.exports = authorize;