const express = require('express');
const knex = require('./database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const fs = require('fs');
const app = express()

//server.js
 

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/blogposts/images')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4()+".png");
  }
})

var upload = multer({ storage: storage });

let title , description , images , date , status , body;

app.post('/deletePost' , (req , res)=>{
   let date = req.body.data;
   if(date.length != 0){
     for(let i = 0; i<date.length; i++){
           knex('blog_posts')
              .where('id', date[i]).del()
              .then(re=>{
                   res.status(200).send();
              }).catch(e=>{})
       }
   }
});

app.post('/addpost', upload.single('myfile'), (req , res ) =>{

    body = req.body;
    title = body.title;
    description = body.description;
    date = Date.now();
    imageurl = req.file.filename;
    console.log(imageurl);
    status = body.status;
    id=uuidv4();
    try{
      knex.schema.hasTable('blog_posts').then((exists) =>{
	    	(exists)
        let date = Date().toString();
         if(!exists)
         {
              knex.schema.createTable('blog_posts', function(t) {
               t.increments('id').primary();
               t.string('title', 100);
               t.text('description');
               t.text('imageurl');
               t.text('date');
               t.string('status' , 100)
             }).catch(e => {});
          }

            knex('blog_posts').insert({
                title,
                description,
                imageurl,
                date
          	 }).catch(e => {});

       res.status(200).send();
          knex.close;
    
    }).catch(e =>{ });

    }catch(e){
    	res.status(424).send('something went wrong');
    }

});


module.exports = app;