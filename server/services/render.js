const axios = require('axios');
// https://github.com/akashyap2013/CRUD_Application_Node===https://www.youtube.com/watch?v=W1Kttu53qTg

exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}
exports.a = (req, res) => {
    
            res.render('a');
      
}

exports.add_user = (req, res) =>{
    res.render('add_user');
}
exports.about = (req, res) =>{
    res.render('about');
}
exports.video = (req,res) =>{
    res.render('video');
}


// student 
exports.MCQgame = (req, res) =>{
    res.render('MCQgame');
}
exports.student = (req, res) =>{
    res.render('student');
}
exports.dictionary = (req, res) =>{
    res.render('dictionary');
}
exports.login = (req, res) =>{
    res.render('login');
}
exports.signup= (req, res) =>{
    res.render('signup');
}
exports.course = (req, res) =>{
    res.render('course');
}
exports.vocab = (req, res) =>{
    res.render('vocabAmerican');
}
exports.Rishiupdate = (req, res) =>{
    s= req.query.id 
    axios.put('http://localhost:3000/api/users/'+s)
        .then(function(){
            res.render("index")
        })
}


exports.update_user = (req, res) =>{
    axios.get('http://localhost:3000/api/users', { params : { id : req.query.id }})
        .then(function(userdata){
            res.render("update_user", { user : userdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}
exports.delete_user = (req, res) =>{
     s= req.query.id 
    axios.delete('http://localhost:3000/api/users/'+s)
        .then(function(){
            res.render("index")
        })
        .catch(err =>{
            res.send(err);
        })
}
