'use strict';

// Solution from https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
function get_today_with_n_days_offset(n) {
    var date = new Date();

    var result = new Date(date);
    result.setDate(result.getDate() + n);

    var day   = result.getDate();
    var month = result.getMonth() + 1;
    var year  = result.getYear();
    return month + '/' + day + '/' + year.toString().replace('117', '2017');
}

function get_just_date_of_date_of_n_days_offset(n) {
    var date = new Date();
    var result = new Date(date);
    result.setDate(result.getDate() + n);
    return result.getDate();
}

function get_list_of_dates_consisting_of_this_and_next_week() {
    var dates      = [];
    var date       = new Date(); // Right now instance.
    var day_offset = date.getDay();

    if (day_offset == 0) {
        day_offset = 6;
    } else {
        day_offset--;
    }

    for (var i = 0; i < 14; i++) {
        dates.push(get_today_with_n_days_offset(i - day_offset));
    }
    return dates;
}

function get_day_of_week_as_word_from_date(date_object) {
    var n = date_object.getDay();

}