const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
    const token = req.cookies.my_token
    try{
        const user = jwt.verify(token,'chetanRahul')
        next()
    }catch(err){
        res.clearCookie('my_token');
        res.redirect('/login')
        return 
    }
}

module.exports = verifytoken