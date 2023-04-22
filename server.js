const express = require('express');var bodyParser = require("body-parser")
const dotenv = require('dotenv');
const morgan = require('morgan');
var mongoose = require("mongoose")
const bodyparser = require("body-parser");
const path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session')
// require('./passport-setup');


// const cors = require('cors');
const connectDB = require('./server/database/connection');
const jwt = require('jsonwebtoken');
var jsonParser = bodyParser.json();
// var mongoose = require("mongoose")
// const User = require('./models/user')
const cors = require('cors');
var mongodb = require('mongodb');
const app = express();
app.use(express.static(__dirname+'public'))
dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080
var ObjectID = require('mongodb').ObjectID;
var{ObjectID } = require('mongodb');
app.use(cors());
// google

// app.use(cookieSession({
//     name: 'tuto-session',
//     keys: ['key1', 'key2']
//   }))
//   const isLoggedIn = (req, res, next) => {
//     if (req.user) {
//         next();
//     } else {
//         res.sendStatus(401);
//     }
// }
// app.use(passport.initialize());
// app.use(passport.session());
// // app.get('/', (req, res) => res.render('pages/index'))
// app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// // In this route you can see that if the user is logged in u can acess his info in: req.user
// app.get('/good', isLoggedIn, (req, res) =>{
//     res.render("pages/profile",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
// })

// // Auth Routes
// app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/good');
//   }
// );

// app.get('/logout', (req, res) => {
//     req.session = null;
//     req.logout();
//     res.redirect('/');
// })

























// const path = require("path")
const multer = require("multer")
app.use(bodyParser.json())
app.use(bodyparser.urlencoded({
    extended:true
}))

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// https://ashwanibakshii.blogspot.com/2019/11/upload-and-download-file-in-node_2.html?zx=8f63dd4a5eba17a9
var storage = multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,'./public/uploads')
    },
    filename(req,file,cb){
        cb(null,file.originalname)
    }
})

var upload = multer({storage:storage});

//  mongoose.connect('mongodb://localhost:27017/pics',{useNewUrlParser:false})
//  .then(()=>console.log('connect')).catch(err=>console.log(err))

// making the collection(table) schema
// it contain picspath file for saving the file path
var picSchema = new mongoose.Schema({
    picspath:String,
    name:String
})

//collection schema will be save in db by name picsdemo 
// picModel contain the instance of picdemo by which it can manipulate data in it.
 var picModel = mongoose.model('picsdemo',picSchema)


app.set('view engine','ejs');

app.set("views",path.resolve(__dirname,'views'));

var picPath = path.resolve(__dirname,'public');

app.use(express.static(picPath));

app.use(bodyparser.urlencoded({extended:false}))
app.get('/gallery',(req,res)=>{res.render('gallery')});
app.get('/up',(req,res)=>{
    picModel.find((err,data)=>{
             if(err){
                 console.log(err)
             }
            if(data){
                console.log(data)
                res.render('home',{data:data})
            } 
           else{
               res.render('home',{data:{}})
           } 
    })
    
})

app.post('/up',upload.single('pic'),(req,res)=>{
    var x= 'uploads/'+req.file.originalname;
    var picss = new picModel({
        picspath:x,name:req.file.originalname
    })
    picss.save((err,data)=>{
         if(err){
             console.log(err)
         }
         else{
             console.log('data',data)
            res.redirect('/up')
         }
    })
})

app.get('/download/:id',(req,res)=>{
     picModel.find({_id:req.params.id},(err,data)=>{
         if(err){
             console.log(err)
         } 
         else{
            var path= __dirname+'/public/'+data[0].picspath;
            res.download(path);
         }
     })
})

module.exports = app;








mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))
// weldone
app.get("/table", (req, res) => {
    db.collection('details').find({}).toArray((err, result) => {
        if (err) throw err
        results = result
        console.log(results)
        res.send(results[1].name)
    })
});
app.get('/hello',function(req,res)
{
res.send('Hello World!');
});
// app.get("/getAll", async (req, res) => {
//     console.log(req)
//     db.collection('details').find({}).toArray((err,result)=>{
//         if(err)throw err 
//         results=result

//         console.log("getall")
//         res.send(results)
//     })
// });
// app.post("/getAll", async (req, res) => {
//     a = req.body.da;
//     console.log(a)
//     var myobj = { StudentName: req.body.da };
//     db.collection('details').findOne(myobj, function (err, results) {
//         if (err) throw err;

//         console.log(results); res.send(results)
//     })
// });

app.post("/loginA", async function (req, res) {
    // try {

    // check if the user exists
    const rea = req.body
    const user = await db.collection('details').findOne({ email: req.body.email });
    if (user != null) {
        // token
        let re = ""; console.log("lo", user);
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        jwt.sign({ rea }, jwtSecretKey, { expiresIn: '3000s' }, (err, token) => {
            // res.json({ token })

            console.log("lo")
            // 
            //check if password matches
            const result = req.body.password === user.password;
            if (result) {
                console.log("lo", user, token);
                res.json({ token })
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        });
    }
    else {
        res.status(400).json({ error: "User doesn't exist" });
    }


    // } catch (error) {
    //     res.status(400).json({ error });
    // }
})

app.post("/signup1", async function (req, res) {
    // check if the user exists
    var data1 = { "id": "dashboard", "StudentSection": ["Home", "Profile", "status", "Contact"], "EmplyeeSection": ["Home", "Profile", "JobStatus", "Contact"] };

    console.log(req.body.username);
    const user = await db.collection('details').findOne({ email: req.body.email });
    const mobile = await db.collection('details').findOne({ mobile: req.body.lastname });
    // console.log(user, mobile);
    if (user == null && mobile == null) {
        var name = req.body.username;
        var email = req.body.email;
        var pass = req.body.password;
        var phone = req.body.lastname;

        var data = {
            "name": name,
            "email": email,
            "password": pass,
            "phone": phone
        }
        var data1 = { "id": "dashboard", "StudentSection": ["Home", "Profile", "status", "Contact"], "EmplyeeSection": ["Home", "Profile", "JobStatus", "Contact"] };
        db.collection('details').insertOne(data, function (err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully", collection);
            res.send(collection);

        });
    }


})
app.post("/update", async (req, res) => {
    // console.log(req.body.name)
    // console.log(req.body.age)
    // var myobj = { name:req.body.name , address: req.body.newAge };
    var query = { studentCode: req.body.studentCode };
    var badlo = { $set: { name: req.body.name, age: req.body.age, email: req.body.email, mobile: req.body.mobile } }
    db.collection("details").updateMany(query, badlo, function (err, result) {
        if (err) throw err;
        console.log("update");;
        // db.close();
    });

});

app.post("/post", async (req, res) => {
    // console.log(req.body.name)
    // console.log(req.body.age)
    var myobj = {
        name: req.body.name, age: req.body.age, email: req.body.email, mobile: req.body.mobile, studentCode: req.body.studentCode, createdAt: new Date(),
        updatedAt: new Date()
    };
    db.collection("details").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted hah");

    })
});
app.post("/delete", async (req, res) => {
    // console.log(req.body.name)
    console.log(req.body.studentCode)
    var r = req.body.studentCode

    var myobj = { studentCode: r };
    // var myobj={name:"rishabh"};
    db.collection("details").deleteOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document deletedd hah");

    })
});
// app.post("/sign_up",(req,res)=>{
//     var name = req.body.name;
//     var email = req.body.email;
//     var phno = req.body.phno;
//     var ta = req.body.ta;
//     var password = req.body.password;

//     var data = {
//         "name": name,
//         "email" : email,
//         "phone": phno,
//         "ta":ta,
//         "password" : password
//     }

//     db.collection('details').insertOne(data,(err,collection)=>{
//         if(err){
//             throw err;
//         }
//         console.log("Record Inserted Successfully");
//     });

//     return res.redirect('signup_success.html')

// })


// app.get("/",(req,res)=>{
//     res.set({
//         "Allow-access-Allow-Origin": '*'
//     })
//     return res.redirect('index.html');
// }).listen(3000);




// app.post("/register", function (req, res) {
//     var name = req.body.name
//     var password = req.body.password

//     db.collection('details').findOne({email:email});
//     if(u.password===password){
//         res.redirect('signup_success.html');
//     }
// });
app.post("/register", function (req, res) {
    console.log("fsfs")
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        username: "risabh",
        time: Date(),
        userId: 12,
    }
    // console.log("fail")

    jwt.sign({ data }, jwtSecretKey, { expiresIn: '3000s' }, (err, token) => {
        res.json({ token })
    });

    // res.send({ token });
    // console.log(token)
})

app.get("/user/validateToken", async (req, res) => {
    // Tokens are generally passed in the header of the request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header("Authorization");

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});
app.post("/profile1", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if (err) { res.send({ result: "invalid token" }) }
        else {
            const student = await db.collection('details').findOne({ "StudentName": "aks" });
            res.json(student);
        }
    })
})
app.post("/postEmplyees", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if (err) { res.send({ result: "invalid token" }) }
        else {
            console.log(req.body);
            db.collection('EmployeeAng').insertOne(req.body, function (err, collection) {
                if (err) throw err;
                console.log("Record inserted Successfully", collection);
                d = [collection]
                res.json(collection);

            });
            //const student = await db.collection('details').findOne({ "StudentName": "aks" });
            //res.json(student);
        }
    })
})
app.get("/postEmplyees", verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if (err) { res.send({ result: "invalid token" }) }
        else {
            console.log(req.body);
            db.collection('EmployeeAng').find({}).toArray(function (err, collection) {
                if (err) throw err;
                console.log("fetched Successfully", collection);
                res.json(collection);

            });

        }
    })
})
app.delete("/postEmplyees/:id", verifyToken, async (req, res) => {
    var id = req.params.id;
    console.log(id)
    var doc1={      
firstname:id
    }
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if (err) { res.send({ result: "invalid token" }) }
        else {
            db.collection('EmployeeAng').deleteOne(doc1, (err, doc) => {
                if (!err) {
                    res.send(doc)
                } else {
                    console.log('Failed to Delete user Details: ' + err);
                }
            });
        }

        
    })
})

app.post("/profile", verifyToken, async (req, res) => {
    jwt.verify(req.token, req.secret, async (err, authData) => {

        if (err) {
            console.log("fail")
            res.send({ result: "invalid token" })
        }

        else {

            res.send({ result: true });
            // res.send({
            //     result: "valid"
            // })
        }
    })
})
async function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        const secret = bearer[2];
        req.secret = secret;
        req.token = token; console.log("fail")
        next();
    } else {
        res.send({ result: "token  gaf invalid" })
    }
    

}







// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

// load routers
app.use('/', require('./server/routes/router'))

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});