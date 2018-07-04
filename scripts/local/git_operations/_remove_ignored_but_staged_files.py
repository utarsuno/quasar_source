# coding=utf-8

"""This module, interactive_prompt.py, provides a basic prompt for connecting to a container."""

from quasar_libraries_and_scripts.universal_code.system_abstraction import bash_interactive as bi
from quasar_libraries_and_scripts.universal_code import output_coloring as oc


class RemovedIgnoredButStagedFiles(bi.BashInteractive):
	"""Provides interactive shell session to connect to cleanup certain git files."""

	def __init__(self):
		super().__init__()

		files_to_remove = self.get_bash_output_as_lines(['git', 'ls-files', '--ignored', '--exclude-standard'])
		print(files_to_remove)

		for f in files_to_remove:
			self.add_prompt(bi.BashPromptConfirmation(f, 'Do you want to unstage {' + f + '}'))

		for p in self.prompts:
			output = p.run()
			if output:
				oc.print_data_with_red_dashes_at_start('un-staging file')
				o = self.get_bash_output(['git', 'rm', '-r', '--cached', str(p)])


session = RemovedIgnoredButStagedFiles()
