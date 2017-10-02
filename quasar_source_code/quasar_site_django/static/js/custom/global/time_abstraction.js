'use strict'

// Solution from https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
function get_today_with_n_days_offset(n) {
    var date = new Date()

    var result = new Date(date)
    result.setDate(result.getDate() + n)

    var day   = result.getDate()
    var month = result.getMonth() + 1
    var year  = result.getYear()
    return month + '/' + day + '/' + year.toString().replace('117', '2017')
}

function get_just_date_of_date_of_n_days_offset(n) {
    var date = new Date()
    var result = new Date(date)
    result.setDate(result.getDate() + n)
    return result.getDate()
}

function get_list_of_dates_consisting_of_this_and_next_week() {
    var dates      = []
    var date       = new Date() // Right now instance.
    var day_offset = date.getDay()

    if (day_offset == 0) {
        day_offset = 6
    } else {
        day_offset--
    }

    console.log('Day offset is : ' + day_offset)

    for (var i = 0; i < 14; i++) {
        dates.push(get_today_with_n_days_offset(i - day_offset))
    }

    return dates
}




/*
def get_current_day_of_the_week_number() -> int:
	"""Returns today's day as an integer."""
	return datetime.now().weekday()



def get_day_object_from_current_weeks_day(day: Day):
	"""Returns a Date object that's the date of the day of this week that the Day is."""
	today = get_today()
	offset = get_current_day_of_the_week_number()
	if offset == int(day):
		return today
	elif offset > int(day):
		return today - timedelta(days=offset - int(day))
	else:
		return today + timedelta(days=int(day) - offset)
*/


