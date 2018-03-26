# coding=utf-8

"""This module, is_program_running.py, checks if a program is running by command name match."""

# Needed for running subprocesses.
import subprocess
import argparse


def run_bash_command_and_get_output(bash_command, shell=False, cwd=None):
	"""Runs the provided bash command and returns the output.
	:param bash_command : The bash command to run, as a list of String parameters.
	:param shell        : Don't set to True unless things like environment variables are needed. More information here : https://stackoverflow.com/questions/3172470/actual-meaning-of-shell-true-in-subprocess
	:param cwd          : The current working directory that this command should be ran from.
	:return: The output of the bash command, as a string."""
	bad_argument = False
	if type(bash_command) != list and shell is False:
		bad_argument = True
	else:
		if shell is False:
			for c in bash_command:
				if type(c) != str:
					bad_argument = True
	if bad_argument:
		print('Bad argument! {' + str(bash_command) + '}')
		exit()
	# Safety checks are over.
	if cwd is not None:
		result = subprocess.run(bash_command, stdout=subprocess.PIPE, shell=shell, cwd=cwd)
	else:
		result = subprocess.run(bash_command, stdout=subprocess.PIPE, shell=shell)
	return result.stdout.decode('utf-8')


if __name__ == '__main__':
	parser       = argparse.ArgumentParser()
	parser.add_argument('command_text')
	args         = parser.parse_args()
	command_text = args.command_text
	output       = run_bash_command_and_get_output(['top', '-c', '-n', '1', '-b']).split('\n')
	for o in output:
		if 'is_program_running.py' not in o:
			if command_text in o:
				print('true')
				exit()
	print('false')

# Example usage : value=$(python3 is_program_running.py 'runserver')
# test push