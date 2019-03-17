# coding=utf-8

"""This file, interactive_script.py, provides base abstraction for creating specific types of scripts to run."""

'''
Created     : 2019.04.17
Environments: {DEV}
'''

from libraries.universal_code import output_coloring as oc
from libraries.universal_code.time_abstraction.simple_timer import SimpleTimer
from libraries.universal_code.config_auto_mapper import LocalConfigurations
from libraries.universal_code.common_traits.trait_name import TraitName
from libraries.universal_code.config_auto_mapper import Developer
import abc


class TraitConsolePrinting(object):
	"""Provides useful functions for printing to console."""

	def __init__(self, max_length=120, boxed=True):
		self._max_length = max_length
		self._space_left = self._max_length
		self._boxed      = boxed
		if self._boxed:
			self._space_left -= 4
			self._line  = '| ' + '-' * self._space_left + ' |'
		else:
			self._line = '-' * self._space_left

	def print_header(self, title):
		"""Prints centered text with horizontal dividers before and after the text."""
		space_left     = (self._space_left - len(title)) / 2
		divider        = ' ' * int(space_left)

		oc.ColorPrint().yellow(self._line).end_line().yellow('| ')\
			.green(divider + title + divider).yellow(' |').end_line()\
			.yellow(self._line).print(all_bold=True)

	def print_line(self, text):
		"""Prints a line of text."""
		if self._boxed:
			line    = oc.ColorPrint().yellow('| ').add(text, return_self=True)
			padding = ' ' * (self._space_left - (len(line) - 2))

			line.add(oc.ColorPrint().yellow(padding + ' |'), return_self=True).print(all_bold=True)


class TraitUserPrompt(TraitName, TraitConsolePrinting):
	"""Base abstraction for user prompts."""

	def __init__(self, prompt: str):
		TraitName.__init__(self, prompt)
		TraitConsolePrinting.__init__(self, 120, True)

	def run(self):
		"""Prompt the user and obtain the text."""
		self.print_line(oc.ColorPrint().blue(self.name))
		return self._run()

	@abc.abstractmethod
	def _run(self):
		"""Runs the prompt implementation."""
		pass


class TraitDebug(object):

	def __init__(self, debug):
		self.debug = debug


class UserTextInputPrompt(TraitUserPrompt):
	"""An abstraction to obtaining a user string."""

	def __init__(self, prompt: str):
		super().__init__(prompt)

	def _run(self):
		"""Prompt the user and obtain the text."""
		return str(input())


class UserActionPrompt(TraitUserPrompt):
	"""An abstraction to obtaining a user response for a one time selection from a list of options."""

	def __init__(self, prompt: str):
		super().__init__(prompt + '; please select an action:')
		self._choices             = []
		self._longest_choice_name = -1

	def _run(self):
		"""Prompt the user and obtain the selected choice."""
		self._longest_choice_name += 4

		for i, c in enumerate(self._choices):
			padding = self._longest_choice_name - len(c[0])
			padding = ' ' * padding

			self.print_line(oc.ColorPrint().green('\t' + str(i) + ': {' + c[0] + '}' + padding + '[' + c[1] + ']'))

		return self._choices[self.get_user_int()]

	def add_choice(self, choice: str, description: str) -> None:
		"""Adds a selectable choice."""
		if len(choice) > self._longest_choice_name:
			self._longest_choice_name = len(choice)
		self._choices.append([choice, description])

	def get_user_int(self) -> int:
		"""Gets the user entered integer."""
		while True:
			try:
				user_choice = int(input())
				if user_choice < 0 or user_choice >= len(self._choices):
					self.print_line(oc.ColorPrint().red('\tRetry! {' + str(user_choice) + '} is not valid!'))
				else:
					return user_choice
			except:
				self.print_line(oc.ColorPrint().red('\tRetry! {Error occurred =(} is not valid!'))


class InteractiveScript(TraitName, TraitDebug, TraitConsolePrinting):
	"""Base abstraction for creating and running specific types of scripts."""

	__metaclass__ = abc.ABCMeta

	def __init__(self, name, debug=True):
		TraitName.__init__(self, name)
		TraitDebug.__init__(self, debug)
		TraitConsolePrinting.__init__(self, 120, True)

		self._configs = LocalConfigurations()

		self._timer = SimpleTimer()

	def _start(self):
		"""Runs before script logic."""
		self.print_header('Script{' + self.name + '} started as ' + str(self._configs.local_dev))
		self._timer.start()

	def _end(self):
		"""Runs after script logic."""
		self._timer.stop()
		self.print_header('Script{' + self.name + '} ended in {' + str(self._timer) + '}')

	@abc.abstractmethod
	def _run(self, developer: Developer):
		"""Runs the script logic."""
		pass

	def run(self):
		"""Runs this script."""
		self._start()
		self._run(self._configs.local_dev)
		self._end()
