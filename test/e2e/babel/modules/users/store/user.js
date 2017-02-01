/**
 * user
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default sqlite => ({
  createUser: data => sqlite
    .insert('users', data),

  getUserById: userId => sqlite
    .get('users', { id: userId }, 1)
    .then(result => result[0]),

});

export const inject = {
  name: 'userStore',
  deps: [
    '$SQLiteResource',
  ],
};
