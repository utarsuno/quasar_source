# coding=utf-8

"""This file, system_utilities.py, provides common operations for system/OS operations."""

import os
import subprocess


def run_process_live(command_to_run, cwd=None, decode_output=False, get_output_as_lines=False, simplify_stderr_to_boolean_flag=False):
	"""Runs the provided command as a process and links stdout + stderr during the process's life-time.
		Returns 2 variables, the spawned process's <<stdout, stderr>>."""
	if cwd is not None:
		process = subprocess.Popen(command_to_run, shell = True, stdin = subprocess.PIPE, cwd = cwd)
	else:
		process = subprocess.Popen(command_to_run, shell = True, stdin = subprocess.PIPE)
	process.wait()
	output_stdout, output_stderr = process.communicate()
	return output_stdout, output_stderr


def run_docker_composer_container(docker_compose_file_path: str, service_name: str, in_background: bool=False):
    #output, errors = run_process_live('docker-compose -f ./docker-compose.asset_server.yml up -d postgres_server')
    mode = ' up '
    if in_background:
        mode += '-d '
    output, errors = run_process_live('docker-compose -f ' + docker_compose_file_path + mode + service_name)
    #print(output)
    #print(errors)



