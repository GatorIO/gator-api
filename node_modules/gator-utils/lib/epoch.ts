/// <reference path="../typings/node/node.d.ts" />

/**
 * Date and epoch functions
 *
 * The standard way to store epoch in the database is seconds from 1999, in UTC.  The following routines all assume
 * that standard.
 *
 */

export var timezones: Array<{ code: string; name: string; utcOffset?: number; dstStart?: Date; dstEnd?: Date; }> = [];

timezones[0] = { code: 'UTC', name: 'UTC 0:00 - Coordinated Universal Time (UTC)', utcOffset: 0 };
timezones[1] = { code: 'MIT', name: 'UTC -11:00 - Midway Islands Time (MIT)', utcOffset: -11 };
timezones[2] = { code: 'HST', name: 'UTC -10:00 - Hawaii Standard Time (HST)', utcOffset: -10 };
timezones[3] = { code: 'AST', name: 'UTC -9:00 - Alaska Standard Time (AST)', utcOffset: -9, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
timezones[4] = { code: 'PST', name: 'UTC -8:00 - Pacific Standard Time (PST)', utcOffset: -8, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
timezones[5] = { code: 'PNT', name: 'UTC -7:00 - Phoenix Standard Time (PNT)', utcOffset: -7 };
timezones[6] = { code: 'MST', name: 'UTC -7:00 - Mountain Standard Time (MST)', utcOffset: -7, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
timezones[7] = { code: 'CST', name: 'UTC -6:00 - Central Standard Time (CST)', utcOffset: -6, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
timezones[8] = { code: 'EST', name: 'UTC -5:00 - Eastern Standard Time (EST)', utcOffset: -5, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
timezones[9] = { code: 'IET', name: 'UTC -5:00 - Indiana Eastern Standard Time (IET)', utcOffset: -5 };
timezones[10] = { code: 'PRT', name: 'UTC -4:00 - Puerto Rico/US Virgin Islands Time (PRT)', utcOffset: -4 };
timezones[11] = { code: 'CNT', name: 'UTC -3:30 - Canada Newfoundland Time (CNT)', utcOffset: -3.5, dstStart: new Date(Date.UTC(2016, 2, 13, 1)), dstEnd: new Date(Date.UTC(2016, 10, 6, 1)) };
timezones[12] = { code: 'AGT', name: 'UTC -3:00 - Argentina Standard Time (AGT)', utcOffset: -3 };
timezones[13] = { code: 'BET', name: 'UTC -3:00 - Brazil Eastern Time (BET)', utcOffset: -3 };
timezones[14] = { code: 'CAT', name: 'UTC -1:00 - Central African Time (CAT)', utcOffset: -1 };
timezones[15] = { code: 'GMT', name: 'UTC 0:00 - Greenwich Mean Time (GMT)', utcOffset: 0, dstStart: new Date(Date.UTC(2016, 2, 27, 1)), dstEnd: new Date(Date.UTC(2016, 9, 30, 1)) };
timezones[16] = { code: 'ECT', name: 'UTC +1:00 - European Central Time (ECT)', utcOffset: 1, dstStart: new Date(Date.UTC(2016, 2, 27, 1)), dstEnd: new Date(Date.UTC(2016, 9, 30, 1)) };
timezones[17] = { code: 'EET', name: 'UTC +1:00 - Eastern European Time (EET)', utcOffset: 1, dstStart: new Date(Date.UTC(2016, 2, 27, 1)), dstEnd: new Date(Date.UTC(2016, 9, 30, 1)) };
timezones[18] = { code: 'ART', name: 'UTC +2:00 - (Arabic) Egypt Standard Time (ART)', utcOffset: 2 };
timezones[19] = { code: 'EAT', name: 'UTC +3:00 - Eastern African Time (EAT)', utcOffset: 3 };
timezones[20] = { code: 'MET', name: 'UTC +3:30 - Middle East Time (MET)', utcOffset: 3.5 };
timezones[21] = { code: 'NET', name: 'UTC +4:00 - Near East Time (NET)', utcOffset: 4 };
timezones[22] = { code: 'PLT', name: 'UTC +5:00 - Pakistan Lahore Time (PLT)', utcOffset: 5 };
timezones[23] = { code: 'IST', name: 'UTC +5:30 - India Standard Time (IST)', utcOffset: 5.5 };
timezones[24] = { code: 'BST', name: 'UTC +6:00 - Bangladesh Standard Time (BST)', utcOffset: 6 };
timezones[25] = { code: 'VST', name: 'UTC +7:00 - Vietnam Standard Time (VST)', utcOffset: 7 };
timezones[26] = { code: 'CTT', name: 'UTC +8:00 - China Taiwan Time (CTT)', utcOffset: 8 };
timezones[27] = { code: 'JST', name: 'UTC +9:00 - Japan Standard Time (JST)', utcOffset: 9 };
timezones[28] = { code: 'ACT', name: 'UTC +9:30 - Australia Central Time (ACT)', utcOffset: 9.5 };
timezones[29] = { code: 'AET', name: 'UTC +10:00 - Australia Eastern Time (AET)', utcOffset: 10 };
timezones[30] = { code: 'SST', name: 'UTC +11:00 - Solomon Standard Time (SST)', utcOffset: 11 };
timezones[31] = { code: 'NST', name: 'UTC +12:00 - New Zealand Standard Time (NST)', utcOffset: 12, dstStart: new Date(Date.UTC(2016, 8, 25, 2)), dstEnd: new Date(Date.UTC(2017, 4, 3, 3)) };
timezones[32] = { code: 'PXT', name: 'UTC -8:00 - Mexico/Pacific Standard Time (PXT)', utcOffset: -8, dstStart: new Date(Date.UTC(2016, 3, 3, 2)), dstEnd: new Date(Date.UTC(2016, 9, 30, 2)) };
timezones[33] = { code: 'MXT', name: 'UTC -7:00 - Mexico/Mountain Standard Time (MXT)', utcOffset: -7, dstStart: new Date(Date.UTC(2016, 3, 3, 2)), dstEnd: new Date(Date.UTC(2016, 9, 30, 2)) };
timezones[34] = { code: 'CXT', name: 'UTC -6:00 - Mexico/Central Standard Time (CXT)', utcOffset: -6, dstStart: new Date(Date.UTC(2016, 3, 3, 2)), dstEnd: new Date(Date.UTC(2016, 9, 30, 2)) };

export enum DateIntervals {
    second,
    minute,
    hour,
    day,
    week,
    month,
    quarter,
    year
}

//  Return an id from a timezone code or id.  Return -1 if not found.
export function getTimezoneId(timezone: any): number {

    if (typeof timezone == 'string') {     // like PST or GMT

        timezone = timezone.toUpperCase();

        for (var i = 1; i < 35; i++) {

            if (timezones[i].code == timezone)
                return i;
        }

        return -1;      // not found
    }
    else {
        return timezone;
    }
}

//  The current timezone offset in seconds that adjusts for DST.
export function utcOffset(timezoneId: number) {

    var timezone = timezones[this.getTimezoneId(timezoneId)];

    //  calculate the seconds off from GMT and adjust match
    var tzOffset = timezone.utcOffset * 3600;
    var useDate = new Date();
    useDate = addSeconds(tzOffset, useDate);

    //	adjust value for daylight savings time
    if (timezone.dstStart) {

        if (useDate.getTime() >= timezone.dstStart.getTime() && useDate.getTime() < timezone.dstEnd.getTime())
            return tzOffset + 3600;
    }
    return tzOffset;
}

export function currentDatetime(utcOffset: number = 0) {
    var date = new Date();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + utcOffset));
}

export function toUTC(strDate: string, utcOffset: number = 0) {
    var date = new Date(Date.parse(strDate));

    //  for dev purposes, adjust the result by the timezone offset
    var localOffset = date.getTimezoneOffset() * 60;

    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() + utcOffset + localOffset));
}

export function currentDate(utcOffset: number = 0) {
    var date = new Date();

    if (utcOffset == 0) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }

    var adjustedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + utcOffset));

    return new Date(Date.UTC(adjustedDate.getUTCFullYear(), adjustedDate.getUTCMonth(), adjustedDate.getUTCDate()));
}

export function currentMonth(utcOffset: number = 0): Date {
    return addMonths(month(currentDate(utcOffset)));
}

export function monthCode(date?: Date, utcOffset?: number): string {
    if (!date)
        date = currentDate(utcOffset);

    return date.getUTCFullYear() + '-' + ('0' + date.getUTCMonth() + 1).slice(-2);
}

//  Format a date into yyyy-mm-dd hh:mm:ss.  If the date has no epoch component, return in the format yyyy-mm-dd
export function dateToString(date: Date, includeTime: boolean = true): string {
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1;
    var hour = date.getUTCHours();
    var minute = date.getUTCMinutes();
    var second = date.getUTCSeconds();

    var ret = date.getUTCFullYear() + '-' + (month <= 9 ? '0' + month.toString() : month.toString()) + '-' + (day <= 9 ? '0' + day.toString() : day.toString());

    if (includeTime && (hour != 0 || minute != 0 || second != 0))
        ret += ' ' + (hour <= 9 ? '0' + hour.toString() : hour.toString()) + ":" + (minute <= 9 ? '0' + minute.toString() : minute.toString()) + ':' + (second <= 9 ? '0' + second.toString() : second.toString());

    return ret;
}

//  Add a number of minutes to a date.  The base date defaults to the epoch start.  The result is to the minute.
export function addMinutes(minutes: number, date?: Date) {

    if (!date) date = start();

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), minutes * 60));
}

//  Add a number of hours to a date.  The base date defaults to the epoch start.  The result is to the hour.
export function addHours(hours: number, date?: Date) {

    if (!date) date = start();

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 0, hours * 3600));
}

//  Add a number of days to a date.  The base date defaults to the epoch start.
export function addDays(days: number, date?: Date) {

    if (!date) date = start();

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

//  Add a number of months to a date.  The base date defaults to the epoch start.
export function addMonths(months: number, date?: Date) {

    if (!date) date = start();

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));
}

//  Add a number of years to a date.  The base date defaults to the epoch start.
export function addYears(years: number, date?: Date) {

    if (!date) date = start();

    return new Date(Date.UTC(date.getUTCFullYear() + years, date.getUTCMonth(), date.getUTCDate()));
}

//  Add a number of seconds to a date.  The base date defaults to the epoch start.
export function startOfDate(date?: Date) {
    if (!date) date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
}


//  Add a number of seconds to a date.  The base date defaults to the epoch start.
export function addSeconds(seconds: number, date?: Date) {

    if (!date) date = start();

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + seconds));
}

//  Return the difference in intervals between two dates.  If the second date is not passed in, the start date
//  defaults to 1999-01-01.
export function diff(interval: DateIntervals, date1: Date, date2?: Date): number {

    if (!date2) {
        date2 = date1;
        date1 = start();
    }

    // convert to utc seconds from 1999-01-01
    switch (interval) {

        case DateIntervals.second:
            return second(date2) - second(date1);

        case DateIntervals.minute:
            return minute(date2) - minute(date1);

        case DateIntervals.hour:
            return hour(date2) - hour(date1);

        case DateIntervals.day:
            return day(date2) - day(date1);

        case DateIntervals.week:
            return week(date2) - week(date1);

        case DateIntervals.month:
            return month(date2) - month(date1);

        case DateIntervals.quarter:
            return quarter(date2) - quarter(date1);

        case DateIntervals.year:
            return date2.getUTCFullYear() - date1.getUTCFullYear();
    }
}

/**
 *
 * Get date elements in timeframes since 1999, in UTC.  The following routines all assume
 * that standard.
 *
 */

//  ALL epoch intervals (except year) are from 1999-01-01
export function start(): Date {
    return new Date(Date.UTC(1999, 0, 1));
}

//  Return milliseconds from 1999-01-01
export function millisecond(date?: Date) {

    if (!date)
        date = new Date();

    var msFromEpoch: number = date.getTime();
    return msFromEpoch - 915148800000;   // convert to utc milliseconds from 1999-01-01
}

//  Return seconds from 1999-01-01
export function second(date?: Date) {

    if (!date)
        date = new Date();

    var secondsFromEpoch: number = date.getTime() / 1000;
    return Math.round(secondsFromEpoch) - 915148800;   // convert to utc seconds from 1999-01-01
}

//  Return minutes from 1999-01-01
export function minute(date?: Date) {

    if (!date)
        date = new Date();

    //  strip off secs off dates
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));

    var seconds1: number = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2: number = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.round((seconds2 - seconds1) / 60);
}

//  Return hours from 1999-01-01
export function hour(date?: Date) {

    if (!date)
        date = new Date();

    //  strip off minutes/secs off dates
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours()));

    var seconds1: number = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2: number = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.round((seconds2 - seconds1) / 3600);
}

//  Return days from 1999-01-01
export function day(date?: Date) {

    if (!date)
        date = new Date();

    //  strip off hours/minutes/secs off dates
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    var seconds1: number = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2: number = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.floor((seconds2 - seconds1) / 3600 / 24);
}

//  Return weeks from 1999-01-01
export function week(date?: Date) {

    if (!date)
        date = new Date();

    var date1 = start();
    var seconds1: number = Math.round(date1.getTime() / 1000) - 915148800 - (24 * 3600 * 5);
    var seconds2: number = Math.round(date.getTime() / 1000) - 915148800;
    return Math.floor((seconds2 - seconds1) / 3600 / 24 / 7);
}

//  Return months from 1999-01-01
export function month(date?: Date) {

    if (!date)
        date = new Date();

    var date1 = start();
    return (date.getUTCFullYear() - date1.getUTCFullYear()) * 12 + (date.getUTCMonth() - date1.getUTCMonth());
}

//  Return quarters from 1999-01-01
export function quarter(date?: Date) {

    if (!date)
        date = new Date();

    var date1 = start();
    var q1 = Math.floor(date1.getMonth() / 4);
    var q2 = Math.floor(date.getMonth() / 4);
    return (date.getUTCFullYear() - date1.getUTCFullYear()) * 4 + (q2 - q1);
}

//  Convert a timezone description or id into a formatted timezone id
export function formatTimezone(param: string) {
    var timezoneId: string = 'PST';

    //  get timezone
    if (param) {

        //  pull timezone id out of timezone description
        if (param.indexOf('(') > -1) {
            timezoneId = param.substr(param.indexOf('(') + 1, 3).toUpperCase();
        } else {
            timezoneId = param;
        }
    }

    var timezoneFound = false;

    //  validate timezone
    for (var i = 0; i < timezones.length; i++) {

        if (timezones[i + 1].code == timezoneId) {
            timezoneFound = true;
            break;
        }
    }

    if (!timezoneFound) {
        timezoneId = null;  //  indicates error
    }

    return timezoneId;
}

