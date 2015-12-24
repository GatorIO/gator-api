exports.timezones = [];
exports.timezones[0] = { code: 'UTC', name: 'UTC 0:00 - Coordinated Universal Time (UTC)', utcOffset: 0 };
exports.timezones[1] = { code: 'MIT', name: 'UTC -11:00 - Midway Islands Time (MIT)', utcOffset: -11 };
exports.timezones[2] = { code: 'HST', name: 'UTC -10:00 - Hawaii Standard Time (HST)', utcOffset: -10 };
exports.timezones[3] = { code: 'AST', name: 'UTC -9:00 - Alaska Standard Time (AST)', utcOffset: -9, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
exports.timezones[4] = { code: 'PST', name: 'UTC -8:00 - Pacific Standard Time (PST)', utcOffset: -8, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
exports.timezones[5] = { code: 'PNT', name: 'UTC -7:00 - Phoenix Standard Time (PNT)', utcOffset: -7 };
exports.timezones[6] = { code: 'MST', name: 'UTC -7:00 - Mountain Standard Time (MST)', utcOffset: -7, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
exports.timezones[7] = { code: 'CST', name: 'UTC -6:00 - Central Standard Time (CST)', utcOffset: -6, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
exports.timezones[8] = { code: 'EST', name: 'UTC -5:00 - Eastern Standard Time (EST)', utcOffset: -5, dstStart: new Date(Date.UTC(2016, 2, 13, 2)), dstEnd: new Date(Date.UTC(2016, 10, 6, 2)) };
exports.timezones[9] = { code: 'IET', name: 'UTC -5:00 - Indiana Eastern Standard Time (IET)', utcOffset: -5 };
exports.timezones[10] = { code: 'PRT', name: 'UTC -4:00 - Puerto Rico/US Virgin Islands Time (PRT)', utcOffset: -4 };
exports.timezones[11] = { code: 'CNT', name: 'UTC -3:30 - Canada Newfoundland Time (CNT)', utcOffset: -3.5, dstStart: new Date(Date.UTC(2016, 2, 13, 1)), dstEnd: new Date(Date.UTC(2016, 10, 6, 1)) };
exports.timezones[12] = { code: 'AGT', name: 'UTC -3:00 - Argentina Standard Time (AGT)', utcOffset: -3 };
exports.timezones[13] = { code: 'BET', name: 'UTC -3:00 - Brazil Eastern Time (BET)', utcOffset: -3 };
exports.timezones[14] = { code: 'CAT', name: 'UTC -1:00 - Central African Time (CAT)', utcOffset: -1 };
exports.timezones[15] = { code: 'GMT', name: 'UTC 0:00 - Greenwich Mean Time (GMT)', utcOffset: 0, dstStart: new Date(Date.UTC(2016, 2, 27, 1)), dstEnd: new Date(Date.UTC(2016, 9, 30, 1)) };
exports.timezones[16] = { code: 'ECT', name: 'UTC +1:00 - European Central Time (ECT)', utcOffset: 1, dstStart: new Date(Date.UTC(2016, 2, 27, 1)), dstEnd: new Date(Date.UTC(2016, 9, 30, 1)) };
exports.timezones[17] = { code: 'EET', name: 'UTC +1:00 - Eastern European Time (EET)', utcOffset: 1, dstStart: new Date(Date.UTC(2016, 2, 27, 1)), dstEnd: new Date(Date.UTC(2016, 9, 30, 1)) };
exports.timezones[18] = { code: 'ART', name: 'UTC +2:00 - (Arabic) Egypt Standard Time (ART)', utcOffset: 2 };
exports.timezones[19] = { code: 'EAT', name: 'UTC +3:00 - Eastern African Time (EAT)', utcOffset: 3 };
exports.timezones[20] = { code: 'MET', name: 'UTC +3:30 - Middle East Time (MET)', utcOffset: 3.5 };
exports.timezones[21] = { code: 'NET', name: 'UTC +4:00 - Near East Time (NET)', utcOffset: 4 };
exports.timezones[22] = { code: 'PLT', name: 'UTC +5:00 - Pakistan Lahore Time (PLT)', utcOffset: 5 };
exports.timezones[23] = { code: 'IST', name: 'UTC +5:30 - India Standard Time (IST)', utcOffset: 5.5 };
exports.timezones[24] = { code: 'BST', name: 'UTC +6:00 - Bangladesh Standard Time (BST)', utcOffset: 6 };
exports.timezones[25] = { code: 'VST', name: 'UTC +7:00 - Vietnam Standard Time (VST)', utcOffset: 7 };
exports.timezones[26] = { code: 'CTT', name: 'UTC +8:00 - China Taiwan Time (CTT)', utcOffset: 8 };
exports.timezones[27] = { code: 'JST', name: 'UTC +9:00 - Japan Standard Time (JST)', utcOffset: 9 };
exports.timezones[28] = { code: 'ACT', name: 'UTC +9:30 - Australia Central Time (ACT)', utcOffset: 9.5 };
exports.timezones[29] = { code: 'AET', name: 'UTC +10:00 - Australia Eastern Time (AET)', utcOffset: 10 };
exports.timezones[30] = { code: 'SST', name: 'UTC +11:00 - Solomon Standard Time (SST)', utcOffset: 11 };
exports.timezones[31] = { code: 'NST', name: 'UTC +12:00 - New Zealand Standard Time (NST)', utcOffset: 12, dstStart: new Date(Date.UTC(2016, 8, 25, 2)), dstEnd: new Date(Date.UTC(2017, 4, 3, 3)) };
exports.timezones[32] = { code: 'PXT', name: 'UTC -8:00 - Mexico/Pacific Standard Time (PXT)', utcOffset: -8, dstStart: new Date(Date.UTC(2016, 3, 3, 2)), dstEnd: new Date(Date.UTC(2016, 9, 30, 2)) };
exports.timezones[33] = { code: 'MXT', name: 'UTC -7:00 - Mexico/Mountain Standard Time (MXT)', utcOffset: -7, dstStart: new Date(Date.UTC(2016, 3, 3, 2)), dstEnd: new Date(Date.UTC(2016, 9, 30, 2)) };
exports.timezones[34] = { code: 'CXT', name: 'UTC -6:00 - Mexico/Central Standard Time (CXT)', utcOffset: -6, dstStart: new Date(Date.UTC(2016, 3, 3, 2)), dstEnd: new Date(Date.UTC(2016, 9, 30, 2)) };
(function (DateIntervals) {
    DateIntervals[DateIntervals["second"] = 0] = "second";
    DateIntervals[DateIntervals["minute"] = 1] = "minute";
    DateIntervals[DateIntervals["hour"] = 2] = "hour";
    DateIntervals[DateIntervals["day"] = 3] = "day";
    DateIntervals[DateIntervals["week"] = 4] = "week";
    DateIntervals[DateIntervals["month"] = 5] = "month";
    DateIntervals[DateIntervals["quarter"] = 6] = "quarter";
    DateIntervals[DateIntervals["year"] = 7] = "year";
})(exports.DateIntervals || (exports.DateIntervals = {}));
var DateIntervals = exports.DateIntervals;
function getTimezoneId(timezone) {
    if (typeof timezone == 'string') {
        timezone = timezone.toUpperCase();
        for (var i = 1; i < 35; i++) {
            if (exports.timezones[i].code == timezone)
                return i;
        }
        return -1;
    }
    else {
        return timezone;
    }
}
exports.getTimezoneId = getTimezoneId;
function utcOffset(timezoneId) {
    var timezone = exports.timezones[this.getTimezoneId(timezoneId)];
    var tzOffset = timezone.utcOffset * 3600;
    var useDate = new Date();
    useDate = addSeconds(tzOffset, useDate);
    if (timezone.dstStart) {
        if (useDate.getTime() >= timezone.dstStart.getTime() && useDate.getTime() < timezone.dstEnd.getTime())
            return tzOffset + 3600;
    }
    return tzOffset;
}
exports.utcOffset = utcOffset;
function currentDatetime(utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    var date = new Date();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + utcOffset));
}
exports.currentDatetime = currentDatetime;
function toUTC(strDate, utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    var date = new Date(Date.parse(strDate));
    var localOffset = date.getTimezoneOffset() * 60;
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() + utcOffset + localOffset));
}
exports.toUTC = toUTC;
function currentDate(utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    var date = new Date();
    if (utcOffset == 0) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    var adjustedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + utcOffset));
    return new Date(Date.UTC(adjustedDate.getUTCFullYear(), adjustedDate.getUTCMonth(), adjustedDate.getUTCDate()));
}
exports.currentDate = currentDate;
function currentMonth(utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    return addMonths(month(currentDate(utcOffset)));
}
exports.currentMonth = currentMonth;
function monthCode(date, utcOffset) {
    if (!date)
        date = currentDate(utcOffset);
    return date.getUTCFullYear() + '-' + ('0' + date.getUTCMonth() + 1).slice(-2);
}
exports.monthCode = monthCode;
function dateToString(date, includeTime) {
    if (includeTime === void 0) { includeTime = true; }
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
exports.dateToString = dateToString;
function addMinutes(minutes, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), minutes * 60));
}
exports.addMinutes = addMinutes;
function addHours(hours, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 0, hours * 3600));
}
exports.addHours = addHours;
function addDays(days, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}
exports.addDays = addDays;
function addMonths(months, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));
}
exports.addMonths = addMonths;
function addYears(years, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear() + years, date.getUTCMonth(), date.getUTCDate()));
}
exports.addYears = addYears;
function startOfDate(date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
}
exports.startOfDate = startOfDate;
function addSeconds(seconds, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + seconds));
}
exports.addSeconds = addSeconds;
function diff(interval, date1, date2) {
    if (!date2) {
        date2 = date1;
        date1 = start();
    }
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
exports.diff = diff;
function start() {
    return new Date(Date.UTC(1999, 0, 1));
}
exports.start = start;
function millisecond(date) {
    if (!date)
        date = new Date();
    var msFromEpoch = date.getTime();
    return msFromEpoch - 915148800000;
}
exports.millisecond = millisecond;
function second(date) {
    if (!date)
        date = new Date();
    var secondsFromEpoch = date.getTime() / 1000;
    return Math.round(secondsFromEpoch) - 915148800;
}
exports.second = second;
function minute(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2 = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.round((seconds2 - seconds1) / 60);
}
exports.minute = minute;
function hour(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours()));
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2 = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.round((seconds2 - seconds1) / 3600);
}
exports.hour = hour;
function day(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2 = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.floor((seconds2 - seconds1) / 3600 / 24);
}
exports.day = day;
function week(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800 - (24 * 3600 * 5);
    var seconds2 = Math.round(date.getTime() / 1000) - 915148800;
    return Math.floor((seconds2 - seconds1) / 3600 / 24 / 7);
}
exports.week = week;
function month(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    return (date.getUTCFullYear() - date1.getUTCFullYear()) * 12 + (date.getUTCMonth() - date1.getUTCMonth());
}
exports.month = month;
function quarter(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var q1 = Math.floor(date1.getMonth() / 4);
    var q2 = Math.floor(date.getMonth() / 4);
    return (date.getUTCFullYear() - date1.getUTCFullYear()) * 4 + (q2 - q1);
}
exports.quarter = quarter;
function formatTimezone(param) {
    var timezoneId = 'PST';
    if (param) {
        if (param.indexOf('(') > -1) {
            timezoneId = param.substr(param.indexOf('(') + 1, 3).toUpperCase();
        }
        else {
            timezoneId = param;
        }
    }
    var timezoneFound = false;
    for (var i = 0; i < exports.timezones.length; i++) {
        if (exports.timezones[i + 1].code == timezoneId) {
            timezoneFound = true;
            break;
        }
    }
    if (!timezoneFound) {
        timezoneId = null;
    }
    return timezoneId;
}
exports.formatTimezone = formatTimezone;
//# sourceMappingURL=epoch.js.map