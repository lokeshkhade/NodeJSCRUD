const express = require('express'); //Load express moudule which returns a function express
const router = express.Router();
const Joi = require('joi');//joi module return a Class and By covention class name start with capital letter
var mysql = require('../mysql');


router.get('/:id', (req, res) => {

    var query = "SELECT * FROM courses WHER id = ?";
    var id = req.params.id;

    mysql.exec(query, [id], function (err, result) {
        if (err) return res.status(404).json(err) ;
        if(result.length==0){
           return res.status(404).send("Course Not Found");
        }
        return res.json(result);
    });

});


router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
    }
    var values = req.body;
    var query = "INSERT INTO courses SET ? ";
    mysql.exec(query, values, function (err, data) {
        if (err) { if (err) res.status(404).send('error'); return; };

        if (data.affectedRows < 1) {
                       res.status(404).send('error'); return;
        }
        res.json({
            id: data.insertId

        });
    });

});



router.put('/:id', (req, res) => {
   

    //Validate Course

    const { error } = validateCourse(req.body);// Object Destructor 

    if (error) {
        res.status(404).send(error.details[0].message);
    }
    var id = req.params.id;
    var values = req.body;
    var query   = "UPDATE courses SET ? WHERE id = ? ";

    // Return Query Status
    mysql.exec(query, [values, id], function (err, data) {
        if (err) { if (err) res.status(404).send('error'); return; };
      if (data.affectedRows < 1) {
        res.status(404).send('error'); return;
      }
      res.json( {success: true });
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
      res.json( {success: true });
    });  
 
});


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);

}



module.exports = router;