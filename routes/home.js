const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();



// First argument in get fuction is url or path.second parameter is a callback function which is called when we have http request to this endpoint '/'.This req object has bunch of properties ex.re
router.get('/', (req, res) => {
    res.send("Hello World");
});

module.exports = router;