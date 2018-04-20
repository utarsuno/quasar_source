# coding=utf-8

"""This module, quasar_launcher.py, is a local utility for starting up Quasar."""

from quality_assurance.selenium import selenium_abstraction as sa
import time

# Constants.
URL_QUASAR_DEV = 'www.quasarsource.com:1337/dev'
URL_QUASAR_PROD = 'www.quasarsource.com:1337'


class QuasarAccount(object):
	"""Represents a Quasar account."""

	def __init__(self, username, password):
		self._username = username
		self._password = password

	@property
	def username(self) -> str:
		"""Returns the username of this Quasar account."""
		return self._username

	@property
	def password(self) -> str:
		"""Returns the password of this Quasar account."""
		return self._password

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


selenium = sa.SeleniumAPI()
account_test = QuasarAccount('test', 'test')

# Load main page test.
load_quasar = sa.SeleniumTest(selenium, 'load_quasar')
load_quasar.add_step(sa.StepGETRequest(URL_QUASAR_PROD))
load_quasar.add_step(sa.StepWaitForJavascriptValue('MANAGER_LOADING.currently_loading()', False))

# Login test.
#login_test = sa.SeleniumTest()

selenium.pre_tests()

load_quasar.perform_test()

time.sleep(5)
selenium.post_tests()


# DEV
# Test{load_quasar} passed in 2.0118391513824463s.
# Test{load_quasar} passed in 1.938736915588379s.
# Test{load_quasar} passed in 1.967132806777954s.

# PROD
# Test{load_quasar} passed in 1.395277976989746s.
# Test{load_quasar} passed in 1.4446508884429932s.
# Test{load_quasar} passed in 1.380876064300537s.
