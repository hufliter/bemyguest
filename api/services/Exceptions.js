"use strict";

export
class ObjectNotFound extends Error {
    constructor() {
        super(...arguments);
        this.status = 404;
        this.code = 'object.notFound';
    }
}