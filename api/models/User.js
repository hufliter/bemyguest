/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('uuid');
module.exports = {

  autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'user',
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            size: 20
        },
        version: {
            type: 'integer',
            size: 20,
            defaultsTo: 0
        },
        username: {
            required: true,
            unique: true,
            type: 'email',
            size: 255
        },
        password: {
            required: false,
            type: 'string',
            size: 255,
        },
        first_name: {
            required: true,
            type: 'string',
            size: 255
        },
        last_name: {
            required: true,
            type: 'string',
            size: 255
        },
        role_id: {
            required: true,
            type: 'integer',
            model: 'Role'
        },
        status: {
            type: 'string',
            size: 225
        },
        uuid: {
            // required: true,
            unique: true,
            type: 'string',
            size: 255
        },
        date_created: {
            required: false,
            type: 'datetime',
        },
        is_administrator: {
            type: 'integer',
            size: 1,
            defaultsTo: 0
        },
        isDeleted: function(){
            return (this.status == UserStatus.DELETED);
        },
        
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    accountSystem: function(id){
        if (id == 1 || id == 2) {
            return true;
        }
        return false;
    },
    
    beforeUpdate: function(values, next) {
        next();
    },

    beforeCreate: function(values, next) {
        values.status = UserStatus.INACTIVE;
        values.date_created = new Date();
        values.uuid = uuid.v4();
        next();
    }
};

