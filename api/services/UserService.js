"use strict";
let AbstractCrud = require('./AbstractCrud');
let validator = require('./validators/UserValidator');
import * as Exceptions from './Exceptions';
let utilities = require('../services/UtilitiesService');
let registrationCodeService = require('../services/RegistrationCodeService');

var uuid = require('uuid');
let path = require('path');

class UserService extends AbstractCrud {
    static get model(){
        return User;
    }

    static _createSearchCondition(params){
        let where = {};
        if( params.username ) {
            where['username'] = {
                like: params.username
            }
        }

        if( !params.status ){

        } else {
            let whereOr = [];
            whereOr.push(params.status);
            if( params.show_deleted == 'true' ){
                whereOr.push(UserStatus.DELETED);
                where.status = whereOr;
            } else {
                where.status = params.status;
            }
        }
        return where;
    }

    static find(params, sort, page , limit){
        params = params || {};
        let where = this._createSearchCondition(params);

        let count = this.model.count(where);
        let query = this.model
            .find(where, {sort: 'id desc'})
            .populate('role_id');
        
        let paginator = new Paginator(count, query);
        return paginator.paginate(page, limit);

    }
}