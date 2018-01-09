# coding=utf-8


"""TEMP MOVE TO C"""

data = '''Date,Open,High,Low,Close,Adj Close,Volume
2011-07-14,50.020000,50.040001,49.980000,49.980000,43.832314,3400
2011-07-15,49.900002,49.990002,49.889999,49.990002,43.841084,19500
2011-07-18,50.000000,50.000000,49.910000,49.910000,43.770916,19000
2011-07-19,49.889999,49.980000,49.869999,49.980000,43.832314,13300
2011-07-20,50.000000,50.130001,49.970001,49.980000,43.832314,3100
2011-07-21,49.930000,49.930000,49.889999,49.910000,43.770916,48900
2011-07-22,49.919998,49.980000,49.919998,49.980000,43.832314,9800
2011-07-25,49.900002,49.939999,49.889999,49.900002,43.762150,10600
2011-07-26,49.919998,49.970001,49.919998,49.959999,43.814785,4300
2011-07-27,49.939999,49.950001,49.910000,49.919998,43.779701,8500
2011-07-28,50.029999,50.040001,50.000000,50.040001,43.884941,12500
2011-07-29,49.759998,50.299999,49.759998,50.299999,44.112942,22800
2011-08-01,50.130001,50.410000,50.130001,50.400002,44.228783,30400
2011-08-02,50.500000,50.730000,50.480000,50.730000,44.518375,25400
2011-08-03,50.740002,50.830002,50.720001,50.770000,44.553482,44800
2011-08-04,50.779999,51.009998,50.779999,51.009998,44.764091,34900
2011-08-05,50.880001,50.930000,50.709999,50.779999,44.562263,32700
2011-08-08,50.410000,50.970001,50.410000,50.939999,44.702671,11800
2011-08-09,50.889999,51.259998,50.849998,51.160000,44.895710,86000
2011-08-10,51.270000,51.340000,51.240002,51.340000,45.053684,12700
2011-08-11,51.389999,51.389999,50.990002,51.029999,44.781635,18500
2011-08-12,51.049999,51.099998,50.970001,51.099998,44.843071,27700
2011-08-15,51.110001,51.130001,51.000000,51.040001,44.790424,21100
2011-08-16,51.080002,51.150002,51.000000,51.130001,44.869423,25400
2011-08-17,51.180000,51.299999,51.180000,51.279999,45.001034,19400
2011-08-18,51.450001,51.520000,51.360001,51.500000,45.194088,104800
2011-08-19,51.200001,51.310001,51.200001,51.299999,45.018600,26100
2011-08-22,51.320000,51.330002,51.209999,51.250000,44.974705,21700
2011-08-23,51.220001,51.240002,51.090000,51.139999,44.878181,29200
2011-08-24,51.099998,51.099998,50.939999,50.950001,44.711445,26100
2011-08-25,50.910000,51.009998,50.889999,51.000000,44.755325,20100
2011-08-26,51.099998,51.130001,51.009998,51.060001,44.807980,20700
2011-08-29,50.950001,51.240002,50.849998,50.930000,44.693909,38100
2011-08-30,51.200001,51.270000,51.130001,51.259998,44.983456,49800
2011-08-31,51.200001,51.230000,51.160000,51.160000,44.895710,68000
2011-09-01,51.180000,51.250000,51.070000,51.230000,45.022289,30900
2011-09-02,51.299999,51.509998,51.299999,51.480000,45.241985,43700'''


INDEX_DATE           = 0
INDEX_OPEN           = 1
INDEX_HIGH           = 2
INDEX_LOW            = 3
INDEX_CLOSE          = 4
INDEX_ADJUSTED_CLOSE = 5
INDEX_VOLUME         = 6


days = []
data = data.split('\n')
for i, l in enumerate(data):
	if i != 0:
		raw_data = l.split(',')
		clean_data = []
		for j, rd in enumerate(raw_data):
			if j == INDEX_DATE:
				clean_data.append(rd)
			else:
				clean_data.append(float(rd))
		days.append(clean_data)


def simple_moving_average(start_date, end_date, moving_average_day_range):
	"""TODO : """
	global days
	values = []

	current_day = 0
	day_range = start_date - end_date

	for i, d in enumerate(days):
		if i >= moving_average_day_range:
			average = 0
			j = 0
			while j < moving_average_day_range:
				average += days[i + start_date - j][INDEX_OPEN]
				j += 1
			average /= moving_average_day_range
			values.append(average)

	return values


# Needs lots of points to be more accurate (at least 200 points)
# NOTE : known as ema
def exponential_moving_average(start_date, end_date, moving_day_range):
	# for the first point just start off with a single sma value.

	# moving_day_range is called the period
	# formula overall is adjustable (all constants should be dynamically tested)
	multiplier = 2 / (moving_day_range + 1)

	# values is exponential_moving_average calculated values

	# for all other values
	# (current_close - values[-1]) * multiplier + values[-1]


def mac_d(ema_a, ema_b):
	# standard is 12, 26, 9

	# this is actually a list (list - list)
	mac_d_line = ema_a - ema_b
	signal_line = -9999 # ema_9 of mac_d_line

	mac_d_histogram = mac_d_line - signal_line

	return mac_d_line, signal_line, mac_d_histogram


def stochastic_oscillator(list_of_close_values, lowest_low, highest_high):
	# ll of that period
	# hh of that period

	cd = -9999 # cd is current_day_close

	percent_k = 100 * (cd - lowest_low) / (highest_high - lowest_low)

	# 80 + high end of range (over bought)
	# 20 - low end of range (over sold)
	percent_d = -999 # 3 day moving average of percent k

	return percent_d


#for d in days:
#	print(d[1])

#sma = simple_moving_average(0, 100, 10)

#print(sma)
#for d in sma:
#	print(d)

