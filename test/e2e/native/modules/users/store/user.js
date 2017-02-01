/**
 * user
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = sqlite => ({
  createUser: data => sqlite
    .insert('users', data),

  getUserById: userId => sqlite
    .get('users', { id: userId }, 1)
    .then(result => result[0]),

});

exports.inject = {
  name: 'userStore',
  deps: [
    '$SQLiteResource',
  ],
};
