"use strict";
let AbstractCrud = require('./AbstractCrud');
import * as Exceptions from './Exceptions';

class RegistrationCodeService extends AbstractCrud {
    static get model(){
        return RegistrationCode;
    }
}

module.exports = RegistrationCodeService;