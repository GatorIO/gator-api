"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeTypes = exports.FilterOptions = exports.Attribute = exports.DataTypes = exports.Segment = exports.Operators = exports.dictionaries = exports.entities = void 0;
exports.init = init;
exports.currentDashboards = currentDashboards;
exports.currentBookmarks = currentBookmarks;
exports.getCustomAttributes = getCustomAttributes;
exports.getAttributes = getAttributes;
exports.addAttributeView = addAttributeView;
exports.getAttributeOptions = getAttributeOptions;
exports.addFilterView = addFilterView;
exports.getFilterOptions = getFilterOptions;
exports.getRuleOptions = getRuleOptions;
exports.getFilterOption = getFilterOption;
exports.getSegmentOptions = getSegmentOptions;
exports.getSegments = getSegments;
const utils = require("gator-utils");
const REST = require("./REST");
const index = require("./index");
const applications = require("./admin/applications");
const logger = require("./admin/logs");
let settings = utils.config.settings();
exports.entities = {};
exports.dictionaries = {};
async function init() {
    let apps;
    try {
        apps = await applications.getAll();
    }
    catch (err) {
        console.log('Error in reporting.init: ' + err.message);
        logger.log('Error in reporting.init: ', err);
        throw err;
    }
    const app = apps[settings.appId];
    if (!app.reporting)
        return;
    if (app.reporting.apiEndpoint.substr(app.reporting.apiEndpoint.length - 1, 1) != '/') {
        app.reporting.apiEndpoint += '/';
    }
    try {
        const entResult = await REST.client.get(app.reporting.apiEndpoint + 'entities');
        exports.entities = entResult.data;
    }
    catch (err) {
        logger.log('Error in getting entitites for ' + app.name, err);
        console.log('Error in getting entitites for ' + app.name + ': ' + err.message);
        throw err;
    }
    try {
        const dictResult = await REST.client.get(app.reporting.apiEndpoint + 'dictionaries');
        exports.dictionaries = dictResult.data;
        console.log('Reporting.init successful for ' + app.name);
    }
    catch (err) {
        logger.log('Error in getting dictionaries for ' + app.name, err);
        console.log('Error in getting dictionaries for ' + app.name + ': ' + err.message);
        throw err;
    }
}
function currentDashboards(req) {
    let project = index.currentProject(req);
    if (!project)
        return {};
    let userId = req.session.user.id;
    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].dashboards = project.data[userId].dashboards || {};
    return project.data[userId].dashboards;
}
function currentBookmarks(req) {
    let project = index.currentProject(req);
    if (!project)
        return {};
    let userId = req.session.user.id;
    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].bookmarks = project.data[userId].bookmarks || {};
    return project.data[userId].bookmarks;
}
function getCustomAttributes(req, projectId) {
    let project = index.getProject(req, projectId);
    if (!project)
        return {};
    project.data = project.data || {};
    project.data.attributes = project.data.attributes || {};
    return project.data.attributes;
}
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
class Segment {
    id;
    accountId;
    name;
    query;
    global;
}
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
class Attribute {
    name;
    title;
    dataType;
    isElement;
    isMetric;
    description;
    operators;
    values;
    inputFormat;
    filterable;
    searchable;
    supportedEntities;
    logAttribute;
    gapType;
    chartOptions;
}
exports.Attribute = Attribute;
class FilterOptions {
    id;
    label;
    type;
    input;
    values;
    operators;
    description;
    validation;
    multiple;
    searchable;
    default_value;
}
exports.FilterOptions = FilterOptions;
var AttributeTypes;
(function (AttributeTypes) {
    AttributeTypes[AttributeTypes["all"] = 0] = "all";
    AttributeTypes[AttributeTypes["metrics"] = 1] = "metrics";
    AttributeTypes[AttributeTypes["elements"] = 2] = "elements";
})(AttributeTypes || (exports.AttributeTypes = AttributeTypes = {}));
function getAttributes(entityName, attributeType, isLog) {
    if (!exports.entities || !exports.entities[entityName])
        return null;
    let attribs = [], appAttribs = exports.entities[entityName].attributes;
    for (let a = 0; a < appAttribs.length; a++) {
        let attrib = appAttribs[a];
        if (attributeType == AttributeTypes.all || (attributeType == AttributeTypes.metrics && attrib.isMetric) || (attributeType == AttributeTypes.elements && attrib.isElement)) {
            if (!isLog || attrib.logAttribute)
                attribs.push(attrib);
        }
    }
    return attribs;
}
function addAttributeView(options, entityName, attributeType, customAttribs) {
    for (let name in customAttribs[entityName]) {
        if (customAttribs[entityName].hasOwnProperty(name)) {
            let attrib = customAttribs[entityName][name];
            if ((attributeType == AttributeTypes.all) || (attributeType == AttributeTypes.elements && attrib.isElement) || (attributeType == AttributeTypes.metrics && attrib.isMetric)) {
                options.push({
                    value: entityName + '.' + name,
                    text: entityName + ': ' + name,
                    optgroup: "Custom"
                });
            }
        }
    }
}
function getAttributeOptions(entityName, attributeType, customAttribs, isLog) {
    let options = [], attribs = getAttributes(entityName, attributeType, isLog);
    if (!attribs)
        return null;
    if (customAttribs) {
        addAttributeView(options, 'session', attributeType, customAttribs);
        if (entityName == 'events') {
            addAttributeView(options, 'event', attributeType, customAttribs);
        }
        addAttributeView(options, 'person', attributeType, customAttribs);
    }
    for (let a = 0; a < attribs.length; a++) {
        let attrib = attribs[a];
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
function addFilterView(filterOptions, entityName, customAttribs) {
    for (let name in customAttribs[entityName]) {
        if (customAttribs[entityName].hasOwnProperty(name) && customAttribs[entityName][name].filterable) {
            let attrib = customAttribs[entityName][name];
            attrib.title = entityName + ': ' + name;
            attrib.name = entityName + '.' + name;
            filterOptions.push(getFilterOption(attrib));
        }
    }
}
function getFilterOptions(entityName, customAttribs, isLog) {
    let attrib, filterOptions = [];
    if (!exports.entities || !exports.entities[entityName])
        return null;
    if (customAttribs) {
        addFilterView(filterOptions, 'session', customAttribs);
        if (entityName == 'events') {
            addFilterView(filterOptions, 'event', customAttribs);
        }
    }
    let appAttribs = exports.entities[entityName].attributes;
    for (let a = 0; a < appAttribs.length; a++) {
        attrib = appAttribs[a];
        if (attrib.filterable) {
            if (!isLog || attrib.logAttribute) {
                filterOptions.push(getFilterOption(attrib));
            }
        }
    }
    return filterOptions;
}
function getRuleOptions(entityName, isLog) {
    let attrib, ruleOptions = [];
    let appAttribs = exports.entities[entityName].attributes;
    for (let a = 0; a < appAttribs.length; a++) {
        attrib = appAttribs[a];
        if (attrib.rule) {
            if (!isLog || attrib.logAttribute)
                ruleOptions.push(getFilterOption(attrib));
        }
    }
    return ruleOptions;
}
function getFilterOption(attrib) {
    let filter = new FilterOptions();
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
function getSegmentOptions(req) {
    let options = [];
    for (let r = 0; r < req.session.segments.length; r++) {
        options.push({ value: req.session.segments[r].id, text: req.session.segments[r].name });
    }
    return options;
}
async function getSegments(req, useCache, appId) {
    if (useCache && req.session['segments'])
        return req.session['segments'];
    const apps = await applications.getAll();
    const endpoint = apps[settings.appId].reporting.apiEndpoint;
    try {
        const result = await REST.client.get(endpoint + 'segments?accessToken=' + req.session.accessToken);
        req.session['segments'] = result.data;
        return result.data;
    }
    catch (err) {
        logger.log(err);
        req.session['segments'] = [];
        throw err;
    }
}
//# sourceMappingURL=reporting.js.map