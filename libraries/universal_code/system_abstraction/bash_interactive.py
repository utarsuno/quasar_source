# coding=utf-8

"""This module, bash_interactive.py, provides an abstraction for creating interactive bash sessions."""

import sys
from libraries.universal_code import debugging as dbg
from libraries.universal_code import output_coloring as oc
from libraries.universal_code.system_abstraction import system_functions as sys_funcs


def _parse_shell_command(shell_command, list_needed=False):
	"""Utility function."""
	if type(shell_command) == list:
		if list_needed:
			return shell_command
		cmd = ''
		for i in shell_command:
			cmd += i + ' '
	else:
		if list_needed:
			cmd = []
			s = shell_command.split(' ')
			for w in s:
				cmd.append(w)
		else:
			cmd = shell_command
	return cmd


class BashCommandRunner(object):
	"""Provides an abstraction to running bash commands."""

	def __init__(self, command, require_input=False):
		self._command         = _parse_shell_command(command)
		self._input_needed    = require_input
		self._next_command    = None
		self._chained_outputs = None

	def _get_tail(self):
		"""Utility function."""
		if self._next_command is None:
			return None
		else:
			temp = self._next_command
			while temp._next_command is not None:
				temp = temp._next_command
			return temp

	def add_command_to_run(self, command, require_input=False):
		"""Adds another command to run after this command finishes running (in order to provide ability to code commands from one chained object)."""
		cmd_runner = BashCommandRunner(command, require_input)
		if self._next_command is None:
			self._next_command = cmd_runner
		else:
			self._get_tail()._next_command = cmd_runner
		return self

	def set_chained_output(self, output: list):
		"""Sets the current history of output, instances will add to it and pass it along."""
		self._chained_outputs = output

	def add_to_log_history(self, output):
		"""Adds an entry to the '_chained_outputs'."""
		if self._chained_outputs is None:
			self._chained_outputs = []
		self._chained_outputs.append(output)

	def run(self, cwd=None, raise_exception=False, get_as_lines=False):
		"""Runs the command and returns two outputs, success_status and output."""
		if self._input_needed:
			output_stdout, output_stderr, has_error = sys_funcs.sys_run_process_interactive(self._command, cwd, decode_output=True, get_output_as_lines=get_as_lines, simplify_stderr_to_boolean_flag=True)
		else:
			output_stdout, output_stderr, has_error = sys_funcs.sys_run_process(self._command, cwd, decode_output=True, get_output_as_lines=get_as_lines, simplify_stderr_to_boolean_flag=True)
		if has_error:
			if raise_exception:
				dbg.raise_exception('Bash command \n{' + str(self._command) + '}\n failed! \n{' + output_stderr + '}\n')
			self.add_to_log_history(output_stderr)
			if self._next_command is not None:
				self._next_command.set_chained_output(self._chained_outputs)
				return self._next_command.run(cwd, raise_exception, get_as_lines)
			return False, '\n'.join(self._chained_outputs)
		self.add_to_log_history(output_stdout)
		if self._next_command is not None:
			self._next_command.set_chained_output(self._chained_outputs)
			return self._next_command.run(cwd, raise_exception, get_as_lines)
		return True, '\n'.join(self._chained_outputs)


class BashPrompt(object):
	"""Represents a single prompt given to a user with attached action."""

	def __init__(self, prompt_name, terminate_on_error=False):
		self._name               = prompt_name
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


class BashPromptInput(BashPrompt):
	"""Represents a single bash input prompt."""

	def __init__(self, prompt_name, prompt_initial_message, empty_allowed=True):
		super().__init__(prompt_name)
		self._initial_message = prompt_initial_message
		self.empty_allowed = empty_allowed

	def run(self):
		"""Runs this prompt."""
		oc.print_title(self._initial_message)
		sys.stdout.flush()
		#oc.print_data_with_red_dashes_at_start('(y/n)')
		try:
			user_choice = str(input())
			if not self.empty_allowed and len(user_choice) == 0:
				self.error('Commit message can\'t be empty!')
			return user_choice
		except:
			self.error('Invalid choice!')


class BashPromptListSelectionChoice(object):
	"""Represents a single choice in a bash prompt list."""

	def __init__(self, number, name, description):
		self._number      = number
		self._name        = name
		self._description = description


class BashPromptListSelection(BashPrompt):
	"""Represents a single list selection bash prompt."""

	def __init__(self, prompt_name, prompt_initial_message):
		super().__init__(prompt_name)
		self._choices         = []
		self._initial_message = prompt_initial_message

	def add_selection_choice(self, selection_choice):
		"""Adds a selection choice."""
		self._choices.append(selection_choice)

	def __len__(self):
		return len(self._choices)

	def run(self):
		"""Runs this prompt."""
		oc.print_title(self._initial_message)
		sys.stdout.flush()
		c = 0
		while c < len(self._choices):
			oc.print_data_with_red_dashes_at_start(str(c) + ' : {' + self._choices[c][0] + '} - {' + self._choices[c][1] + '}')
			c += 1
		sys.stdout.flush()
		while True:
			try:
				user_choice = int(input())
				if user_choice < 0 or user_choice >= len(self._choices):
					self.error('Invalid choice!')
				else:
					return self._choices[user_choice]
			except:
				self.error('Invalid choice!')


class BashInteractive(object):
	"""Abstraction to an interactive bash prompt."""

	def __init__(self):
		self.prompts = []

	def prompt_user_with_list(self, prompt_text: str, choices: list):
		"""Prompts the user for an action selection."""
		list_prompt = BashPromptListSelection(prompt_text, prompt_text)
		for i, choice in enumerate(choices):
			list_prompt.add_selection_choice(BashPromptListSelectionChoice('0x' + str(i), prompt_text, choice))
		self.prompts.append(BashPromptListSelection(prompt_text, prompt_text))

	def raise_exception(self, message):
		"""Raises an exception."""
		dbg.raise_exception(message)

	def add_prompt(self, prompt):
		"""Adds a prompt."""
		self.prompts.append(prompt)
		return self

	def run(self):
		"""Runs the interactive session."""
		for p in self.prompts:
			p.run()

