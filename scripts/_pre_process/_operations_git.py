# coding=utf-8

"""This module, interactive_prompt.py, provides a basic prompt for connecting to a container."""

from libraries.universal_code.system_abstraction import bash_interactive as bi
from libraries.universal_code import output_coloring as oc
from libraries.universal_code.system_abstraction.python_shell_script import PythonShellScript


class RemovedIgnoredButStagedFiles(bi.BashInteractive):
	"""Provides interactive shell session to connect to cleanup certain git files."""

	def __init__(self):
		super().__init__()

		files_to_remove = bi.BashCommandRunner(['git', 'ls-files', '--ignored', '--exclude-standard']).run(get_as_lines=True)

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
				bi.BashCommandRunner(['git', 'rm', '-r', '--cached', str(p)]).run()


class PushLatestChanges(bi.BashPromptInput):
	"""Provides interactive shell session to push code changes."""

	def __init__(self):
		super().__init__('get_commit_message', 'Enter your commit message.', empty_allowed=False)

		user_input = self.run()

		bi.BashCommandRunner(['git', 'add', '.']).\
			add_command_to_run(['git', 'commit', '-m', '"' + user_input + '"']).\
			add_command_to_run(['git', 'push']).run()

		oc.print_green('Changes pushed!')


class GITOperations(PythonShellScript):
	"""A shell script for git operations."""

	def __init__(self):
		super().__init__()
		self.add_argument('p', 'Pushes the latest local code changes (on current branch).', self._push_latest_changes)
		self.add_argument('c', 'Checks if there needs to be any files cleaned up from a git perspective.', self._remove_ignored_but_staged_files)
		self.add_argument('n', 'Inform the user that there are no code changes present to push.', self._no_changes_to_push)

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
