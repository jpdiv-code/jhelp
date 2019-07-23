'use strict';

const v8 = require('v8');

module.exports = class JHelper {
    /**
     * Create JHelper instance.
     */
    constructor() { }

    /**
     * Deep clone any value
     * First tries using v8, in case of error it tries with JSON
     * @param {Any value} value 
     */
    deepClone(value) {
        try {
            return v8.deserialize(v8.serialize(value));
        } catch {
            try {
                return JSON.parse(JSON.stringify(value));
            } catch (err) {
                throw err;
            }
        } 
    }

    /**
     * Suspends the asynchronous function for a specified time
     * @param {Milliseconds} ms 
     */
    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    /**
     * Runs the specified asynchronous function, 
     * after the specified time has elapsed, the promise enters the 'rejected' state
     * @param {Milliseconds} ms 
     * @param {Asynchronous function to run} asyncFn 
     * @param {Arguments that will be passed to the asynchronous function} args
     */
    withTimeout(ms, asyncFn, ...args = []) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject('Timeout'), ms);
            return asyncFn(...args);
        });
    }
};