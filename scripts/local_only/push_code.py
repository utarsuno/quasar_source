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
from libraries.universal_code.output_coloring import PrintRed
from libraries.universal_code.output_coloring import PrintGreen
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
			self.print_line(PrintRed('Some error occurred while pushing the code!', bold=True))
		finally:
			self.print_line(PrintGreen('Code push from script succeeded!', bold=True))

	def _run(self, developer: Developer):
		self._parse_current_state(developer.get_base_path())

		if self._has_changes:
			prompt = UserActionPrompt('There are changes to push')
			prompt.add_choice('Push changes', 'All pushable changes will be pushed on current branch{' + str('TODO') + '}')
			prompt.add_choice('Exit', 'Terminates this script.')

			# Result will be the choice as an array ex: ['Exit', 'Terminates this script']
			action = self.get_prompt_response(prompt)[0]

			if action == 'Exit':
				self.print_line(PrintRed('Program terminating.'))
			elif action == 'Push changes':
				self._push_code(self.get_prompt_response(UserTextInputPrompt('Enter a commit message: ')), developer)
		else:
			self.print_line(PrintGreen('There are no code changes to push =)'))


if __name__ == "__main__":
	script = PushCode()
	script.run()


