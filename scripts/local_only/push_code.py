# coding=utf-8

"""This file, push_latest_code.py, is a runnable script for pushing code changes."""

'''
Created     : 2019.04.17
Environments: {DEV}
'''

from libraries.universal_code.scripting.interactive_script import InteractiveScript
from libraries.universal_code.scripting.interactive_script import UserActionPrompt
from libraries.universal_code.scripting.interactive_script import UserTextInputPrompt
from libraries.universal_code.config_auto_mapper import Developer
from libraries.universal_code import output_coloring as oc

from git import Repo


class PushCode(InteractiveScript):
	"""Script to push git changes."""

	def __init__(self):
		super().__init__('Push Code')
		self._has_changes = None
		self._repo        = None

	def _parse_current_state(self, project_base_path: str):
		"""Load the current git information."""
		self._repo = Repo(project_base_path)
		assert not self._repo.bare
		self._has_changes = self._repo.is_dirty()

	def _push_code(self, commit_message: str, developer: Developer):
		"""Push the commit."""
		try:
			repo = Repo(developer.get_path_git())
			repo.git.add(update=True)
			repo.index.commit(commit_message)
			origin = repo.remote(name='origin')
			origin.push()
		except:
			self.print_line(oc.ColorPrint().red('Some error occurred while pushing the code!', bold = True))
		finally:
			self.print_line(oc.ColorPrint().green('Code push from script succeeded!', bold=True))

	def _run(self, developer: Developer):
		self._parse_current_state(developer.get_base_path())

		if self._has_changes:
			prompt = UserActionPrompt('There are changes to push')
			prompt.add_choice('Push changes', 'All pushable changes will be pushed on current branch{' + str('TODO') + '}')
			prompt.add_choice('Exit', 'Terminates this script.')

			# Result will be the choice as an array ex: ['Exit', 'Terminates this script']
			result = prompt.run()
			action = result[0]

			if action == 'Exit':
				self.print_line(oc.ColorPrint().red('Program terminating.'))
			elif action == 'Push changes':
				message_prompt = UserTextInputPrompt('Enter a commit message: ')
				result         = message_prompt.run()
				self._push_code(result, developer)
		else:
			self.print_line(oc.ColorPrint().green('There are no code changes to push =)'))


if __name__ == "__main__":
	script = PushCode()
	script.run()

