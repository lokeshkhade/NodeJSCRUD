const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');


router.get('/getCourses', async (req, res) => {

    var query = "SELECT * FROM courses";

    try {
        let result = await mysql.exec(query);
        if (result.length == 0) {
            return res.status(404).send("Course Not Found");
        }
        return res.json(result);
    } catch (err) {

        return res.status(404).json(err);
    }
});

router.get('/getCourseById/:id', async (req, res) => {
    var id = req.params.id;
    if (id === null)
        var query = "SELECT * FROM courses WHERE id = ?";

    try {
        let result = await mysql.exec(query, [id]);
        if (result.length == 0) {
            return res.status(404).send("Course Not Found");
        }
        return res.json(result);
    } catch (err) {

        return res.status(404).json(err);
    }
});





router.post('/', async (req, res) => {
    console.log(req.body);
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
    }
    var values = req.body;
    var query = "INSERT INTO courses SET ? ";

    try {

        let data = await mysql.exec(query, values);
        res.json({
            id: data.insertId

        });
    } catch (err) {

        return res.status(404).json(err);
    }


});



router.put('/:id', (req, res) => {


    //Validate Course

    const { error } = validateCourse(req.body);// Object Destructor 

    if (error) {
        res.status(404).send(error.details[0].message);
    }
    var id = req.params.id;
    var values = req.body;
    var query = "UPDATE courses SET ? WHERE id = ? ";

    // Return Query Status
    mysql.exec(query, [values, id], function (err, data) {
        if (err) { if (err) return res.status(404).send('error'); };
        if (data.affectedRows < 1) {
            return res.status(404).send('error');
        }
        res.json({ success: "Data" });
    });

});



router.delete('/:id', (req, res) => {

    var id = req.params.id;
    var query = "DELETE FROM courses WHERE id = ?";
    mysql.exec(query, [id], function (err, data) {
        if (err) { if (err) res.status(404).send('error'); return; };
        if (data.affectedRows < 1) {

            res.status(404).send('error'); return;
        }
        res.json({ success: true });
    });

});


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    }).unknown(true);
    return schema.validate(course);

}



module.exports = router;