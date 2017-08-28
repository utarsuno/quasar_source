# coding=utf-8

"""This module, entity_local_testing.py, is used for local testing of Entities."""

from quasar_source_code.entities import entity as e
from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta

# Universal information.
first_day_of_courses = ta.get_specific_day(year=2017, month=8, day=28)
last_day_of_courses  = ta.get_specific_day(year=2017, month=8, day=8)

# Math 220
math_220 = e.Entity('Math 220')
math_220.add_information('Location', 'SES 130')
math_220.add_information('Professor', 'Gerard Awanou')
math_220.add_information('Professor\'s Website', 'http://homepages.math.uic.edu/~awanou/Math220/')
math_220.add_information('Course Website', 'https://www.math.uic.edu/coursepages/math220/index_html')

math_220_lecture = e.Entity('Lecture')
math_220_ta_session = e.Entity('TA Session')

time_blocks_220_lecture    = e.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_220_ta_session = e.TimeBlocks(first_day_of_courses, last_day_of_courses)
tb_220_lecture_monday    = e.TimeBlock(e.Day.MONDAY, 11, 00, e.Day.MONDAY, 11, 50)
tb_220_lecture_wednesday = e.TimeBlock(e.Day.WEDNESDAY, 11, 00, e.Day.WEDNESDAY, 11, 50)
tb_220_lecture_friday    = e.TimeBlock(e.Day.FRIDAY, 11, 00, e.Day.FRIDAY, 11, 50)
tb_220_ta_session        = e.TimeBlock(e.Day.TUESDAY, 11, 00, e.Day.TUESDAY, 11, 50)
time_blocks_220_lecture.add_time_blocks([tb_220_lecture_monday, tb_220_lecture_wednesday, tb_220_lecture_friday])

math_220_lecture.add_time_blocks(time_blocks_220_lecture)
math_220_ta_session.add_time_blocks(time_blocks_220_ta_session)

# Math 310
math_310 = e.Entity('Math 310')
math_310.add_information('Location', 'SES 230')
math_310.add_information('Professor', 'Julius Ross')
math_310.add_information('Website', 'TODO')

time_blocks_310 = e.TimeBlocks(first_day_of_courses, last_day_of_courses)
tb_310_monday    = e.TimeBlock(e.Day.MONDAY, 12, 30, e.Day.MONDAY, 13, 45)
tb_310_wednesday = e.TimeBlock(e.Day.WEDNESDAY, 12, 30, e.Day.WEDNESDAY, 13, 45)
tb_310_friday    = e.TimeBlock(e.Day.FRIDAY, 12, 30, e.Day.FRIDAY, 13, 45)
time_blocks_310.add_time_blocks([tb_310_monday, tb_310_wednesday, tb_310_friday])

math_310.add_time_blocks(time_blocks_310)


# CS 361
cs_361 = e.Entity('CS 361')


# CS 425
cs_425 = e.Entity('CS 425')

