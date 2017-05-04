/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";

let service = require('../services/UserService');
let permissionService = require('../services/PermissionService');

module.exports = {
  _config: {
    actions: false,
    rest: false,
    shortcuts: false
  },

  validateFind: function (params, sort, page, limit, user, res) {
    if (params.show_deleted == 'false' || (typeof params.show_deleted == 'undefined')) {
      return service.find(params, sort, page, limit)
        .then(pagination => res.paginate(pagination))
        .catch(err => res.error(err));
    }
    return Promise.resolve(permissionService.checkPermissionForDeleted('settings/users/view-deleted-user', user))
      .then(result => {
        if (params.show_deleted == 'true' && !result && user.is_administrator != 1) {
          return res.send(403, {
            code: 'E_NO_PERMISSION',
            message: 'No Permission Access'
          });
        }
        return service.find(params, sort, page, limit)
          .then(pagination => res.paginate(pagination))
          .catch(err => res.error(err));
      });
  },

  getUsers: function (req, res) {
    var limit = parseInt(req.param('limit', 0));
    var page = parseInt(req.param('page', 1));

    limit = isNaN(limit) ? 0 : limit;
    page = isNaN(page) ? 0 : page;

    var search = req.params.all();
    let user = req.session.user;
    var sort = {
      field: req.param('sortBy', 'number'),
      order: req.param('sortOrder', 'asc')
    };

    return Promise.resolve(this.validateFind(search, sort, page, limit, user, res));
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
