# coding=utf-8

"""This module, handles the logic for EntityTextReminders."""


class TextReminderManager(object):
	"""Manages and schedules text reminders."""

	def __init__(self):
		self._text_reminders = []

	def add_new_text_reminder(self, entity_text_reminder):
		"""Adds a new text reminder and schedules a task to send the text reminder."""
		self._text_reminders.append(entity_text_reminder)

		print('NEED TO SCHEDULE A TEXT REMINDER FOR THE FOLLOWING ENTITY')
		entity_text_reminder.print_info()

		#subprocess.Popen(['sudo', 'nohup', 'bash', send_text_message_script_path, number_of_seconds, full_send_address, message_to_send, str(self.unique_id), '&'])



class TextReminder(object):
	"""Represents a single scheduled text reminder."""

	def __init__(self):
		y = 2

