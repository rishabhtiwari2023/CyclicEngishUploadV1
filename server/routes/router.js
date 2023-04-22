const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/a', services.homeRoutes);
route.get('/video', services.video);


route.get('/student/MCQgame', services.MCQgame);
route.get('/student/dictionary', services.dictionary);
route.get('/student/login', services.login);
route.get('/student/signup', services.signup);
route.get('/student/course', services.course);
route.get('/student/vocab', services.vocab);
route.get('/student', services.student);

/**
 *  @description add users
 *  @method GET /add-user
 */
route.get('/add-user', services.add_user)
route.get('/about', services.about)
route.get('/', services.a)

/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-user', services.update_user)
route.get('/delete-user', services.delete_user)

// API
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.get('/api/users/:id', services.Rishiupdate);
route.delete('/api/users/:id', controller.delete);


module.exports = route