# coding=utf-8

"""This module, math220.py, holds entity information for my Math220 course."""

from quasar_source_code.entities import entity as e
from quasar_source_code.entities.entity_task import EntityTask
from quasar_source_code.universal_code import time_abstraction as ta

# Universal information.
first_day_of_courses = ta.get_specific_day(year=2017, month=8, day=28)
last_day_of_courses  = ta.get_specific_day(year=2017, month=8, day=8)

math_220 = e.Entity('Math 220')
math_220.add_information('Professor', 'Gerard Awanou')
math_220.add_information('Professor\'s Website', 'http://homepages.math.uic.edu/~awanou/Math220/')
math_220.add_information('Course Website', 'https://www.math.uic.edu/coursepages/math220/index_html')

# Lectures.
math_220_lecture = e.Entity('Lecture')
math_220_lecture.add_information('Location', 'SES 130')
time_blocks_220_lecture    = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_220_lecture.add_time_blocks([ta.DateRange(ta.GenericDayTime(ta.Day.MONDAY, 11, 00), ta.Duration(minutes=50)),
                                         ta.DateRange(ta.GenericDayTime(ta.Day.WEDNESDAY, 11, 00), ta.Duration(minutes=50)),
                                         ta.DateRange(ta.GenericDayTime(ta.Day.FRIDAY, 11, 00), ta.Duration(minutes=50))])
math_220_lecture.add_time_blocks(time_blocks_220_lecture)

# TA session.
math_220_ta_session = e.Entity('TA Session')
math_220_ta_session.add_information('Location', 'Stevenson Hall 215')
math_220_ta_session.add_information('TA\'s name', 'Kevin Vissuet')
time_blocks_220_ta_session = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_220_ta_session.add_time_blocks(ta.DateRange(ta.GenericDayTime(ta.Day.TUESDAY, 11, 00), ta.Duration(minutes=50)))
math_220_ta_session.add_time_blocks(time_blocks_220_ta_session)

# Exams
math_220_exams = e.Entity('Exams')
math_220_exams_tb = et.TimeBlocks(None, None)

# Homeworks.
math_220_homework = e.Entity('Homeworks')

homework220_1 = EntityTask('First homework due second week wednesday', math_220_homework)
homework220_1.due_date = ta.get_specific_day(2017, 'Sep', 6)
homework220_1.description = '[1.1] - {1-10, 15}, [1.2] - {1,3,5,9,11,20}, [1.3] - {1,5,7}'

homework220_2 = EntityTask('Second homework due third week wednesday', math_220_homework)
homework220_2.due_date = ta.get_specific_day(2017, 'Sep', 13)
homework220_2.description = '[1.4] - {1, 7, 9*, 11*}, [2.1, 2.2] - {2.2: 2, 3, 4, 7}'

homework220_3 = EntityTask('Third homework due fourth week wednesday', math_220_homework)
homework220_3.due_date = ta.get_specific_day(2017, 'Sep', 20)
homework220_3.description = '[2.2] - {9, 13, 18, 23}, [2.3] - {2, 4, 5, 10, 13, 17, 18, 22, 23}, [2.4] - {9, 11, 18, 21, 24, 29}'

homework220_4 = EntityTask('Fourth homework due fifth week wednesday', math_220_homework)
homework220_4.due_date = ta.get_specific_day(2017, 'Sep', 27)
homework220_4.description = '[3.2] - {1, 2, 5, 9}, [3.4] - {1, 2, 7, 8, 24}, [3.6, 3.7] - {3.6: 1, 5, 7*, 20*, 3.7: 1, 3, 5*, 7*, 19*}'

homework220_5 = EntityTask('Fifth homework due sixth week wednesday', math_220_homework)
homework220_5.due_date = ta.get_specific_day(2017, 'Oct', 4)
homework220_5.description = '[4.1] - {1, 2, 4, 5}, [4.2] - {1, 3, 6, 13, 16, 19, 28, 30}, [4.3] - {2, 3, 4, 9, 13, 14, 23, 26}'

homework220_6 = EntityTask('Sixth homework due seventh week wednesday', math_220_homework)
homework220_6.due_date = ta.get_specific_day(2017, 'Oct', 11)
homework220_6.description = '[4.4] - {1, 2, 7, 10, 12, 19, 27, 30}'

homework220_7 = EntityTask('Seventh homework due eighth week wednesday', math_220_homework)
homework220_7.due_date = ta.get_specific_day(2017, 'Oct', 18)
homework220_7.description = '[4.5] - {1, 5, 13, 17, 19, 26, 28, 43}, [4.6] - {1, 4, 9}, [4.7] - {9, 12, 16, 19, 21}'

homework220_8 = EntityTask('Eighth homework due ninth week wednesday', math_220_homework)
homework220_8.due_date = ta.get_specific_day(2017, 'Oct', 25)
homework220_8.description = '[4.7] - {36, 37, 38, 45, 47}, [4.9, 4.10] - {4.9: 3, 7, 14, 4.10: 1, 3, 10, 11}, [7.2] - {3, 4, 8, 9, 13, 17}'

homework220_9 = EntityTask('Ninth homework due tenth week wednesday', math_220_homework)
homework220_9.due_date = ta.get_specific_day(2017, 'Nov', 1)
homework220_9.description = '[7.3] - {6, 7, 9, 13, 16, 21, 25}, [7.4] - {1, 4, 5, 8, 9, 21}, [7.4, 7.5] - {7.4: 22, 23, 24, 25}'

homework220_10 = EntityTask('Tenth homework due eleventh week wednesday', math_220_homework)
homework220_10.due_date = ta.get_specific_day(2017, 'Nov', 8)
homework220_10.description = '[7.5] - {1, 4, 7, 8, 11, 17, 23}, [7.6] - {3, 5, 7, 11, 12, 15, 26}, [7.9] - {3, 7, 9, 13, 18, 23, 29}'

homework220_11 = EntityTask('Eleventh homework due twelve week wednesday', math_220_homework)
homework220_11.due_date = ta.get_specific_day(2017, 'Nov', 15)
homework220_11.description = '[5.1, 5.2] - {5.2: 1, 3, 4, 7}'

homework220_12 = EntityTask('Thirteenth homework due fourteenth week wednesday', math_220_homework)
homework220_12.due_date = ta.get_specific_day(2017, 'Nov', 22)
homework220_12.description = '[5.2] - {11, 19, 25}, [5.4] - {1, 2, 3, 7, 11, 12, 14}, [10.1, 10.2] - {10.2: 1, 5, 9, 12}'

homework220_13 = EntityTask('Fourteenth homework due fifteenth week wednesday', math_220_homework)
homework220_13.due_date = ta.get_specific_day(2017, 'Nov', 29)
homework220_13.description = '[10.2] - {15, 17, 19, 22}, [10.3] - {1, 2, 3, 4, 5, 6, 9, 10, 11}'

homework220_14 = EntityTask('Fifteenth homework due sixteenth week wednesday', math_220_homework)
homework220_14.due_date = ta.get_specific_day(2017, 'Dec', 6)
homework220_14.description = '[10.3, 10.4] - {10.3: 13, 15, 10.4: 1, 2, 3, 4, 5, 6}, [10.4] - {8, 10, 11, 14, 15}, [10.5] - {2, 6, 9, 10, 14}, [10.6] - {1, 3, 7, 8}'

# Now add the entities to Math220.
math_220.add_entities([math_220_lecture, math_220_ta_session, math_220_homework, math_220_exams])