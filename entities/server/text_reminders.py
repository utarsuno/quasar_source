# coding=utf-8

"""This module, handles the logic for EntityTextReminders."""

import subprocess


TEMP_PROPERTY_A = 'Text Contents :'
TEMP_PROPERTY_B = 'Seconds from now :'
TEMP_PROPERTY_C = 'Send to :'



class TextReminderManager(object):
	"""Manages and schedules text reminders."""

	def __init__(self):
		self._text_reminders = []

	def add_new_text_reminder(self, entity_text_reminder):
		"""Adds a new text reminder and schedules a task to send the text reminder."""
		self._text_reminders.append(entity_text_reminder)

		print('NEED TO SCHEDULE A TEXT REMINDER FOR THE FOLLOWING ENTITY')
		entity_text_reminder.print_info()

		# send_sms_message.sh
		# /Users/utarsuno/git_repos/quasar_source/all_scripts/server/send_sms_message.sh

		json_data = entity_text_reminder.get_json_data()
		for key in json_data:

			if key == TEMP_PROPERTY_A:
				message = json_data[key]
			elif key == TEMP_PROPERTY_B:
				send_to = json_data[key]
			elif key == TEMP_PROPERTY_C:
				number_of_seconds_to_wait = json_data[key]

			print(str(key) + ' - ' + str(json_data[key]))

		#subprocess.Popen(['sudo', 'nohup', 'bash', '/home/git_repos/quasar_source/all_scripts/server/send_sms_message.sh', str(number_of_seconds_to_wait), str(message), str(send_to), '&'])
		subprocess.Popen(['bash', '/home/git_repos/quasar_source/all_scripts/server/send_sms_message.sh', str(number_of_seconds_to_wait), str(message), str(send_to)])


class TextReminder(object):
	"""Represents a single scheduled text reminder."""

	def __init__(self):
		y = 2

