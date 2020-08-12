const app = require('express')();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const knex = require('./database');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');

id = uuidv4();
// app.set('trust proxy', 1);

//secret_key              //
const secret_key = fs.readFileSync('./private.key');
// createing variables
let body , email , password;
app.use(bodyParser.json());

app.post('/auth' ,  (req, res) =>{
   
   let token;
  try{
   if(req.body.data.token != undefined){
      token = req.body.data.token;
     }
   }catch(e){
     if(eq.body.token != undefined){
       token = req.body.token;
     }
  }
   let decoded = jwt.verify(token , secret_key);
   if(decoded.login)
   {
      res.status(200).send()
   }
   else
   {
      res.status(401).send()
   }
});

app.use((req, res ,next) =>{
  const url = req.url;
   let token;
   try{
   if(req.body.data.token != undefined){
      token = req.body.data.token;
     }
   }catch(e){
     if(req.body.token != undefined){
       token = req.body.token;
     }
  }
  if(req.method == 'post')
  {
  if(url != '/accesstoken')
  {
   if(url != '/login')
   {  
       if(url != '/signup')
       {
         if(url != '/retriveblog')
       {
       let decoded = jwt.verify(token , secret_key);
       if(decoded.login)
       {
       res.status(200).send()
       }
       else
       {
       res.status(401).send()
       }
     }
    }
  }
 }
 }
  next();
});

// // sending access token
app.post('/accesstoken' , (req , res) =>{
    let token = jwt.sign({id} , secret_key , { algorithm : "HS256" , expiresIn: '1h'} );
    res.send(token);
});

// sign up 
 app.post('/signup' , (req, res) =>{

     body = req.body; 
     name = body.name; 
     email = body.email;
     // token = body.token;
     password = body.password;

     // let decoded = jwt.verify(token , secret_key);
     // if(decoded.id == id)
     // {
       knex.schema.hasTable('user').then((exists) =>{
       if(!exists)
       {
         knex.schema.createTable('user', function(t) {
               t.text('id');
               t.text('name');
               t.text('email');
               t.text('password');
             }).catch(e => {console.log(e)});
       }
       knex.select('email').from('user').where('email' , email)
      .then(user =>{
        if(user[0] == null){
     	  bcrypt.hash(password , 10 ).
        then((password) =>{
             knex('user').insert({
        	    id:uuidv4(),
            	name,
        	    email,
        	    password
             }).catch(e =>{
                console.log(e); 
           });
          res.status(200);
          res.end();   
   	    });   
      }
      else {
        res.status(401).send('user already exists');
      }
        
     });
   }).catch(e => res.send(e));
  // }
   
    knex.close;

});

 //    login 

app.post('/login' , (req , res) =>{
   try{
     body = req.body.data;
     email = body.email;
     password = body.password;
     token = body.token;
    knex('user').where({email}).select('email' , 'password' , 'id')
        .then(user =>{
         let data = user[0]
         let decoded = jwt.verify(token , secret_key);
         if(decoded.id == id){
            if(data != null){
            bcrypt.compare(password , data.password)
            .then(result =>{
          if(result){
             let logintoken = jwt.sign({login:true , id:data.id} , secret_key , { algorithm : "HS256" , expiresIn: '1y'} );
              res.status(200).send(logintoken);  
              }
              else{
                 res.status(401).send();
              }
            })  
             }
             else{
                res.status(401).send()
             }
          }

      }).catch(e => {
        res.status(401).send()
      });
          
      }catch(e){
   	 res.status(401).send();
   }
    knex.close;
});



// log out
app.get('/logout' , (req , res) =>{
     req.session.destroy();
});

module.exports = app;