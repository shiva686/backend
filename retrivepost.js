const app = require('express')();
const knex = require('./database');


app.get('/recentpost' , (req, res) =>{
   knex.select('*').from('blog_posts')
    .orderBy('id', 'desc')
    .limit(5).then(data =>{
      res.send(data);
    });
})

let posts =  (offset) =>{
 let data =  knex.select('*').from('blog_posts')
    .orderBy('id', 'desc')
    .limit(10)
    .offset(offset)
    .then(data => { 
        return data;
    }).catch(e =>{
     
 });
    return data;
}
let offset = 0;
app.get('/getposts' , async (req , res) => {
   let data = await posts(offset);
   if(data != null){
   	  res.send(data);
   }
   else{
   	  res.status(204);
   }
});

let post =  (offset) =>{
 let data =  knex.select('*').from('blog_posts')
    .orderBy('id', 'desc')
    .then(data => { 
        return data;
    }).catch(e =>{
     
 });
    return data;
}
app.get('/allgetposts' , async (req , res) => {
   let data = await post(offset);
   if(data != null){
       res.send(data);
   }
   else{
       res.status(204);
   }
});

app.get('/getpostsmore' , async (req , res) =>{
  offset = offset + 10;
  let data = await posts(offset);
   if(data != null){
   	  res.send(data);
   }
   else{
   	  res.status(204);
   }
});

module.exports = app;