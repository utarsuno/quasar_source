# coding=utf-8

"""This module, is_django_already_running.py, does exactly as the name implies."""

# Needed for running subprocesses.
import subprocess


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

print(run_bash_command_and_get_output(['top', '-c', '-n', '1']))
