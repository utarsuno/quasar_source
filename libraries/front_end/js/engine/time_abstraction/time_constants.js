'use strict';


const TIME_TYPE_YEAR_CURRENT  = 21;
const TIME_TYPE_YEAR_STATIC   = 22;
const TIME_TYPE_MONTH_CURRENT = 23;
const TIME_TYPE_MONTH_STATIC  = 24;
const TIME_TYPE_DAY_CURRENT   = 25;
const TIME_TYPE_DAY_STATIC    = 26;

/*     __       ___          __   __        __  ___           ___  __
 |\/| /  \ |\ |  |  |__|    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 |  | \__/ | \|  |  |  |    \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */


const MONTH_NAMES = [MONTH_JANUARY_STRING, MONTH_FEBRUARY_STRING, MONTH_MARCH_STRING, MONTH_APRIL_STRING, MONTH_MAY_STRING, MONTH_JUNE_STRING, MONTH_JULY_STRING, MONTH_AUGUST_STRING, MONTH_SEPTEMBER_STRING, MONTH_OCTOBER_STRING, MONTH_NOVEMBER_STRING, MONTH_DECEMBER_STRING];

/*__               __   __        __  ___           ___  __
 |  \  /\  \ /    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 |__/ /~~\  |     \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
const DAY_NAMES = [DAY_MONDAY_STRING, DAY_TUESDAY_STRING, DAY_WEDNESDAY_STRING, DAY_THURSDAY_STRING, DAY_FRIDAY_STRING, DAY_SATURDAY_STRING, DAY_SUNDAY_STRING];

/*__        __   __                ___            __  ___    __        __
 / _` |    /  \ |__)  /\  |       |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 \__> |___ \__/ |__) /~~\ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
function get_month_number_from_string(s) {
    return MONTH_NAMES.indexOf(s);
}

function get_day_number_from_string(s) {
    return DAY_NAMES.indexOf(s);
}

function get_month_string_from_number(n) {
    return MONTH_NAMES[n];
}

function get_day_string_from_number(n) {
    return DAY_NAMES[n];
}

function get_current_month_number() {
    let d = new Date();
    return d.getMonth();
}

function get_current_year_number() {
    let d = new Date();
    return d.getFullYear();
}

// Temporary.
function get_current_hour() {
    let d = new Date();
    return d.getHours();
}

// Temporary.
function get_current_minute() {
    let d = new Date();
    return d.getMinutes();
}

// From : https://stackoverflow.com/questions/13146418/find-all-the-days-in-a-month-with-date-object
/**
 * @param {int} month : The month number, 0 based
 * @param {int} year  :The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function get_days_in_month(month, year) {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

/*___          ___     __   __        __  ___           ___  __
   |  |  |\/| |__     /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
   |  |  |  | |___    \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
// TODO : These need to get updated when client side hits midnight!
const CURRENT_MONTH = new MonthInstance(TIME_TYPE_MONTH_CURRENT);
const CURRENT_DAY   = new DayInstance(TIME_TYPE_DAY_CURRENT, CURRENT_MONTH);
