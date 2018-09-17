# coding=utf-8

"""This module, interactive_prompt.py, provides a basic prompt for connecting to a container."""

from libraries.universal_code.system_abstraction import bash_interactive as bi
from libraries.universal_code import output_coloring as oc

from libraries.universal_code.system_abstraction.python_shell_script import PythonShellScript

ARG_CLEAN_GIT = 'c'
ARG_NO_CHANGE = 'n'
ARG_PUSH_CODE = 'p'


class RemovedIgnoredButStagedFiles(bi.BashInteractive):
	"""Provides interactive shell session to connect to cleanup certain git files."""

	def __init__(self):
		super().__init__()

		files_to_remove = self.get_bash_output_as_lines(['git', 'ls-files', '--ignored', '--exclude-standard'])
		if len(files_to_remove) == 0:
			oc.print_green('GIT files clean c:')
		else:
			oc.print_data_with_red_dashes_at_start('GIT files to remove {' + str(files_to_remove) + '}')

		for f in files_to_remove:
			self.add_prompt(bi.BashPromptConfirmation(f, 'Do you want to unstage {' + f + '}'))

		for p in self.prompts:
			output = p.run()
			if output:
				oc.print_data_with_red_dashes_at_start('un-staging file')
				o = self.get_bash_output(['git', 'rm', '-r', '--cached', str(p)])


class PushLatestChanges(bi.BashPromptInput):
	"""Provides interactive shell session to push code changes."""

	def __init__(self):
		super().__init__('get_commit_message', 'Enter your commit message.', empty_allowed=False)

		user_input = self.run()

		push_changes = bi.BashInteractive()
		o = push_changes.get_bash_output(['git', 'add', '.'])
		o = push_changes.get_bash_output(['git', 'commit', '-m', '"' + user_input + '"'])
		o = push_changes.get_bash_output(['git', 'push'])
		oc.print_green('Changes pushed!')


class GITOperations(PythonShellScript):
	"""A shell script for git operations."""

	def __init__(self):
		super().__init__()
		self.add_argument_and_respective_procedure(ARG_PUSH_CODE, 'Pushes the latest local code changes (on current branch).', False, self._push_latest_changes)
		self.add_argument_and_respective_procedure(ARG_CLEAN_GIT, 'Checks if there needs to be any files cleaned up from a git perspective.', False, self._remove_ignored_but_staged_files)
		self.add_argument_and_respective_procedure(ARG_NO_CHANGE, 'Inform the user that there are no code changes present to push.', False, self._no_changes_to_push)

	def _remove_ignored_but_staged_files(self):
		"""Utility."""
		RemovedIgnoredButStagedFiles()

	def _push_latest_changes(self):
		"""Utility."""
		PushLatestChanges()

	def _no_changes_to_push(self):
		"""Utility."""
		oc.print_data_with_red_dashes_at_start('No changes to push!')

if __name__ == "__main__":
	script = GITOperations()
	script.run()
