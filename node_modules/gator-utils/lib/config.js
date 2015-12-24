function env() {
    if (process.env['NODE_ENV']) {
        return process.env['NODE_ENV'].toLowerCase();
    }
    else {
        return "default";
    }
}
exports.env = env;
function dev() {
    var check = process.env['NODE_ENV'] || "";
    return check.toLowerCase() == 'development' || check.toLowerCase() == 'local' || check.toLowerCase() == 'dev';
}
exports.dev = dev;
function settings(envir) {
    if (envir === void 0) { envir = env(); }
    var path = '~/settings/';
    var cwd = process.cwd();
    if (cwd.indexOf('tests') > 1) {
        cwd = cwd.substr(0, cwd.indexOf('tests') - 1);
        path = cwd + '/' + path.replace(/\~\//, '');
    }
    else {
        path = cwd + '/' + path.replace(/\~\//, '');
    }
    var settings;
    try {
        settings = require(path + "settings-" + envir.toLowerCase());
    }
    catch (ex) {
        settings = require(path + "settings");
    }
    return settings;
}
exports.settings = settings;
//# sourceMappingURL=config.js.map