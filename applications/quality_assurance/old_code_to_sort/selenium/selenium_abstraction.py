# coding=utf-8

"""This module, selenium_abstraction.py, provides an abstraction to Selenium."""

from selenium import webdriver
from selenium.webdriver.common import action_chains, keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
import time

from universal_code import output_coloring as oc

# Constants.
PATH_TO_CHROME_DRIVER = '/Users/utarsuno/drivers/chromedriver'


class SeleniumAPI(object):
	"""Provides an abstraction to Selenium."""

	def __init__(self):
		self.browser = None

	def pre_tests(self):
		"""Code to run before running tests."""
		# Create the browser.
		self.browser = webdriver.Chrome(PATH_TO_CHROME_DRIVER)
		# Move the window to the third monitor.
		self.browser.set_window_position(1500, 0)

	def post_tests(self):
		"""Code to run after running tests."""
		self.browser.quit()

	def get_request(self, url):
		"""Performs the specified GET request."""
		self.browser.get(url)

	def execute_javascript_and_get_value(self, javascript_code):
		"""Executes the javascript and returns the returned value."""
		return self.browser.execute_script('return ' + javascript_code)

	# TODO : Double click functionality
	# https://stackoverflow.com/questions/16807258/selenium-click-at-certain-position


class SeleniumTestSuite(object):
	"""Represents a collection of tests to execute in linear order."""

	def __init__(self, test_suite_name):
		self.test_suite_name = test_suite_name


class SeleniumTest(object):
	"""Represents a single test to run through Selenium."""

	def __init__(self, selenium_api, test_name):
		self.test_name  = test_name
		self.passed     = True
		self.time_taken = None
		self.start_time = None
		self.steps      = []
		self.api        = selenium_api

	def add_step(self, step):
		"""Adds a step to this selenium test."""
		self.steps.append(step)
		step.set_parent_test(self)

	def fail_test(self):
		"""Mark this test as failed."""
		self.passed = False

	def start_test(self):
		"""Starts the test."""
		self.start_time = time.time()

	def perform_test(self):
		"""Performs this test."""
		self.start_test()
		for s in self.steps:
			s.perform_step(self.api)
			if not self.passed:
				break
		self.end_test()

	def end_test(self):
		"""Ends the test."""
		self.time_taken = time.time() - self.start_time
		t = ' in ' + str(self.time_taken) + 's.'
		if self.passed:
			oc.print_green('Test{' + self.test_name + '} passed' + t)
		else:
			oc.print_error('Test{' + self.test_name + '} failed' + t)


class SeleniumStep(object):
	"""Represents a single step for a Selenium test to take."""

	def __init__(self):
		self.parent_test = None

	def set_parent_test(self, parent):
		"""Sets the parent test of this Selenium step."""
		self.parent_test = parent

	def fail_test(self):
		"""Fails the parent test."""
		self.parent_test.fail()


class StepGETRequest(SeleniumStep):
	"""Represents the action of performing a GET request."""

	def __init__(self, url):
		super().__init__()
		self._url = url

	def perform_step(self, api):
		"""Performs this step."""
		api.get_request(self._url)


class StepWaitForJavascriptValue(SeleniumStep):
	"""Represents the action of waiting for a return value from executed Javascript code."""

	def __init__(self, javascript_code, return_value_needed):
		super().__init__()
		self.javascript_code = javascript_code
		self.return_value_needed = return_value_needed

	def perform_step(self, api):
		"""Performs this step."""
		current_time_slept = 0
		maximum_sleep_time = 5
		while api.execute_javascript_and_get_value(self.javascript_code) != self.return_value_needed:
			current_time_slept += .1
			if current_time_slept == maximum_sleep_time:
				self.parent_test.fail_test()
				break
			time.sleep(.1)

'''
# Login.
browser.execute_script('GUI_PAUSED_MENU.make_invisible();')
browser.execute_script('CURRENT_PLAYER.look_at(MANAGER_WORLD.world_login.login_username_input.get_position());')
browser.execute_script('MANAGER_WORLD.world_login.login_username_input.update_text(\'sudo\');')
browser.execute_script('MANAGER_WORLD.world_login.login_password_input.update_text(\'sudo\');')
browser.execute_script('MANAGER_WORLD.world_login.login_button.engage();')

time.sleep(1)

browser.execute_script('GUI_PAUSED_MENU.make_visible();')
'''


# browser.get(URL_QUASAR_DEV)