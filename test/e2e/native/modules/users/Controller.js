/**
 * Controller
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = (store, Model) => ({
  createUser (data) {
    const user = new Model(data);

    user.validate();

    return store.createUser(user.toDb())
      .then(result => Model.toModel(result));
  },

  getUser (userId) {
    return store.getUserById(userId)
      .then(result => Model.toModel(result));
  },
});

/* Defines the public output */
exports.inject = {
  name: '$userController',
  deps: [
    'userStore',
    'UserModel',
  ],
};
