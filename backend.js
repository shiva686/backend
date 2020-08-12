const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const auth  = require('./auth');
const addpost = require('./addpost')
const path = require('path');
const retrivepost = require('./retrivepost')
const about = require('./about')
const blog = require('./blogdes');
let port = process.env.PORT || 5000;
const serveStatic = require('serve-static');

app.use(serveStatic('uploads/blogeposts/images'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/uploads/blogposts/images')));
app.use(blog)
app.use(auth);
app.use(addpost);
app.use(retrivepost);
app.use(about)

app.get('/hello' , (req , res)=>{
	res.send('hello world');
})
app.listen(port);