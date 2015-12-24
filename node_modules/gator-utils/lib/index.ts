/// <reference path="epoch.ts" />
/// <reference path="ip.ts" />
/// <reference path="../typings/node/node.d.ts" />
export var ip = require('./ip');
export var epoch = require('./epoch');
export var config = require('./config');
import crypto = require('crypto');

/*
 Common utility functions
 */

var iconv = require("iconv-lite");

export function superRandom(bytes: number = 20) {
    return crypto.randomBytes(bytes).toString('base64');
}

//  return whether an object is an array or not
export function isArray(obj): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

//  Add a prefix to all the attributes.  This is used when manipulating nested objects.
export function prefixAttributes(obj: Object, prefix: string): Object {

    for (var attrib in obj) {

        if (obj.hasOwnProperty(attrib)) {

            //  skip over arrays and $ operators
            if (!isArray(obj) && attrib.substr(0, 1) != '$') {
                obj[prefix + '.' + attrib] = obj[attrib];
                delete obj[attrib];
            } else {

                if (typeof obj[attrib] == 'object') {
                    obj[attrib] = prefixAttributes(obj[attrib], prefix);
                }
            }
        }
    }

    return obj;
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//  Convert an integer to a 4 byte array
export function toBytes(num: number) {
    var data = new Uint8Array(4);

    for (var i = 0; i < 4; i++) {
        data[i] = (num >> (i * 8)) & 0xff;
    }

    return data;
}

export function uuid(len?: number, radix?: number) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    var chars = CHARS, uuid = [], i;

    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 * this base62 is only safe for decoding to integers
 */
export function base62decode(a: string): number {

    var b, c, d;

    for (
        b = c = ( // 'false - 1' will return '-1' and 'true - 1' will return '0'
            a === (/\W|_|^$/.test(a += "") || a) // tests if 'a' is a properly base62-encoded string and coerces it to one
                ? 1 : 0) - 1; // so, 'b' and 'c' are initialized with either '-1' or '0'
 
        d = a.charCodeAt(c++); // if 'c' equals '-1', 'd' is 'NaN' which breaks the loop execution
        )

        b = b * 62 + d - [, 48, 29, 87][d >> 5]; // See comments : https://gist.github.com/1170594#gistcomment-48129
 
    return b; // positive base10 integer or '-1' if 'a' is not a base62 encoded string
}

/**
 * this base62 is only safe for encoding integers
 */
export function base62encode(a): string {

    var b, c;

    for (
        a = a !== +a || a % 1 ? -1 : a, b = ""; // if not a base10 integer, 'a' will be '-1'
        // for example, '.5 % 1 == .5' but '1 % 1 == 0'
        a >= 0; // also prevents the user to use negative base10 integers
        a = Math.floor(a / 62) || -1 // using a bitwise hack here will fail with great numbers
        )
 
        // a%62 -> 0-61
        // 0-9   | 36-61 | 10-35
        // 48-57 | 65-90 | 97-121
        // 0-9   | A-Z   | a-z
 
        b = String.fromCharCode(((c = a % 62) > 9 ? c > 35 ? 29 : 87 : 48) + c) + b;

    return b; // will return either an empty or a base62-encoded string
}

export function isUTF8(charset) {
    if (!charset) {
        return true;
    }
    charset = charset.toLowerCase();
    return charset === 'utf8' || charset === 'utf-8';
}

export function padLeft(value: any, padChar: string, padCount: number) {
    var str = "" + value;
    var padBuff = Array(padCount + 1);
    var pad = padBuff.join(padChar);
    return pad.substring(0, pad.length - str.length) + str
}

export function urlDecode(str, charset) {
    if (isUTF8(charset)) {

        try {
            return decodeURIComponent(str);
        } catch (err) {
            return str;
        }
    }

    var bytes = [];
    for (var i = 0; i < str.length;) {
        if (str[i] === '%') {
            i++;
            bytes.push(parseInt(str.substring(i, i + 2), 16));
            i += 2;
        } else {
            bytes.push(str.charCodeAt(i));
            i++;
        }
    }
    var buf = new Buffer(bytes);
    return iconv.decode(buf, charset);
}

//  SHALLOW clone an object into a new object.  No functions will be carried over.
export function clone(o: Object): Object {

    if (!o || typeof (o) != 'object')
        return o;

    return Object['assign']({}, o);
}

//  Concatenate two objects into the first object
export function extend(o1: Object, o2: Object): Object {

    if (o1 == null || o2 == null)
        return o1;

    for (var key in o2)
        if (o2.hasOwnProperty(key))
            o1[key] = o2[key];

}

/**
 * Copies the specified property from the second object into the first object if it exists
 * returns true if the property was found and copied
 */
export function copyProperty(
    /**
     * The property you are copying
     */
    property: string,
    /**
     * The object you are copying to
     */
    o1: Object,
    /**
     * The object you are copying from
     */
    o2: Object,
    /**
     * Allow the copying of null values
     */
    allowNull: boolean = false,
    /**
     * Allow the copying of empty values
     */
    allowEmpty: boolean = false): boolean {

    if (o1 == null || o2 == null)
        throw new Error('both objects must have a value');

    if (property == null)
        throw new Error('you must specify a property value');

    /// I felt this was far more readable than the alternative method started with
    var copy = false;

    if (o2.hasOwnProperty(property)) {
        if (allowNull && o2[property] == null) {
            copy = true;
        }
        else if (o2[property] instanceof Date) {
            copy = true;
        }
        else if (o2[property] != null) {
            if (allowEmpty || typeof o2[property] !== 'object') {
                copy = true;
            }
            else if (!empty(o2[property])) {
                copy = true;
            }
        }
    }

    if (copy)
        o1[property] = o2[property];

    return copy;
}

export function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//  replaceAll string function, needed since javascript's replace function only replaces the first instance
export function replaceAll(original: string, search: string, replacement: string) {
    return original.split(search).join(replacement);
}

//  Format an object to html with indentation and spaces
export function htmlify(obj): string {
    return '<pre>' + JSON.stringify(obj, null, 4) + '</pre>';
}

//  Return whether an object is empty or noe
export function empty(obj: Object): boolean {
    return Object.keys(obj).length == 0;
}

//  trim a specific string off the start of a string
export function trimStart(value: string, start: string) {
    if (value.length == 0) return value;

    start = start ? start : ' ';
    var i = 0, val = 0;

    for (; value.charAt(i) == start && i < value.length; i++);

    return value.substring(i);
}

/**
 * Get the value from a cookie from the raw header string
 */
export function parseCookieValueFromString(headerVal: string, key: string) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(headerVal)) ? (result[1]) : null;
}

//  trim a specific string off the end of a string
export function trimEnd(val: string, end: string): string {

    if (val.slice(-end.length) === end)
        return val.substr(0, val.length - end.length);
    else
        return val;
}

//  Repeat a string N times
export function repeat(val: string, n: number): string {
    n = n || 1;
    return Array(n + 1).join(val);
}

//  Repeat html spaces N times
export function spaces(n: number): string {
    return this.repeat('&nbsp;', n);
}

//  merge two object - overwrite existing elements, if specified
export function merge(o1: any, o2: any, overwrite: boolean): Object {

    if (!o1)
        return o2;

    var o: Object = clone(o1);

    for (var key in o2) {

        if (o2.hasOwnProperty(key)) {

            if (o[key] == undefined) {
                o[key] = o2[key];
            } else {

                if (typeof o2[key] == 'object') {
                    o[key] = merge(o[key], o2[key], overwrite);
                } else {
                    if (overwrite) {
                        o[key] = o2[key];
                    }
                }
            }
        }
    }

    return o;
}

export function validEmail(email: string) {
    return email && email.indexOf('@') > -1 && email.indexOf('.') > -1;
}

//  Collect missing arguments on a REST request
export function missingParams(params: Object, requiredParams: Array<string>): Array<string> {
    var missing = [];

    for (var a = 0; a < requiredParams.length; a++) {

        if (!params || !params.hasOwnProperty(requiredParams[a])) {
            missing.push(requiredParams[a]);
        }
    }

    return missing;
}

/**
 *  Generates a GUID string.
 *  example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 */
export function guid() {
    function _p8(s?) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

//  Return a 32-bit integer hash from a string.  This uses a variation of the murmur3 hash algorithm.  The collision
//  rate is very small.
//  Params:  input - the string to hash
export function hash(input: string): number {

    var hash = 0, len: number;

    for (var i = 0, len = input.length; i < len; i++) {
        hash = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

export function noCache(res: any) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
}
