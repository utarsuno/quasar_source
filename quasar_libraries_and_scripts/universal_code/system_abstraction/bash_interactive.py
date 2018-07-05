# coding=utf-8

"""This module, bash_interactive.py, provides an abstraction for creating interactive bash sessions."""

import sys
from quasar_libraries_and_scripts.universal_code import debugging as dbg
from quasar_libraries_and_scripts.universal_code import output_coloring as oc
from quasar_libraries_and_scripts.universal_code.system_abstraction.program_arguments import ProgramArguments
from quasar_libraries_and_scripts.universal_code.system_abstraction import shell_command_runner as bash


class BashPrompt(object):
	"""Represents a single prompt given to a user with attached action."""

	def __init__(self, prompt_name, terminate_on_error=False):
		self._name = prompt_name
		self._terminate_on_error = terminate_on_error

	def error(self, text):
		"""Handle an error."""
		if self._terminate_on_error:
			dbg.raise_exception(text)
		else:
			oc.print_error(text)

	@property
	def name(self):
		"""Return the name of this prompt."""
		return self._name

	def __str__(self):
		return self._name


class BashPromptConfirmation(BashPrompt):
	"""Represents a single bash confirmation prompt."""

	def __init__(self, prompt_name, prompt_initial_message):
		super().__init__(prompt_name)
		self._initial_message = prompt_initial_message

	def run(self):
		"""Runs this prompt."""
		oc.print_title(self._initial_message)
		oc.print_data_with_red_dashes_at_start('(y/n)')
		try:
			user_choice = str(input())
			if user_choice == 'y':
				return True
			elif user_choice == 'n':
				return False
			else:
				self.error('Invalid choice!')
		except:
			self.error('Invalid choice!')


class BashPromptListSelection(BashPrompt):
	"""Represents a single list selection bash prompt."""

	def __init__(self, prompt_name, prompt_initial_message):
		super().__init__(prompt_name)
		self._choices = []
		self._initial_message = prompt_initial_message

	def add_selection_choice(self, choice, description):
		"""Adds a selection choice."""
		self._choices.append([choice, description])

	def __len__(self):
		return len(self._choices)

	def run(self):
		"""Runs this prompt."""
		oc.print_title(self._initial_message)
		c = 0
		while c < len(self._choices):
			oc.print_data_with_red_dashes_at_start(str(c) + ' : {' + self._choices[c][0] + '} - {' + self._choices[c][1] + '}')
			c += 1

		finished = False

		while not finished:
			try:
				user_choice = int(input())
				if user_choice < 0 or user_choice >= len(self._choices):
					self.error('Invalid choice!')
				else:
					finished = True
			except:
				self.error('Invalid choice!')

		return user_choice


class BashInteractive(object):
	"""Abstraction to an interactive bash prompt."""

	def __init__(self, expectable_arguments=None):
		self._args = expectable_arguments
		if self._args is not None:
			self._args.check_if_needed_arguments_passed_in()

		self.prompts = []

	def get_bash_output(self, command_to_run, input_required=False):
		"""Runs a command and gets the output."""
		success, output = bash.BashCommandRunner(command_to_run, input_required).run()
		if success:
			return output
		else:
			dbg.raise_exception('Bash command failed! {' + output + '}')

	def get_bash_output_as_lines(self, command_to_run, input_required=False):
		output = self.get_bash_output(command_to_run, input_required).split('\n')
		if len(output[-1]) == 0:
			output = output[:-1]
		return output

	def raise_exception(self, message):
		"""Raises an exception."""
		dbg.raise_exception(message)

	def add_prompt(self, prompt):
		"""Adds a prompt."""
		self.prompts.append(prompt)

	def run(self):
		"""Runs the interactive session."""
		for p in self.prompts:
			p.run()

