const jwt = require('jsonwebtoken');
require("dotenv").config();
const generateToken = (params) => {
    return jwt.sign(params, process.env.JWT_SECRET, { expiresIn: '30d' })
}
module.exports=generateToken