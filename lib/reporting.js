"use strict";
var REST = require("./REST");
var index = require("./index");
function currentDashboards(req) {
    var project = index.currentProject(req);
    var userId = req['session'].user.id;
    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].dashboards = project.data[userId].dashboards || {};
    return project.data[userId].dashboards;
}
exports.currentDashboards = currentDashboards;
function currentBookmarks(req) {
    var project = index.currentProject(req);
    var userId = req['session'].user.id;
    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].bookmarks = project.data[userId].bookmarks || {};
    return project.data[userId].bookmarks;
}
exports.currentBookmarks = currentBookmarks;
function getCustomAttributes(req, projectId) {
    var project = index.getProject(req, projectId);
    project.data = project.data || {};
    project.data.attributes = project.data.attributes || {};
    return project.data.attributes;
}
exports.getCustomAttributes = getCustomAttributes;
exports.Operators = {
    equal: 'equal',
    not_equal: 'not_equal',
    begins_with: 'begins_with',
    not_begins_with: 'not_begins_with',
    ends_with: 'begins_with',
    not_ends_with: 'not_begins_with',
    contains: 'contains',
    not_contains: 'not_contains',
    _in: 'in',
    not_in: 'not_in',
    between: 'between',
    less: 'less',
    greater: 'greater',
    greater_or_equal: 'greater_or_equal',
    less_or_equal: 'less_or_equal',
    is_null: 'is_null',
    is_not_null: 'is_not_null'
};
var Segment = (function () {
    function Segment() {
    }
    return Segment;
}());
exports.Segment = Segment;
exports.DataTypes = {
    string: 'string',
    integer: 'integer',
    numeric: 'numeric',
    currency: 'currency',
    percent: 'percent',
    date: 'date',
    boolean: 'boolean',
    object: 'object',
    array: 'array'
};
var Attribute = (function () {
    function Attribute() {
    }
    return Attribute;
}());
exports.Attribute = Attribute;
var FilterOptions = (function () {
    function FilterOptions() {
    }
    return FilterOptions;
}());
exports.FilterOptions = FilterOptions;
exports.attributes = [];
(function (AttributeTypes) {
    AttributeTypes[AttributeTypes["all"] = 0] = "all";
    AttributeTypes[AttributeTypes["metrics"] = 1] = "metrics";
    AttributeTypes[AttributeTypes["elements"] = 2] = "elements";
})(exports.AttributeTypes || (exports.AttributeTypes = {}));
var AttributeTypes = exports.AttributeTypes;
function getAttributes(view, attributeType, isLog) {
    var attribs = [];
    for (var a = 0; a < exports.attributes.length; a++) {
        var attrib = exports.attributes[a];
        if (view == 'all' || !attrib.supportedViews || attrib.supportedViews.indexOf(view) > -1) {
            if (attributeType == AttributeTypes.all || (attributeType == AttributeTypes.metrics && attrib.isMetric) || (attributeType == AttributeTypes.elements && attrib.isElement)) {
                if (!isLog || attrib.logAttribute)
                    attribs.push(attrib);
            }
        }
    }
    return attribs;
}
exports.getAttributes = getAttributes;
function addAttributeView(options, view, attributeType, customAttribs) {
    for (var name in customAttribs[view]) {
        if (customAttribs[view].hasOwnProperty(name)) {
            var attrib = customAttribs[view][name];
            if ((attributeType == AttributeTypes.all) || (attributeType == AttributeTypes.elements && attrib.isElement) || (attributeType == AttributeTypes.metrics && attrib.isMetric)) {
                options.push({
                    value: view + '.' + name,
                    text: view + ': ' + name,
                    optgroup: "Custom"
                });
            }
        }
    }
}
exports.addAttributeView = addAttributeView;
function getAttributeOptions(view, attributeType, customAttribs, isLog) {
    var options = [], attribs = getAttributes(view, attributeType, isLog);
    if (customAttribs) {
        addAttributeView(options, 'session', attributeType, customAttribs);
        if (view == 'events') {
            addAttributeView(options, 'event', attributeType, customAttribs);
        }
        addAttributeView(options, 'person', attributeType, customAttribs);
    }
    for (var a = 0; a < attribs.length; a++) {
        var attrib = attribs[a];
        if (!isLog || attrib.logAttribute) {
            options.push({
                value: attrib.name,
                text: attrib.title,
                optgroup: "Standard"
            });
        }
    }
    return options;
}
exports.getAttributeOptions = getAttributeOptions;
function addFilterView(filterOptions, view, customAttribs) {
    for (var name in customAttribs[view]) {
        if (customAttribs[view].hasOwnProperty(name) && customAttribs[view][name].filterable) {
            var attrib = customAttribs[view][name];
            attrib.title = view + ': ' + name;
            attrib.name = view + '.' + name;
            filterOptions.push(getFilterOption(attrib));
        }
    }
}
exports.addFilterView = addFilterView;
function getFilterOptions(view, customAttribs, isLog) {
    var attrib, filterOptions = [];
    if (customAttribs) {
        addFilterView(filterOptions, 'session', customAttribs);
        if (view == 'events') {
            addFilterView(filterOptions, 'event', customAttribs);
        }
    }
    for (var a = 0; a < exports.attributes.length; a++) {
        attrib = exports.attributes[a];
        if (attrib.filterable && (view == 'all' || !attrib.supportedViews || attrib.supportedViews.indexOf(view) > -1)) {
            if (!isLog || attrib.logAttribute) {
                filterOptions.push(getFilterOption(attrib));
            }
        }
    }
    return filterOptions;
}
exports.getFilterOptions = getFilterOptions;
function getFilterOption(attrib) {
    var filter = new FilterOptions();
    filter.id = attrib.name;
    filter.label = attrib.title || attrib.name;
    filter.description = attrib.description || attrib.name;
    if (attrib.values && attrib.values.length > 0) {
        filter.values = attrib.values;
        filter.input = 'select';
        filter.multiple = true;
    }
    if (attrib.inputFormat) {
        filter.validation = { format: attrib.inputFormat };
    }
    filter.operators = attrib.operators;
    filter.searchable = attrib.searchable;
    switch (attrib.dataType) {
        case exports.DataTypes.date:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.between, exports.Operators.greater, exports.Operators.greater_or_equal, exports.Operators.less, exports.Operators.less_or_equal];
            break;
        case exports.DataTypes.string:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.contains, exports.Operators.begins_with, exports.Operators.not_begins_with, exports.Operators.ends_with, exports.Operators.not_ends_with, exports.Operators.is_null, exports.Operators.is_not_null];
            break;
        case exports.DataTypes.boolean:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal];
            break;
        case exports.DataTypes.integer:
            filter.type = attrib.dataType;
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.greater, exports.Operators.greater_or_equal, exports.Operators.less, exports.Operators.less_or_equal, exports.Operators.between];
            break;
        case exports.DataTypes.numeric:
        case exports.DataTypes.percent:
        case exports.DataTypes.currency:
            filter.type = 'double';
            if (!attrib.operators)
                filter.operators = [exports.Operators.equal, exports.Operators.not_equal, exports.Operators.greater, exports.Operators.greater_or_equal, exports.Operators.less, exports.Operators.less_or_equal, exports.Operators.between];
            break;
    }
    if (attrib.dataType == exports.DataTypes.boolean) {
        filter.input = 'radio';
        filter.values = [true, false];
    }
    return filter;
}
exports.getFilterOption = getFilterOption;
function initialize(apiEndpoint, callback) {
    try {
        exports.API_ENDPOINT = apiEndpoint;
        if (exports.API_ENDPOINT.substr(exports.API_ENDPOINT.length - 1, 1) != '/')
            exports.API_ENDPOINT += '/';
        REST.client.get(exports.API_ENDPOINT + 'attributes', function (err, apiRequest, apiResponse, result) {
            if (err) {
                console.log('Error in reporting.init: ' + err.message);
                callback(err);
            }
            else {
                exports.attributes = result.data;
                console.log('Reporting.init successful - attribute count: ' + exports.attributes.length);
                callback();
            }
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.initialize = initialize;
function getSegmentOptions(req) {
    var options = [];
    for (var r = 0; r < req.session.segments.length; r++) {
        options.push({ value: req.session.segments[r].id, text: req.session.segments[r].name });
    }
    return options;
}
exports.getSegmentOptions = getSegmentOptions;
function getSegments(req, useCache, callback) {
    try {
        if (useCache && req.session['segments']) {
            callback(null, req.session['segments']);
            return;
        }
        REST.client.get(exports.API_ENDPOINT + 'segments?accessToken=' + req.session['accessToken'], function (err, apiRequest, apiResponse, result) {
            if (!err)
                req.session['segments'] = result.data;
            else
                req.session['segments'] = [];
            callback(err, result.data);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.getSegments = getSegments;
//# sourceMappingURL=reporting.js.map