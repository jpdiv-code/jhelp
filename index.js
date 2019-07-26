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
    withTimeout(ms, asyncFn, ...args) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject('Timeout'), ms);
            return asyncFn(...args);
        });
    }

    /**
     * Merge one object (src) to another (dist)
     * Merge arrays and sub-objects
     * @param {Destination object (to)} dist 
     * @param {Source object (from)} src 
     */
    merge(dist, src) {
        for (let key in src) {
            const distValue = dist[key];
            const srcValue = src[key];
            if (distValue) {
                if (typeof distValue === 'object') {
                    if (Array.isArray(distValue)) {
                        if (Array.isArray(srcValue)) {
                            for (let value of srcValue) {
                                distValue.push(value);
                            }
                        } else {
                            dist[key] = srcValue;
                        }
                    } else {
                        if (typeof srcValue === 'object') {
                            if (Array.isArray(srcValue)) {
                                dist[key] = srcValue;
                            } else {
                                this.merge(distValue, srcValue);
                            }
                        } else {
                            dist[key] = srcValue;
                        }
                    }
                } else {
                    dist[key] = srcValue;
                }
            } else {
                dist[key] = srcValue;
            }
        }
    }
};