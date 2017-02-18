/// <reference path="../typings/gator-utils/gator-utils.d.ts" />
/// <reference path="../typings/async/async.d.ts" />
import utils = require("gator-utils");
import async = require("async");
import REST = require("./REST");
import errors = require("./errors");
import index = require("./index");
import applications = require("./admin/applications");
import logger = require("./admin/logs");

export let defaultAppId: number;
export let attributes: { [appId: number] : Array<Attribute> } = [];

//  get attribute data from applications - defaultAppId specifies what attrib data to use if none
//  specified in a report query
export function init(_defaultAppId: number, callback: Function) {

    try {
        defaultAppId = _defaultAppId;

        applications.getAll(function(err, apps: Array<applications.Application>) {

            if (err) {
                console.log('Error in reporting.init: ' + err.message);
                logger.log('AppId: ' + defaultAppId, err);
                callback(err);
                return;
            }

            async.each(apps, function(app: any, asyncCallback: Function) {

                if (!app.reporting) {
                    asyncCallback();        //  no reporting for app
                } else {

                    //  standardize endpoints with / at end
                    if (app.reporting.apiEndpoint.substr(app.reporting.apiEndpoint.length - 1, 1) != '/') {
                        app.reporting.apiEndpoint += '/';
                    }

                    REST.client.get(app.reporting.apiEndpoint + 'attributes', function(err: errors.APIError, apiRequest, apiResponse, result: any) {

                        if (err) {
                            logger.log('AppId: ' + defaultAppId, err);
                            console.log('Error in getting attribs for ' + app.name + ': ' + err.message);
                            asyncCallback(err);
                        } else {
                            attributes[app.id] = result.data;
                            console.log('Reporting.init successful for ' + app.name + ' - attribute count: ' + attributes[app.id].length);
                            asyncCallback();
                        }
                    });
                }
            },
            function(err: Error) {
                if (err) {
                    logger.log('AppId: ' + defaultAppId, err);
                    console.log('Error in getting attribs: ' + err.message);
                    callback(err);
                } else {
                    callback();
                }
            });
        });
    } catch (err) {
        callback(err);
    }
}

//  Get dashboards for current project - dashboards are project/user scope
export function currentDashboards(req) {
    let project = index.currentProject(req);

    if (!project)
        return {};

    let userId = req['session'].user.id;

    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].dashboards = project.data[userId].dashboards || {};

    return project.data[userId].dashboards;
}

//  Get bookmarks for current project - bookmarks are project/user scope
export function currentBookmarks(req) {
    let project = index.currentProject(req);

    if (!project)
        return {};

    let userId = req['session'].user.id;

    project.data = project.data || {};
    project.data[userId] = project.data[userId] || {};
    project.data[userId].bookmarks = project.data[userId].bookmarks || {};

    return project.data[userId].bookmarks;
}

//  Get attributes for a project - custom attributes are project scope
export function getCustomAttributes(req, projectId) {
    let project = index.getProject(req, projectId);

    if (!project)
        return {};

    project.data = project.data || {};
    project.data.attributes = project.data.attributes || {};
    return project.data.attributes;
}

export let Operators = {
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

export class Segment {
    id: number;
    accountId: number;
    name: string;
    query: string;
    global: boolean;
}

export let DataTypes = {
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

export class Attribute {
    name: string;
    title: string;
    dataType: string;
    isElement: boolean;
    isMetric: boolean;
    description: string;
    operators: Array<string>;
    values: Array<string>;
    inputFormat: string;
    filterable: boolean;
    searchable: boolean;
    supportedViews: Array<string>;
    logAttribute: boolean;
    gapType: string;
    chartOptions: Object;
}

//  segmentation filter definitions suitable for use with jQuery QueryBuilder
export class FilterOptions {
    id: string;
    label: string;
    type: string;
    input: string;
    values: Array<any>;
    operators: Array<string>;
    description: string;
    validation: Object;
    multiple: boolean;
    searchable: boolean;
    default_value: string;
}

export enum AttributeTypes {
    all,
    metrics,
    elements
}

//  get attributes for a specific applications, or default if not specified
export function applicationAttributes(appId: number): Array<Attribute> {

    if (typeof appId != 'undefined')
        return attributes[appId];

    return attributes[defaultAppId];
}

export function getAttributes(view: string, attributeType: AttributeTypes, isLog: boolean, appId?: number): Array<Attribute> {
    let attribs = [], appAttribs = applicationAttributes(appId);

    for (let a = 0; a < appAttribs.length; a++) {
        let attrib = appAttribs[a];

        if (view == 'all' || !attrib.supportedViews || attrib.supportedViews.indexOf(view) > -1) {

            if (attributeType == AttributeTypes.all || (attributeType == AttributeTypes.metrics && attrib.isMetric) || (attributeType == AttributeTypes.elements && attrib.isElement)) {

                if (!isLog || attrib.logAttribute)
                    attribs.push(attrib);
            }
        }
    }

    return attribs;
}

export function addAttributeView(options, view: string, attributeType: AttributeTypes, customAttribs: any) {

    for (let name in customAttribs[view]) {

        if (customAttribs[view].hasOwnProperty(name)) {

            let attrib = customAttribs[view][name];

            if ((attributeType == AttributeTypes.all) || (attributeType == AttributeTypes.elements && attrib.isElement) || (attributeType == AttributeTypes.metrics && attrib.isMetric)) {

                options.push({
                    value: view + '.' + name,
                    text: view + ': ' + name,
                    optgroup: "Custom"
                })
            }
        }
    }
}

export function getAttributeOptions(view: string, attributeType: AttributeTypes, customAttribs: any, isLog?: boolean, appId?: number) {
    let options = [], attribs = getAttributes(view, attributeType, isLog, appId);

    //  add custom attributes
    if (customAttribs) {
        addAttributeView(options, 'session', attributeType, customAttribs);

        if (view == 'events') {
            addAttributeView(options, 'event', attributeType, customAttribs);
        }

        addAttributeView(options, 'person', attributeType, customAttribs);

    }

    //  add standard attributes
    for (let a = 0; a < attribs.length; a++) {
        let attrib = attribs[a];

        if (!isLog || attrib.logAttribute) {

            options.push({
                value: attrib.name,
                text: attrib.title,
                optgroup: "Standard"
            })
        }
    }

    return options;
}

export function addFilterView(filterOptions, view: string, customAttribs: any) {

    for (let name in customAttribs[view]) {

        if (customAttribs[view].hasOwnProperty(name) && customAttribs[view][name].filterable) {

            let attrib = customAttribs[view][name];
            attrib.title = view + ': ' + name;
            attrib.name = view + '.' + name;

            filterOptions.push(getFilterOption(attrib));
        }
    }
}

export function getFilterOptions(view: string, customAttribs: any, isLog: boolean, appId?: number): Array<FilterOptions> {
    let attrib, filterOptions = [];

    //  add custom attributes
    if (customAttribs) {

        addFilterView(filterOptions, 'session', customAttribs);

        if (view == 'events') {
            addFilterView(filterOptions, 'event', customAttribs);
        }
    }

    //  add standard attributes
    let appAttribs = applicationAttributes(appId);

    for (let a = 0; a < appAttribs.length; a++) {
        attrib = appAttribs[a];

        if (attrib.filterable && (view == 'all' || !attrib.supportedViews || attrib.supportedViews.indexOf(view) > -1)) {

            if (!isLog || attrib.logAttribute) {
                filterOptions.push(getFilterOption(attrib));
            }
        }
    }

    return filterOptions;
}

export function getFilterOption(attrib: any): FilterOptions {

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
        case DataTypes.date:
            filter.type = attrib.dataType;

            if (!attrib.operators)
                filter.operators = [Operators.equal, Operators.not_equal, Operators.between, Operators.greater, Operators.greater_or_equal, Operators.less, Operators.less_or_equal];

            break;
        case DataTypes.string:
            filter.type = attrib.dataType;

            if (!attrib.operators)
                filter.operators = [Operators.equal, Operators.not_equal, Operators.contains, Operators.begins_with, Operators.not_begins_with, Operators.ends_with, Operators.not_ends_with, Operators.is_null, Operators.is_not_null];

            break;
        case DataTypes.boolean:
            filter.type = attrib.dataType;

            if (!attrib.operators)
                filter.operators = [Operators.equal];
            break;
        case DataTypes.integer:
            filter.type = attrib.dataType;

            if (!attrib.operators)
                filter.operators = [Operators.equal, Operators.not_equal, Operators.greater, Operators.greater_or_equal, Operators.less, Operators.less_or_equal, Operators.between];
            break;

        case DataTypes.numeric:
        case DataTypes.percent:
        case DataTypes.currency:
            filter.type = 'double';

            if (!attrib.operators)
                filter.operators = [Operators.equal, Operators.not_equal, Operators.greater, Operators.greater_or_equal, Operators.less, Operators.less_or_equal, Operators.between];
            break;
    }

    if (attrib.dataType == DataTypes.boolean) {
        filter.input = 'radio';
        filter.values = [ true, false ];
    }

    return filter;
}

//  get current segments for use in selectize
export function getSegmentOptions(req) {
    let options = [];

    for (let r = 0; r < req.session.segments.length; r++) {
        options.push({ value: req.session.segments[r].id, text: req.session.segments[r].name });
    }

    return options;
}

export function getSegments(req, useCache: boolean, appId: number, callback: (err: errors.APIError, segments?: Array<Segment>) => void) {

    try {

        //  if the segments for the account have already been looked up, just return them
        if (useCache && req.session['segments']) {
            callback(null, req.session['segments']);
            return;
        }

        let useAppId = defaultAppId;

        if (typeof appId != "undefined")
            useAppId = +appId;

        applications.getAll(function(err, apps) {

            let endpoint = apps[useAppId].reporting.apiEndpoint;

            REST.client.get(endpoint + 'segments?accessToken=' + req.session['accessToken'], function(err: errors.APIError, apiRequest, apiResponse, result: any) {

                if (!err) {
                    req.session['segments'] = result.data;
                } else {
                    logger.log('AppId: ' + useAppId, err);
                    req.session['segments'] = [];
                }

                callback(err, result.data);
            });
        });
    } catch(err) {
        callback(err);
    }
}
