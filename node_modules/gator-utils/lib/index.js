exports.ip = require('./ip');
exports.epoch = require('./epoch');
exports.config = require('./config');
var crypto = require('crypto');
var iconv = require("iconv-lite");
function superRandom(bytes) {
    if (bytes === void 0) { bytes = 20; }
    return crypto.randomBytes(bytes).toString('base64');
}
exports.superRandom = superRandom;
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
exports.isArray = isArray;
function prefixAttributes(obj, prefix) {
    for (var attrib in obj) {
        if (obj.hasOwnProperty(attrib)) {
            if (!isArray(obj) && attrib.substr(0, 1) != '$') {
                obj[prefix + '.' + attrib] = obj[attrib];
                delete obj[attrib];
            }
            else {
                if (typeof obj[attrib] == 'object') {
                    obj[attrib] = prefixAttributes(obj[attrib], prefix);
                }
            }
        }
    }
    return obj;
}
exports.prefixAttributes = prefixAttributes;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
exports.isNumeric = isNumeric;
function toBytes(num) {
    var data = new Uint8Array(4);
    for (var i = 0; i < 4; i++) {
        data[i] = (num >> (i * 8)) & 0xff;
    }
    return data;
}
exports.toBytes = toBytes;
function uuid(len, radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++)
            uuid[i] = chars[0 | Math.random() * radix];
    }
    else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
exports.uuid = uuid;
function base62decode(a) {
    var b, c, d;
    for (b = c = (a === (/\W|_|^$/.test(a += "") || a)
        ? 1 : 0) - 1; d = a.charCodeAt(c++);)
        b = b * 62 + d - [, 48, 29, 87][d >> 5];
    return b;
}
exports.base62decode = base62decode;
function base62encode(a) {
    var b, c;
    for (a = a !== +a || a % 1 ? -1 : a, b = ""; a >= 0; a = Math.floor(a / 62) || -1)
        b = String.fromCharCode(((c = a % 62) > 9 ? c > 35 ? 29 : 87 : 48) + c) + b;
    return b;
}
exports.base62encode = base62encode;
function isUTF8(charset) {
    if (!charset) {
        return true;
    }
    charset = charset.toLowerCase();
    return charset === 'utf8' || charset === 'utf-8';
}
exports.isUTF8 = isUTF8;
function padLeft(value, padChar, padCount) {
    var str = "" + value;
    var padBuff = Array(padCount + 1);
    var pad = padBuff.join(padChar);
    return pad.substring(0, pad.length - str.length) + str;
}
exports.padLeft = padLeft;
function urlDecode(str, charset) {
    if (isUTF8(charset)) {
        try {
            return decodeURIComponent(str);
        }
        catch (err) {
            return str;
        }
    }
    var bytes = [];
    for (var i = 0; i < str.length;) {
        if (str[i] === '%') {
            i++;
            bytes.push(parseInt(str.substring(i, i + 2), 16));
            i += 2;
        }
        else {
            bytes.push(str.charCodeAt(i));
            i++;
        }
    }
    var buf = new Buffer(bytes);
    return iconv.decode(buf, charset);
}
exports.urlDecode = urlDecode;
function clone(o) {
    if (!o || typeof (o) != 'object')
        return o;
    return Object['assign']({}, o);
}
exports.clone = clone;
function extend(o1, o2) {
    if (o1 == null || o2 == null)
        return o1;
    for (var key in o2)
        if (o2.hasOwnProperty(key))
            o1[key] = o2[key];
}
exports.extend = extend;
function copyProperty(property, o1, o2, allowNull, allowEmpty) {
    if (allowNull === void 0) { allowNull = false; }
    if (allowEmpty === void 0) { allowEmpty = false; }
    if (o1 == null || o2 == null)
        throw new Error('both objects must have a value');
    if (property == null)
        throw new Error('you must specify a property value');
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
exports.copyProperty = copyProperty;
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
exports.isFunction = isFunction;
function replaceAll(original, search, replacement) {
    return original.split(search).join(replacement);
}
exports.replaceAll = replaceAll;
function htmlify(obj) {
    return '<pre>' + JSON.stringify(obj, null, 4) + '</pre>';
}
exports.htmlify = htmlify;
function empty(obj) {
    return Object.keys(obj).length == 0;
}
exports.empty = empty;
function trimStart(value, start) {
    if (value.length == 0)
        return value;
    start = start ? start : ' ';
    var i = 0, val = 0;
    for (; value.charAt(i) == start && i < value.length; i++)
        ;
    return value.substring(i);
}
exports.trimStart = trimStart;
function parseCookieValueFromString(headerVal, key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(headerVal)) ? (result[1]) : null;
}
exports.parseCookieValueFromString = parseCookieValueFromString;
function trimEnd(val, end) {
    if (val.slice(-end.length) === end)
        return val.substr(0, val.length - end.length);
    else
        return val;
}
exports.trimEnd = trimEnd;
function repeat(val, n) {
    n = n || 1;
    return Array(n + 1).join(val);
}
exports.repeat = repeat;
function spaces(n) {
    return this.repeat('&nbsp;', n);
}
exports.spaces = spaces;
function merge(o1, o2, overwrite) {
    if (!o1)
        return o2;
    var o = clone(o1);
    for (var key in o2) {
        if (o2.hasOwnProperty(key)) {
            if (o[key] == undefined) {
                o[key] = o2[key];
            }
            else {
                if (typeof o2[key] == 'object') {
                    o[key] = merge(o[key], o2[key], overwrite);
                }
                else {
                    if (overwrite) {
                        o[key] = o2[key];
                    }
                }
            }
        }
    }
    return o;
}
exports.merge = merge;
function validEmail(email) {
    return email && email.indexOf('@') > -1 && email.indexOf('.') > -1;
}
exports.validEmail = validEmail;
function missingParams(params, requiredParams) {
    var missing = [];
    for (var a = 0; a < requiredParams.length; a++) {
        if (!params || !params.hasOwnProperty(requiredParams[a])) {
            missing.push(requiredParams[a]);
        }
    }
    return missing;
}
exports.missingParams = missingParams;
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}
exports.guid = guid;
function hash(input) {
    var hash = 0, len;
    for (var i = 0, len = input.length; i < len; i++) {
        hash = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
exports.hash = hash;
function noCache(res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
}
exports.noCache = noCache;
//# sourceMappingURL=index.js.map