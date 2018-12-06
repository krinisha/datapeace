const userDetailsController = require('./controllers/userDetailsController');

module.exports = function (app) {
    app.get('/api/users', userDetailsController.listUsers);
    app.post('/api/users', userDetailsController.addNewUser);
    app.put('/api/users/:uid', userDetailsController.updateUserById);
    app.get('/api/users/:uid', userDetailsController.getUserById);
    app.delete('/api/users/:uid', userDetailsController.deleteUserById);
};