"use strict";
import * as Exceptions from './Exceptions';
let AbstractCrud = require('./AbstractCrud');

let utilities = require('../services/UtilitiesService');

class PermissionService extends AbstractCrud {
    static checkPermission(controller, action, permissions, user, method) {
        var has_access = 0;
        var data = {};

        if (!user) {
            return Promise.resolve(false);
        }
        if (user.is_administrator==1) {
            return Promise.resolve(true);
        }

        var objectController = utilities.getProperTy(permissions, controller);
        var nameFeature = utilities.getProperTy(objectController, action);
        sails.log.debug(controller, action, nameFeature);

        var listFeatureId = [];
        let where = {
            name: nameFeature
        }
        
        return Feature.find(where)
                .then(features => {
                    if( !features ){
                        return Promise.resolve(false);
                    }
                    for(var i = 0; i< features.length; i++){
                        listFeatureId.push(features[i].id);
                    }
                    return this._getListRolePermission(user.role_id, data , listFeatureId);
                })
    }

    static _getListRolePermission(id, data, listFeatureId){
        if (!id) {
            return Promise.resolve(false);
        }
        let where = {
            role: id,
            feature: listFeatureId
        };

        return RolePermission.find(where)
                .then(roles => {
                    if( !roles ){
                        return Promise.resolve(false);
                    }
                    for(var i = 0 ; roles.length; i++){
                        if( roles[i].has_access == 1 ){
                            return Promise.resolve(true);
                        }
                    }
                    return Promise.resolve(false);
                });
    }

    static checkPermissionForDeleted(nameFeature, user) {
        var has_access = 0;
        var sql = "SELECT rp.has_access FROM feature f" +
                    " LEFT JOIN role_permission rp ON rp.feature_id = f.id " +
                    " WHERE f.name = ? AND rp.role_id = ?";

        return new Promise((resolve, reject)=>{
            Feature.query(sql, [nameFeature, user.role_id], function(err, results) {
              if (err) return reject(err);
                var parser =  JSON.stringify(results);
                parser = JSON.parse(parser);
                if (parser.length!=0) {
                    has_access = parser[0].has_access;   
                }
                return resolve(has_access);
            });
        });
    }
}