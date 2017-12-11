//Defines the data structure of a 'Response' object
'use strict';
module.exports = class Response {
    constructor(success /*  boolean  */ , message /*  string  */ , data /*  object  */ ) {
        this.success = success;
        if (message) this.message = message;
        if (data) this.data = data;
    }
};