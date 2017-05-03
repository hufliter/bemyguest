/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getUsers: function (req, res) {
    return res.json('Hi getUsers');
  },

  getUserDetail: function (req, res) {
    return res.json('Hi getUserDetail');
  },

  createUser: function (req, res) {
    return res.json('Hi createUser');
  },
  editUser: function (req, res) {
    return res.json('Hi editUser');
  },
  deleteUser: function (req, res) {
    return res.json('Hi deleteUser');
  }
};
