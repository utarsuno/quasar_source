# coding=utf-8

"""This module, entity_local_testing.py, is used for local testing of Entities."""

from quasar_source_code.entities import entity as e
from quasar_source_code.entities import entity_time as et
from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta

# Universal information.
first_day_of_courses = ta.get_specific_day(year=2017, month=8, day=28)
last_day_of_courses  = ta.get_specific_day(year=2017, month=8, day=8)

'''  __     ___  ___  ___  __   ___      ___                 ___  __            ___    __        __
	|  \ | |__  |__  |__  |__) |__  |\ |  |  |  /\  |       |__  /  \ |  |  /\   |  | /  \ |\ | /__`
	|__/ | |    |    |___ |  \ |___ | \|  |  | /~~\ |___    |___ \__X \__/ /~~\  |  | \__/ | \| .__/
'''
math_220 = e.Entity('Math 220')
math_220.add_information('Professor', 'Gerard Awanou')
math_220.add_information('Professor\'s Website', 'http://homepages.math.uic.edu/~awanou/Math220/')
math_220.add_information('Course Website', 'https://www.math.uic.edu/coursepages/math220/index_html')

math_220_lecture = e.Entity('Lecture')
math_220_lecture.add_information('Location', 'SES 130')

math_220_ta_session = e.Entity('TA Session')
math_220_ta_session.add_information('Location', 'Stevenson Hall 215')
math_220_ta_session.add_information('TA\'s name', 'Kevin Vissuet')
math_220.add_entities([math_220_lecture, math_220_ta_session])

time_blocks_220_lecture    = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_220_ta_session = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_220_lecture.add_time_blocks([et.TimeBlock(et.Day.MONDAY, 11, 00, et.Day.MONDAY, 11, 50),
                                         et.TimeBlock(et.Day.WEDNESDAY, 11, 00, et.Day.WEDNESDAY, 11, 50),
                                         et.TimeBlock(et.Day.FRIDAY, 11, 00, et.Day.FRIDAY, 11, 50)])
time_blocks_220_ta_session.add_time_blocks(et.TimeBlock(et.Day.TUESDAY, 11, 00, et.Day.TUESDAY, 11, 50))
math_220_lecture.add_time_blocks(time_blocks_220_lecture)
math_220_ta_session.add_time_blocks(time_blocks_220_ta_session)

'''              ___       __                __   ___  __   __
	|    | |\ | |__   /\  |__)     /\  |    / _` |__  |__) |__)  /\
	|___ | | \| |___ /~~\ |  \    /~~\ |___ \__> |___ |__) |  \ /~~\
'''
math_310 = e.Entity('Math 310')
math_310.add_information('Location', 'SES 230')
math_310.add_information('Professor', 'Julius Ross')
math_310.add_information('Professor\s Website', 'http://homepages.math.uic.edu/~julius/')
math_310.add_information('Course Website', 'https://www.math.uic.edu/math310')

time_blocks_310 = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_310.add_time_blocks([et.TimeBlock(et.Day.MONDAY, 14, 50, et.Day.MONDAY, 14, 50),
                                 et.TimeBlock(et.Day.WEDNESDAY, 14, 50, et.Day.WEDNESDAY, 14, 50),
                                 et.TimeBlock(et.Day.FRIDAY, 14, 50, et.Day.FRIDAY, 14, 50)])
math_310.add_time_blocks(time_blocks_310)
'''  __   __         __       ___  ___  __      __       __  ___  ___        __
	/  ` /  \  |\/| |__) |  |  |  |__  |__)    /__` \ / /__`  |  |__   |\/| /__`
	\__, \__/  |  | |    \__/  |  |___ |  \    .__/  |  .__/  |  |___  |  | .__/
'''
cs_361 = e.Entity('CS 361')
cs_361.add_information('Professor', 'John T. Bell')
cs_361.add_information('Professor\'s Website', 'https://www.cs.uic.edu/~i361/')
cs_361.add_information('Piazza Link', 'https://piazza.com/class/iyq9ste59eyp7')

cs_361_lecture = e.Entity('Lecture')
cs_361_lecture.add_information('Location', 'LCD4')

cs_361_ta_session = e.Entity('TA Session')
cs_361_ta_session.add_information('Location', 'SES 205B')
cs_361_ta_session.add_information('TA\'s name', 'TBD')

cs_361.add_entities([cs_361_lecture, cs_361_ta_session])

time_blocks_361_lecture = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_361_lecture.add_time_blocks([et.TimeBlock(et.Day.TUESDAY, 14, 00, et.Day.TUESDAY, 15, 15),
                                 et.TimeBlock(et.Day.THURSDAY, 14, 00, et.Day.THURSDAY, 15, 15)])
cs_361_lecture.add_time_blocks(time_blocks_361_lecture)

time_blocks_361_ta_session = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_361_ta_session.add_time_blocks(et.TimeBlock(et.Day.TUESDAY, 16, 00, et.Day.TUESDAY, 16, 50))
cs_361_ta_session.add_time_blocks(time_blocks_361_ta_session)
'''  __   __         __       ___  ___  __      __   __        __          __   __
	/  ` /  \  |\/| |__) |  |  |  |__  |__)    / _` |__)  /\  |__) |__| | /  ` /__`
	\__, \__/  |  | |    \__/  |  |___ |  \    \__> |  \ /~~\ |    |  | | \__, .__/
'''
cs_425 = e.Entity('CS 425')

cs_425_lecture = e.Entity('Lecture')
cs_425_lecture.add_information('Professor', 'Robert V. Kenyon')
cs_425_lecture.add_information('Location', 'TBH 180G')

cs_425_ta_session = e.Entity('TA Session')
cs_425_ta_session.add_information('TA\'s name', 'TBD')
cs_425_ta_session.add_information('Location', 'TBD')

cs_425.add_entities([cs_425_lecture, cs_425_ta_session])

time_blocks_425_lecture = et.TimeBlocks(first_day_of_courses, last_day_of_courses)
time_blocks_425_lecture.add_time_blocks([et.TimeBlock(et.Day.TUESDAY, 12, 30, et.Day.TUESDAY, 13, 45),
                                         et.TimeBlock(et.Day.THURSDAY, 12, 30, et.Day.THURSDAY, 13, 45)])

'''  ___      ___   ___                              __   ___  __
    |__  |\ |  |  |  |  \ /     |\/|  /\  |\ |  /\  / _` |__  |__)
    |___ | \|  |  |  |   |      |  | /~~\ | \| /~~\ \__> |___ |  \
'''
entity_manager = e.EntityManager()
entity_manager.add_entities([math_220, math_310, cs_361, cs_425])

entity_manager.print_todays_relevant_information()
