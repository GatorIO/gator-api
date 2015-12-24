var utils = require('./index');
function localHost(req) {
    return req.connection.remoteAddress.substring(0, 8) == "127.0.0." || req.connection.remoteAddress == "::1";
}
exports.localHost = localHost;
function isIPV6(address) {
    if (!address) {
        return false;
    }
    return address.indexOf(':') > -1;
}
exports.isIPV6 = isIPV6;
function remoteAddress(req) {
    if (req.headers['x-forwarded-for']) {
        var xf = req.headers['x-forwarded-for'].trim();
        var xfs = null;
        if (xf.indexOf(",") > -1) {
            xfs = xf.split(',');
        }
        else {
            if (xf.indexOf(" ") > -1) {
                xfs = xf.split(' ');
            }
        }
        if (xfs != null) {
            for (var i = 0; i < xfs.length; i++) {
                var ipTrim = xfs[i].trim();
                if (ipTrim != "" && ipTrim.substring(0, 3) != "10." && ipTrim.substring(0, 8) != "127.0.0." && ipTrim.substring(0, 8) != "192.168." && ipTrim != "unknown" && ipTrim != "::1") {
                    return ipTrim;
                }
            }
            xf = xfs[0].trim();
        }
        if (xf.substring(0, 7) == "unknown") {
            return "1.2.3.4";
        }
        return xf;
    }
    else {
        var xf = req.connection.remoteAddress;
        if (xf.substring(0, 7) == "unknown") {
            return "1.2.3.4";
        }
        return xf;
    }
}
exports.remoteAddress = remoteAddress;
function isLoopback(addr) {
    return /^127\.0\.0\.1/.test(addr)
        || /^fe80::1/.test(addr)
        || /^::1/.test(addr);
}
exports.isLoopback = isLoopback;
function hashIPV6(ip) {
    var hash = 0, len;
    for (var i = 0, len = ip.length; i < len; i++) {
        hash = ((hash << 5) - hash) + ip.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
exports.hashIPV6 = hashIPV6;
function hash(address) {
    if (isIPV6(address)) {
        return hashIPV6(address);
    }
    else {
        var _ip = address.split('.');
        return Number(_ip[0]) * 16777216 +
            Number(_ip[1]) * 65536 +
            Number(_ip[2]) * 256 +
            Number(_ip[3]);
    }
}
exports.hash = hash;
function toNumber(address, reverse) {
    if (reverse === void 0) { reverse = false; }
    if (isIPV6(address)) {
        return toNumberIPV6(address);
    }
    else {
        var _ip = address.split('.');
        if (reverse)
            return Number(_ip[3]) * 16777216 +
                Number(_ip[2]) * 65536 +
                Number(_ip[1]) * 256 +
                Number(_ip[0]);
        else
            return Number(_ip[0]) * 16777216 +
                Number(_ip[1]) * 65536 +
                Number(_ip[2]) * 256 +
                Number(_ip[3]);
    }
}
exports.toNumber = toNumber;
function compress(address) {
    if (!isIPV6(address)) {
        return toNumber32(address);
    }
    else {
        var parts = address.split(':');
        var bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == '') {
                break;
            }
            else {
                parts[i] = ('000' + parts[i]).slice(-4);
                bytes[i * 2] = parseInt(parts[i].substr(0, 2), 16);
                bytes[i * 2 + 1] = parseInt(parts[i].substr(2, 2), 16);
            }
        }
        var index = 15;
        for (var j = parts.length - 1; j > i; j--) {
            parts[j] = ('000' + parts[j]).slice(-4);
            bytes[index - 1] = parseInt(parts[j].substr(0, 2), 16);
            bytes[index] = parseInt(parts[j].substr(2, 2), 16);
            index -= 2;
        }
        return bytes;
    }
}
exports.compress = compress;
function toNumber32(address) {
    if (isIPV6(address)) {
        return toNumberIPV6(address);
    }
    else {
        var _ip = address.split('.');
        var num = Number(_ip[0]) * 16777216 +
            Number(_ip[1]) * 65536 +
            Number(_ip[2]) * 256 +
            Number(_ip[3]);
        if (num >= 2147483648)
            num -= 4294967296;
        return num;
    }
}
exports.toNumber32 = toNumber32;
function fromNumber(ipNumber) {
    var addr = utils.toBytes(ipNumber);
    return addr[3] + '.' +
        addr[2] + '.' +
        addr[1] + '.' +
        addr[0];
}
exports.fromNumber = fromNumber;
function toNumberIPV6(address) {
    return 100;
}
exports.toNumberIPV6 = toNumberIPV6;
//# sourceMappingURL=ip.js.map