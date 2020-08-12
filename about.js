const express = require('express');
const app = express();
const knex = require('./database');
const fs = require('fs')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const serveStatic = require('serve-static');

var id , name , email , contact , about , body;


// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile/images')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4()+".png");
  }
})

var upload = multer({ storage: storage });

const secret_key = fs.readFileSync('./private.key');
app.post('/about', upload.single('myfile'), (req , res)=>{


knex.schema.hasTable('about').then((exists) =>{
       
     body = req.body
	   name = body.name;
	   email = body.email;
	   contact = body.contact;
	   about = body.about;
       if(!exists)
       {
     knex.schema.createTable('about', function(t) {
               t.text('id');
               t.text('name');
               t.text('email');
               t.text('contact');
               t.text('about')
               t.text('profile_pic')
             }).catch(e => {console.log(e)});
       }
     knex.select('email').from('about').where('email' , email)
     .then(user => {
     if(user[0] == null)
     {
     profile_pic = req.file.filename;
     id = req.body.token
     let decoded = jwt.verify(id , secret_key);
     id = decoded.id
       knex('about').insert({
           id,
           name,
           email,
           contact,
           about,
           profile_pic
       }).then(re =>{
     	res.status(200).send();
        }).catch(e =>{
     	res.status(404).send();
       })
      }else{
      try{
       if(req.file.filename != undefined)
        {
        profile_pic = req.file.filename;
      	knex('about')
      	.where('email' , email)
      	.update({
      		id,
           name,
           email,
           contact,
           about,
           profile_pic
      	}).catch(e =>{console.log(e)})
         }
       }catch(e){
          try{
           knex('about').where('email' , email)
          .update({
           id,
           name,
           email,
           contact,
           about,
       }).then(re =>{
         res.status(200).send();
        }).catch(e =>{
         res.status(404).send();
       })
       }catch(e){
           res.status(404).send();
        }
      }
     }
      });
   });

});

const options ={

}

app.get('/retriveabout',(req , res)=>{
    app.use(serveStatic('uploads/profile/images'));
     knex('about').select('name','email','contact','about' ,'profile_pic')
     .then(about =>{
     	let data = about[0];
      res.status(200).send(data);
     }).catch(e =>{ console.log(e) });

});

module.exports = app;