const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const serveStatic = require('serve-static');
const knex = require('./database');

const secret_key = fs.readFileSync('./private.key');

app.post('/blog' , (req , res)=>{

  	let token = req.body.data.token;
    let decoded = jwt.verify(token , secret_key);
    let id = decoded.id;
    let blog_desc = req.body.data.blog_desc;
    let blog_name = req.body.data.blog_name;


  knex.schema.hasTable('blog').then(function(exists)
   {
     if (!exists) {
     knex.schema.createTable('blog', function (table) {
      table.text('id').primary();
      table.text('blog_name');
      table.text('blog_desc');
      }).catch(e => {console.log(e)});
     }
     knex.select('*').from('blog').where('id' , id)
     .then(user =>{
          knex('blog').insert({
            id,
            blog_name,
            blog_desc
          }).then(done =>{
          }).catch(
             re =>{
              knex('blog').where('id',id).update({
                blog_name,
                blog_desc
              }).then(e => {res.send();})
          });
     })
   
  });
});

app.post('/retriveblog' ,(req , res)=>{
   knex.select('id', 'blog_name', 'blog_desc').from('blog')
   .then(user=>{
     const data = user[0];
     res.send(data);
   })

});

module.exports = app;