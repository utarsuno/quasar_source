# coding=utf-8

"""This module, is_program_running.py, checks if a program is running by command name match."""

# Needed for running subprocesses.
import subprocess
# Needed for parsing arguments.
import argparse


'''
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
'''


def run_process_finder(process_name):
	"""Utility function."""
	# Base code from https://stackoverflow.com/questions/13332268/python-subprocess-command-with-pipe
	ps = subprocess.Popen(('ps', '-edaf'), stdout=subprocess.PIPE)
	output = subprocess.check_output(('grep', '"' + process_name + '"'), stdin=ps.stdout)
	ps.wait()
	return output


if __name__ == '__main__':
	parser       = argparse.ArgumentParser()
	parser.add_argument('service_name')
	args         = parser.parse_args()
	service_name = args.service_name

	#output = run_bash_command_and_get_output(['ps', '-edaf', '|', 'grep', '"' + service_name + '"', '|', 'grep', '-v', 'grep'], shell=True).split('\n')

	output = run_process_finder(service_name)
	print(output)
	exit()

	if len(output) == 0:
		print('false')
	else:
		for l in output:
			print('LINE{')
			print(l)
			print('}')

	#output       = run_bash_command_and_get_output(['top', '-c', '-n', '1', '-b']).split('\n')


	#for o in output:
	#	if 'is_program_running.py' not in o:
	#		if command_text in o:
	#			print('true')
	#			exit()
	#print('false')

# Example usage : value=$(python3 is_program_running.py 'runserver')
# test push

