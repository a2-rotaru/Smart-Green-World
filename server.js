// const Joi = require('joi');
// const express = require('express');
// const app = express();
// const mysql = require('mysql');

// app.use(express.urlencoded({extended:true}));

// //Creating connection
// var con = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "",
//     database: "Smart_Green_World_1"
// });
// //posting data
// app.post('/users', (req,res) => {
//    let emp = req.body;
//    var sql ="SET @username =? ;SET @password=?; SET @name =?;SET @email =?";
    
// });


// const courses = [
//     {id: 1, name: 'mama'},
//     {id: 2, name: 'tata'},
//     {id: 3, name: 'alex'},
// ];

// app.get('/', (req,res) => {
//     res.send('Bag pl in ea de treaba');
// });


// app.get('/api/courses',(req,res) => {
//     res.send([courses]);
// });

// app.post('/api/courses', (req,res) => {
//     const { error } =  validateCourse(req.body); 
//     //If invalid, return 400-Bad request
//     if(error) return res.status(400).send(error.details[0].message);
         
//     const course = {
//         id: courses.length + 1,
//         name: req.body.name,
//     };
//     courses.push(course);
//     res.send(course);
// }); 

// app.post('/api/arduino/values', (req,res) => {
//     const {api_key,sensor_name} = req.body;
//     res.status(200).json({key: api_key, name: sensor_name});
// });


// app.put('/api/courses/:id',(req,res) =>{ 
// //Look up the course
// //If noit existing, return 404
//     const course = courses.find(c => c.id === parseInt(req.params.id)); //get the course value
//     if (!course) return res.status(404).send('The course with the given id was not found');

//     const { error } =  validateCourse(req.body); 
//     //If invalid, return 400-Bad request
//     if(error) return res.status(400).send(error.details[0].message);


// //update course
//     course.name=req.body.name;
// //Return the updated course
//     res.send(course);
// });


// app.delete("/api/courses/:id", (req,res) =>{
//     //Look up the course
//     const course = courses.find(c => c.id === parseInt(req.params.id)); //get the course value
//    //not existing, return 404
//     if (!course) return res.status(404).send('The course with the given id was not found');

//     //Delete
//     const index = courses. indexOf(courses);
//     courses.splice(index, 1);


//     //Return the same course
//     res.send(course);
// });

// app.get('/api/courses/:id', (req,res) => {
//    const course = courses.find(c => c.id === parseInt(req.params.id)); //get the course value
//    if (!course) return res.status(404).send('The course with the given id was not found');
//    res.send(course);
// });

// const port = process.env.PORT || 7000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));

// function validateCourse(course){
//     const schema = {
//         name: Joi.string().min(3).required()
//     };

//     return Joi.validate(course, schema);

// }
 