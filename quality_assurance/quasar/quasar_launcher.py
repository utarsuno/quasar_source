# coding=utf-8

"""This module, quasar_launcher.py, is a local utility for starting up Quasar."""

from selenium import webdriver
from selenium.webdriver.common import action_chains, keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
import time

# Constants.
PATH_TO_CHROME_DRIVER = '/Users/utarsuno/drivers/chromedriver'
URL_QUASAR_DEV        = 'www.quasarsource.com:1337/dev'

# Create the browser.
browser = webdriver.Chrome(PATH_TO_CHROME_DRIVER)
# Move the window to the third monitor.
browser.set_window_position(3000, 0)
# Go to Quasar dev.
browser.get(URL_QUASAR_DEV)

# Let all the resources load.
while browser.execute_script('return MANAGER_LOADING.currently_loading();'):
	time.sleep(1)

# Login.
browser.execute_script('GUI_PAUSED_MENU.make_invisible();')
browser.execute_script('CURRENT_PLAYER.look_at(MANAGER_WORLD.world_login.login_username_input.get_position());')
browser.execute_script('MANAGER_WORLD.world_login.login_username_input.update_text(\'sudo\');')
browser.execute_script('MANAGER_WORLD.world_login.login_password_input.update_text(\'sudo\');')
browser.execute_script('MANAGER_WORLD.world_login.login_button.engage();')

time.sleep(1)

browser.execute_script('GUI_PAUSED_MENU.make_visible();')

# Sleep for 10 minutes.
time.sleep(60 * 10)
browser.quit()

