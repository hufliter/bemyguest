"use strict";
import * as Exceptions from './Exceptions';

class AbstractCrud {
    constructor() {}
    static get idField(){
        return 'id';
    }

    static get sortFields(){
        return [];
    }

    static _createSearchCondition(params) {
        return {};
    }

    static getSortOptions(sort){
        let sortOptions = {};
        if (!sort){
            return sortOptions;
        }
        if (this.sortFields.indexOf(sort.field || '')!=-1){
            sortOptions ={
                sort:sort.field
            }
            if(['asc', 'desc'].indexOf(sort.order)!=-1){
                sortOptions.sort = sort.field + ' ' + sort.order;
            }
        }
        
        return sortOptions;
    }

    static find(params, sort, page, limit) {
        params = params || {};
        let where = this._createSearchCondition(params);

        return this._find(where, sort, page, limit);
    }
    
    static _find(where, sort, page, limit) {
        let count = this.model.count(where);
        let query = this.model.find(where, this.getSortOptions(sort));

        let paginator = new Paginator(count, query);
        return paginator.paginate(page, limit);
    }

    static findOrFail(id) {
        let where = {
            id: id
        };
        return this.model.findOne(where)
            .then(found => {
                if (!found) {
                    return Promise.reject(new Exceptions.ObjectNotFound('Object does not exist: ' + id));
                }
                return found;
            });
    }

    static findById(id) {
        return this.findOrFail(id);
    }

    static findOne(where) {
        return this.model.findOne(where);
    }


    static create(params, user) {
        if(this.idField in params){
            delete params[this.idField];
        }
        return this.model.create(params)
            .catch(err => {
                return Promise.reject(this.error(err));
            });
    }


    static update(id, params, user) {
        if(this.idField in params){
            delete params[this.idField];
        }
        return this.findOrFail(id)
            .then(item => {
                return this._update(id, params, user);
            });
    }
    
    static _update(id, params, user){
        let where = {
            id: id
        };
        return this.model.update(where, params)
            .then(items => {
                if (!items.length) {
                    return null;
                }
                return items[0];
            })
            .catch(err => {
                return Promise.reject(this.error(err));
            });
    }


    static destroy(id, user) {
        let where = {
            id: id
        };
        return this.findOrFail(id)
            .then(item => {
                return this.model.destroy(where);
            });
    }
    

    static error(err) {
        if (!err.Errors) {
            return err;
        }
        for (var field in err.Errors) {
            var e = new Error();
            e.status = 400;
            e.code = err.Errors[field][0].message;
            e.message = err.Errors[field][0].message;

            return e;
        }
    }
}

module.exports = AbstractCrud;