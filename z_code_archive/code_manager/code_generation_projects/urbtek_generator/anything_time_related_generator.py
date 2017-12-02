# coding=utf-8

"""
This module, database_generator.py, will generate the anything_time_related.py module.
"""

from code_manager.abstract_definitions.classes import ParentClass as PC
from code_manager.abstract_definitions.variables import BooleanFieldWithGetter as BFWG
from code_manager.abstract_definitions.variables import ObjectField as OF
from code_manager.abstract_definitions.variables import ListField as LF
from code_manager.abstract_definitions.variables import BooleanField as BF
from code_manager.abstract_definitions.classes import ChildClass as CC
from code_manager.abstract_definitions.variables import StringParameter as SP
from code_manager.abstract_definitions.variables import IntegerParameter as IP
from code_manager.abstract_definitions.variables import IntegerField as IF
from code_manager.abstract_definitions.functions import Function as F
from code_manager.code_generator_support.import_error_mask import c
from code_manager.code_generator_support.import_error_mask import cc
from code_manager.abstract_definitions.code_file import LibraryFile as CFL
from code_manager.abstract_definitions.variables import ParameterValue as PV
from code_manager.abstract_definitions.variables import ListParameter as LP
from code_manager.abstract_definitions.variables import ObjectParameter as OP

anything_time_related = CFL('small useful utilities for time related programming.')

get_datetime_for_a_random_day_of_this_month_as_unix_time = F('Used previously for testing purposes. Keeping this code around for time being.')
c("""
now = datetime.datetime.now()
number_of_days_in_this_month = calendar.monthrange(now.year, now.month)[1]
new_random_day = now.replace(day=random.randint(1, number_of_days_in_this_month))
return time.mktime(new_random_day.timetuple())
""")

EasyTimer             = PC('A timer that starts once the object is initialized. The timer can either be manually stopped and then have the time be printed or just print the time.')
_start_time           = OF('time.time()', 'The start time of this timer.')
_manually_stopped     = BF('None', 'If this timer was manually stopped or not.')

stop                  = F('This stops the timer. If this function is not called the timer will automatically stop once printed out.')
c("""
self._manually_stopped = 'elapsed time : ' + str('{0:2f}'.format(time.time() - self._start_time))
""")

__str__               = F('Stops the timer and prints \'elapsed time : + <time in seconds>\'.')
c("""
if self._manually_stopped is None:
	return 'elapsed time : ' + str('{0:2f}'.format(time.time() - self._start_time))
return self._manually_stopped
""")

IterativeStopClock    = PC('Currently only a single use class so it will not be heavily documented (yet).')
_iteration_sleep_time = IP('The duration of time to sleep for each iteration.')
_total_wait_time      = IP('How long this clock needs to wait for.')
_elapsed_wait_time    = IF('0', 'How long the clock has waited for so far.')
_keep_running         = BF('True', 'A boolean indicating if this clocked finished naturally or not.')

completed_naturally   = F('This function returns a boolean indicating if the clock finished on its own {1} or was stooped {0}.')
c('return self._keep_running')

should_keep_iterating = F('This function returns a boolean indicating if the IterativeStopClock instance should keep on iterating {1} or not {0}.')
c('return (self._elapsed_wait_time < self._total_wait_time) and self._keep_running ### {0} - should not keep iterating, {1} - should keep iterating.#RT:bool')

sleep_an_iteration    = F('This function call will have the current thread sleep for the iteration sleep time duration.')
c("""
time.sleep(self._iteration_sleep_time)
self._elapsed_wait_time += self._iteration_sleep_time
""")

stop                  = F('This function stops the IterativeStopClock instance and the method \'completed_naturally\' will now return \'False\'.')
c('self._keeping_running = False')
