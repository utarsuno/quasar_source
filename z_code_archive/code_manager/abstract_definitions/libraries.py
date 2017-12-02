# coding=utf-8

"""
This module, library.py, is used for generating and maintaining libraries.
"""
# Used for error catching and reporting.
from universal_code import debugging as dbg
# Used to do a simple HTTP GET.
import requests
# Used to run Python code asynchronously.
import threading # TODO : This is eventually going to be used to speed up this process.

# Current cached data. This is checked and potentially updated every single time this file is run.
cached_data = {
	'keyword'    : ['iskeyword', 'kwlist'],
	'sys'        : ['abiflags', 'argv', 'base_exec_prefix', 'base_prefix', 'byteorder', 'builtin_module_names', 'call_tracing', 'copyright', '_clear_type_cache', '_current_frames', '_debugmallocstats', 'dllhandle', 'displayhook', 'dont_write_bytecode', 'excepthook', '__displayhook__', '__excepthook__', 'exc_info', 'exec_prefix', 'executable', 'exit', 'flags', 'float_info', 'float_repr_style', 'getallocatedblocks', 'getcheckinterval', 'getdefaultencoding', 'getdlopenflags', 'getfilesystemencoding', 'getfilesystemencodeerrors', 'getrefcount', 'getrecursionlimit', 'getsizeof', 'getswitchinterval', '_getframe', 'getprofile', 'gettrace', 'getwindowsversion', 'get_asyncgen_hooks', 'get_coroutine_wrapper', 'hash_info', 'hexversion', 'implementation', 'int_info', '__interactivehook__', 'intern', 'is_finalizing', 'last_type', 'last_value', 'last_traceback', 'maxsize', 'maxunicode', 'meta_path', 'modules', 'path', 'path_hooks', 'path_importer_cache', 'platform', 'prefix', 'ps1', 'ps2', 'setcheckinterval', 'setdlopenflags', 'setprofile', 'setrecursionlimit', 'setswitchinterval', 'settrace', 'set_asyncgen_hooks', 'set_coroutine_wrapper', '_enablelegacywindowsfsencoding', 'stdin', 'stdout', 'stderr', '__stdin__', '__stdout__', '__stderr__', 'thread_info', 'tracebacklimit', 'version', 'api_version', 'version_info', 'warnoptions', 'winver', '_xoptions'],
	'time'       : ['altzone', 'asctime', 'clock', 'clock_getres', 'clock_gettime', 'clock_settime', 'CLOCK_HIGHRES', 'CLOCK_MONOTONIC', 'CLOCK_MONOTONIC_RAW', 'CLOCK_PROCESS_CPUTIME_ID', 'CLOCK_REALTIME', 'CLOCK_THREAD_CPUTIME_ID', 'ctime', 'daylight', 'get_clock_info', 'gmtime', 'localtime', 'mktime', 'monotonic', 'perf_counter', 'process_time', 'sleep', 'strftime', 'strptime', 'struct_time', 'time', 'timezone', 'tzname', 'tzset'],
	'random'     : ['seed', 'getstate', 'setstate', 'getrandbits', 'randrange', 'randrange', 'randint', 'choice', 'choices', 'shuffle', 'sample', 'random', 'uniform', 'triangular', 'betavariate', 'expovariate', 'gammavariate', 'gauss', 'lognormvariate', 'normalvariate', 'vonmisesvariate', 'paretovariate', 'weibullvariate', 'SystemRandom'],
	'datetime'   : ['MINYEAR', 'MAXYEAR', 'date', 'time', 'datetime', 'timedelta', 'tzinfo', 'timezone', 'timedelta', 'min', 'max', 'resolution', 'total_seconds', 'date', 'today', 'fromtimestamp', 'fromordinal', 'min', 'max', 'resolution', 'year', 'month', 'day', 'replace', 'timetuple', 'toordinal', 'weekday', 'isoweekday', 'isocalendar', 'isoformat', '__str__', 'ctime', 'strftime', '__format__', 'datetime', 'today', 'now', 'utcnow', 'fromtimestamp', 'utcfromtimestamp', 'fromordinal', 'combine', 'strptime', 'min', 'max', 'resolution', 'year', 'month', 'day', 'hour', 'minute', 'second', 'microsecond', 'tzinfo', 'fold', 'date', 'time', 'timetz', 'replace', 'astimezone', 'utcoffset', 'dst', 'tzname', 'timetuple', 'utctimetuple', 'toordinal', 'timestamp', 'weekday', 'isoweekday', 'isocalendar', 'isoformat', '__str__', 'ctime', 'strftime', '__format__', 'time', 'min', 'max', 'resolution', 'hour', 'minute', 'second', 'microsecond', 'tzinfo', 'fold', 'replace', 'isoformat', '__str__', 'strftime', '__format__', 'utcoffset', 'dst', 'tzname', 'tzinfo', 'utcoffset', 'dst', 'tzname', 'fromutc', 'timezone', 'utcoffset', 'tzname', 'dst', 'fromutc', 'utc'],
	'calendar'   : ['Calendar', 'iterweekdays', 'itermonthdates', 'itermonthdays2', 'itermonthdays', 'monthdatescalendar', 'monthdays2calendar', 'monthdayscalendar', 'yeardatescalendar', 'yeardays2calendar', 'yeardayscalendar', 'TextCalendar', 'formatmonth', 'prmonth', 'formatyear', 'pryear', 'HTMLCalendar', 'formatmonth', 'formatyear', 'formatyearpage', 'LocaleTextCalendar', 'LocaleHTMLCalendar', 'setfirstweekday', 'firstweekday', 'isleap', 'leapdays', 'weekday', 'weekheader', 'monthrange', 'monthcalendar', 'prmonth', 'month', 'prcal', 'calendar', 'timegm', 'day_name', 'day_abbr', 'month_name', 'month_abbr'],
	'threading'  : ['active_count', 'current_thread', 'get_ident', 'enumerate', 'main_thread', 'settrace', 'setprofile', 'stack_size', 'TIMEOUT_MAX', 'local', 'Thread', 'start', 'run', 'join', 'name', 'getName', 'setName', 'ident', 'is_alive', 'daemon', 'isDaemon', 'setDaemon', 'Lock', 'acquire', 'release', 'RLock', 'acquire', 'release', 'Condition', 'acquire', 'release', 'wait', 'wait_for', 'notify', 'notify_all', 'Semaphore', 'acquire', 'release', 'BoundedSemaphore', 'Event', 'is_set', 'set', 'clear', 'wait', 'Timer', 'cancel', 'Barrier', 'wait', 'reset', 'abort', 'parties', 'n_waiting', 'broken', 'BrokenBarrierError'],
	'os'         : ['error', 'name', 'ctermid', 'environ', 'environb', 'chdir', 'fchdir', 'getcwd', 'fsencode', 'fsdecode', 'fspath', 'PathLike', '__fspath__', 'getenv', 'getenvb', 'get_exec_path', 'getegid', 'geteuid', 'getgid', 'getgrouplist', 'getgroups', 'getlogin', 'getpgid', 'getpgrp', 'getpid', 'getppid', 'getpriority', 'PRIO_PROCESS', 'PRIO_PGRP', 'PRIO_USER', 'getresuid', 'getresgid', 'getuid', 'initgroups', 'putenv', 'setegid', 'seteuid', 'setgid', 'setgroups', 'setpgrp', 'setpgid', 'setpriority', 'setregid', 'setresgid', 'setresuid', 'setreuid', 'getsid', 'setsid', 'setuid', 'strerror', 'supports_bytes_environ', 'umask', 'uname', 'unsetenv', 'fdopen', 'close', 'closerange', 'device_encoding', 'dup', 'dup2', 'fchmod', 'fchown', 'fdatasync', 'fpathconf', 'fstat', 'fstatvfs', 'fsync', 'ftruncate', 'get_blocking', 'isatty', 'lockf', 'F_LOCK', 'F_TLOCK', 'F_ULOCK', 'F_TEST', 'lseek', 'SEEK_SET', 'SEEK_CUR', 'SEEK_END', 'open', 'O_RDONLY', 'O_WRONLY', 'O_RDWR', 'O_APPEND', 'O_CREAT', 'O_EXCL', 'O_TRUNC', 'O_DSYNC', 'O_RSYNC', 'O_SYNC', 'O_NDELAY', 'O_NONBLOCK', 'O_NOCTTY', 'O_CLOEXEC', 'O_BINARY', 'O_NOINHERIT', 'O_SHORT_LIVED', 'O_TEMPORARY', 'O_RANDOM', 'O_SEQUENTIAL', 'O_TEXT', 'O_ASYNC', 'O_DIRECT', 'O_DIRECTORY', 'O_NOFOLLOW', 'O_NOATIME', 'O_PATH', 'O_TMPFILE', 'O_SHLOCK', 'O_EXLOCK', 'openpty', 'pipe', 'pipe2', 'posix_fallocate', 'posix_fadvise', 'POSIX_FADV_NORMAL', 'POSIX_FADV_SEQUENTIAL', 'POSIX_FADV_RANDOM', 'POSIX_FADV_NOREUSE', 'POSIX_FADV_WILLNEED', 'POSIX_FADV_DONTNEED', 'pread', 'pwrite', 'read', 'sendfile', 'sendfile', 'set_blocking', 'SF_NODISKIO', 'SF_MNOWAIT', 'SF_SYNC', 'readv', 'tcgetpgrp', 'tcsetpgrp', 'ttyname', 'write', 'writev', 'get_terminal_size', 'terminal_size', 'columns', 'lines', 'get_inheritable', 'set_inheritable', 'get_handle_inheritable', 'set_handle_inheritable', 'access', 'F_OK', 'R_OK', 'W_OK', 'X_OK', 'chdir', 'chflags', 'chmod', 'chown', 'chroot', 'fchdir', 'getcwd', 'getcwdb', 'lchflags', 'lchmod', 'lchown', 'link', 'listdir', 'lstat', 'mkdir', 'makedirs', 'mkfifo', 'mknod', 'major', 'minor', 'makedev', 'pathconf', 'pathconf_names', 'readlink', 'remove', 'removedirs', 'rename', 'renames', 'replace', 'rmdir', 'scandir', 'close', 'DirEntry', 'name', 'path', 'inode', 'is_dir', 'is_file', 'is_symlink', 'stat', 'stat', 'stat_result', 'st_mode', 'st_ino', 'st_dev', 'st_nlink', 'st_uid', 'st_gid', 'st_size', 'st_atime', 'st_mtime', 'st_ctime', 'st_atime_ns', 'st_mtime_ns', 'st_ctime_ns', 'st_blocks', 'st_blksize', 'st_rdev', 'st_flags', 'st_gen', 'st_birthtime', 'st_rsize', 'st_creator', 'st_type', 'st_file_attributes', 'stat_float_times', 'statvfs', 'supports_dir_fd', 'supports_effective_ids', 'supports_fd', 'supports_follow_symlinks', 'symlink', 'sync', 'truncate', 'unlink', 'utime', 'walk', 'fwalk', 'getxattr', 'listxattr', 'removexattr', 'setxattr', 'XATTR_SIZE_MAX', 'XATTR_CREATE', 'XATTR_REPLACE', 'abort', 'execl', 'execle', 'execlp', 'execlpe', 'execv', 'execve', 'execvp', 'execvpe', '_exit', 'EX_OK', 'EX_USAGE', 'EX_DATAERR', 'EX_NOINPUT', 'EX_NOUSER', 'EX_NOHOST', 'EX_UNAVAILABLE', 'EX_SOFTWARE', 'EX_OSERR', 'EX_OSFILE', 'EX_CANTCREAT', 'EX_IOERR', 'EX_TEMPFAIL', 'EX_PROTOCOL', 'EX_NOPERM', 'EX_CONFIG', 'EX_NOTFOUND', 'fork', 'forkpty', 'kill', 'killpg', 'nice', 'plock', 'popen', 'spawnl', 'spawnle', 'spawnlp', 'spawnlpe', 'spawnv', 'spawnve', 'spawnvp', 'spawnvpe', 'P_NOWAIT', 'P_NOWAITO', 'P_WAIT', 'P_DETACH', 'P_OVERLAY', 'startfile', 'system', 'times', 'wait', 'waitid', 'P_PID', 'P_PGID', 'P_ALL', 'WEXITED', 'WSTOPPED', 'WNOWAIT', 'CLD_EXITED', 'CLD_DUMPED', 'CLD_TRAPPED', 'CLD_CONTINUED', 'waitpid', 'wait3', 'wait4', 'WNOHANG', 'WCONTINUED', 'WUNTRACED', 'WCOREDUMP', 'WIFCONTINUED', 'WIFSTOPPED', 'WIFSIGNALED', 'WIFEXITED', 'WEXITSTATUS', 'WSTOPSIG', 'WTERMSIG', 'SCHED_OTHER', 'SCHED_BATCH', 'SCHED_IDLE', 'SCHED_SPORADIC', 'SCHED_FIFO', 'SCHED_RR', 'SCHED_RESET_ON_FORK', 'sched_param', 'sched_priority', 'sched_get_priority_min', 'sched_get_priority_max', 'sched_setscheduler', 'sched_getscheduler', 'sched_setparam', 'sched_getparam', 'sched_rr_get_interval', 'sched_yield', 'sched_setaffinity', 'sched_getaffinity', 'confstr', 'confstr_names', 'cpu_count', 'getloadavg', 'sysconf', 'sysconf_names', 'curdir', 'pardir', 'sep', 'altsep', 'extsep', 'pathsep', 'defpath', 'linesep', 'devnull', 'RTLD_LAZY', 'RTLD_NOW', 'RTLD_GLOBAL', 'RTLD_LOCAL', 'RTLD_NODELETE', 'RTLD_NOLOAD', 'RTLD_DEEPBIND', 'getrandom', 'urandom', 'GRND_NONBLOCK', 'GRND_RANDOM'],
	'subprocess' : ['run', 'CompletedProcess', 'args', 'returncode', 'stdout', 'stderr', 'check_returncode', 'DEVNULL', 'PIPE', 'STDOUT', 'SubprocessError', 'TimeoutExpired', 'cmd', 'timeout', 'output', 'stdout', 'stderr', 'CalledProcessError', 'returncode', 'cmd', 'output', 'stdout', 'stderr', 'Popen', 'poll', 'wait', 'communicate', 'send_signal', 'terminate', 'kill', 'args', 'stdin', 'stdout', 'stderr', 'pid', 'returncode', 'STARTUPINFO', 'dwFlags', 'hStdInput', 'hStdOutput', 'hStdError', 'wShowWindow', 'STD_INPUT_HANDLE', 'STD_OUTPUT_HANDLE', 'STD_ERROR_HANDLE', 'SW_HIDE', 'STARTF_USESTDHANDLES', 'STARTF_USESHOWWINDOW', 'CREATE_NEW_CONSOLE', 'CREATE_NEW_PROCESS_GROUP', 'call', 'check_call', 'check_output', 'getstatusoutput', 'getoutput'],
	'signal'     : ['SIG_DFL', 'SIG_IGN', 'SIG*', 'CTRL_C_EVENT', 'CTRL_BREAK_EVENT', 'NSIG', 'ITIMER_REAL', 'ITIMER_VIRTUAL', 'ITIMER_PROF', 'SIG_BLOCK', 'SIG_UNBLOCK', 'SIG_SETMASK', 'ItimerError', 'alarm', 'getsignal', 'pause', 'pthread_kill', 'pthread_sigmask', 'setitimer', 'getitimer', 'set_wakeup_fd', 'siginterrupt', 'signal', 'sigpending', 'sigwait', 'sigwaitinfo', 'sigtimedwait', 'SIGTERM'],
	'glob'       : ['glob', 'iglob', 'escape'],
	'zipfile'    : ['zipfile', 'BadZipFile', 'BadZipfile', 'LargeZipFile', 'ZipFile', 'PyZipFile', 'ZipInfo', 'is_zipfile', 'ZIP_STORED', 'ZIP_DEFLATED', 'ZIP_BZIP2', 'ZIP_LZMA', 'ZipFile', 'close', 'getinfo', 'infolist', 'namelist', 'open', 'extract', 'extractall', 'printdir', 'setpassword', 'read', 'testzip', 'write', 'writestr', 'filename', 'debug', 'comment', 'PyZipFile', 'writepy', 'from_file', 'is_dir', 'filename', 'date_time', 'compress_type', 'comment', 'extra', 'create_system', 'create_version', 'extract_version', 'reserved', 'flag_bits', 'volume', 'internal_attr', 'external_attr', 'header_offset', 'CRC', 'compress_size', 'file_size', '-l</code><code class="descclassname"> &lt;zipfile&gt;', '-c</code><code class="descclassname"> &lt;zipfile&gt; &lt;source1&gt; ... &lt;sourceN&gt;', '-e</code><code class="descclassname"> &lt;zipfile&gt; &lt;output_dir&gt;', '-t</code><code class="descclassname"> &lt;zipfile&gt;'],
	'shlex'      : ['split', 'quote', 'shlex', 'get_token', 'push_token', 'read_token', 'sourcehook', 'push_source', 'pop_source', 'error_leader', 'commenters', 'wordchars', 'whitespace', 'escape', 'quotes', 'escapedquotes', 'whitespace_split', 'infile', 'instream', 'source', 'debug', 'lineno', 'token', 'eof', 'punctuation_chars'],
}

# TODO : Make an automated system for this too.
data_for_custom_libraries = {
	'zmq'       : ['Context', 'Socket', 'Frame', 'MessageTracker', 'Poller', 'ZMQError', 'ZMQVersionError', 'Again', 'ContextTerminated', 'NotDone', 'ZMQBindError'],
	'debugging' : ['terminate', 'raise_exception'],
	'MySQLdb'   : ['connect'],
	'base64'    : ['decodebytes']
}


def get_reserved_words_from_library(python_library, is_a_system_library):
	"""Return a list of strings that each represent a single reserved word by this library.
	:param python_library: The python library to get reserved words for.
	:param is_a_system_library: A boolean to dictate if this system is a system library or not.
	:return: The reserved words as a list.
	"""
	#print(python_library + ' ' + str(is_a_system_library))
	if not is_a_system_library:
		return data_for_custom_libraries[python_library]
	if python_library in cached_data.keys():
		# We can just used the cached data.
		return cached_data[python_library]
	else:
		dbg.terminate('The library that data was not found for is for : ' + python_library)
		return None


# This is the function to use for quick manual edits of library keyword mappings.
def print_updated_cached_data_for_single_system_library_keywords(library_name):
	"""This is a heavy duty utility functions to generate the new (to be copy-pased in) data for the cached_data dictionary.
	:return: Void.
	"""
	html_text = str(requests.get('https://docs.python.org/3/library/' + library_name).text).split('\n')
	keywords = []
	current_index = 0
	for l in html_text:
		if '''"body" role="main">''' in l:
			line = html_text[current_index + 3]
			if 'title="' + library_name + ':' in line:
				version_gotten = line[line.index('</span><h1>') + len('</span><h1>'):line.rfind('<a class="reference internal"') - 2]
				dictionary_name = library_name
				print('\t\'' + dictionary_name, end='\' : ')
		current_index += 1
		if 'descname' in l:
			keywords.append(l[l.index('<code class="descname">') + len('<code class="descname">'):l.rfind('</code>')])
	print(str(keywords) + ',')


class Library:
	"""
	This class represents a single library.
	"""

	def __init__(self, name, documentation):
		self._name = name
		self._documentation = documentation
		self._library_reserved_words = []

	def get_name(self):
		"""Return the name of this library.
		:return: The name of this library as a string.
		"""
		return self._name

	def get_reserved_words(self):
		"""Returns a list of all the reserved words used by this library.
		:return: A list of string of all the reserved words.
		"""
		return self._library_reserved_words

	def get_documentation(self):
		"""Returns the documentation for this library.
		:return: The documentation for this library as a string.
		"""
		dbg.raise_exception(dbg.AbstractMethodNotImplementedException, 'The function (in class Library) \'get_import_statement\' must be implemented by the child class!')

	def get_import_statement(self):
		"""Returns the import code statement needed for this library. Parent function is abstract though.
		:return: The import code statement needed for this library as a string.
		"""
		dbg.raise_exception(dbg.AbstractMethodNotImplementedException, 'The function (in class Library) \'get_import_statement\' must be implemented by the child class!')


class PythonLibrary(Library):
	"""
	This class represents a single Python library.
	"""

	def __init__(self, name, documentation, system_library):
		super().__init__(name, documentation)
		self._system_library = system_library
		self._nickname = ''
		self._from = ''

	def set_from(self, from_location):
		"""Set the from location of this library.
		:param from_location: The location to set to.
		:return: Void.
		"""
		self._from = from_location

	def set_nickname(self, nickname):
		"""Set this libraries nickname.
		:param nickname: The nickname to set this library to.
		:return: Void.
		"""
		self._nickname = nickname

	def get_nickname(self):
		"""Return the nickname of this library.
		:return: The nickname as a string.
		"""
		return self._nickname

	def get_documentation(self):
		"""Returns the documentation for this library.
		:return: The documentation for this library as a string.
		"""
		return '# ' + self._documentation + '\n'

	def get_import_statement(self):
		"""Returns the import code statement needed for this library.
		:return: The import code statement needed for this library as a string.
		"""
		return 'import ' + self._name + '\n'

	def get_is_system_library(self):
		"""Getter for is_system_library.
		:return: Boolean.
		"""
		return self._system_library

	def get_nickname_ending_if_it_exists(self):
		"""This function will either return the nickname or just an empty string.
		:return: The nickname as a string (or just '').
		"""
		if len(self._nickname) > 1:
			return ' as ' + self._nickname
		return ''

	def get_from_start_if_it_exists(self):
		"""This function will either return the from_start or just an empty string.
		:return: The from start as a string (or just '').
		"""
		if len(self._from) > 1:
			return 'from ' + self._from + ' '
		return ''

	def __str__(self):
		if self._system_library:
			return '# ' + self._documentation + '\n' + self.get_from_start_if_it_exists() + 'import ' + self._name + self.get_nickname_ending_if_it_exists()
		else:
			return '# ' + self._documentation + '\n' + self.get_from_start_if_it_exists() + 'import ' + self._name + self.get_nickname_ending_if_it_exists()

# Create a static list of Python system libraries here.
python_library_keyword    = PythonLibrary('keyword'   , 'Needed for getting a list of Python\'s keywords.'      , True)
python_library_sys        = PythonLibrary('sys'       , 'Needed for doing system operations.'                   , True)
python_library_subprocess = PythonLibrary('subprocess', 'Needed for launching sub-processes.'                   , True)
python_library_signal     = PythonLibrary('signal'    , 'Needed for sending low-level program signals.'         , True)
python_library_os         = PythonLibrary('os'        , 'Needed for system operations.'                         , True)
python_library_time       = PythonLibrary('time'      , 'Needed for time operations such as time stamps.'       , True)
python_library_random     = PythonLibrary('random'    , 'Needed for generating random numbers.'                 , True)
python_library_datetime   = PythonLibrary('datetime'  , 'Needed for doing operations relating to date and time.', True)
python_library_calendar   = PythonLibrary('calendar'  , 'Needed for doing operations relating to date and time.', True)
python_library_threading  = PythonLibrary('threading' , 'Used to run Python code asynchronously.'               , True)
python_library_zipfile    = PythonLibrary('zipfile'   , 'Needed for zipping and unzipping files.'               , True)
python_library_glob       = PythonLibrary('glob'      , 'Needed for quick searching of files and directories.'  , True)
python_library_shlex      = PythonLibrary('shlex'     , 'Does simple lexical analysis.'                         , True)

# Isn't base64 a system library?
python_library_MySQLdb    = PythonLibrary('MySQLdb'   , 'Used for connecting and working with MySQL databases.' , False)
python_library_base64     = PythonLibrary('base64'    , 'Used for base 64 encoding and decoding.'               , False)

python_library_zmq        = PythonLibrary('zmq'       , 'Needed for distributed communication between servers.' , False)
python_library_debugging  = PythonLibrary('debugging' , 'Needed for debugging purposes.'                        , False)
python_library_debugging.set_nickname('dbg')
python_library_debugging.set_from('universal_code')

all_python_libraries = [python_library_keyword, python_library_os, python_library_sys, python_library_subprocess, python_library_signal, python_library_time, python_library_random, python_library_datetime, python_library_calendar, python_library_threading, python_library_zmq, python_library_debugging, python_library_MySQLdb, python_library_base64, python_library_zipfile, python_library_glob, python_library_shlex]
