# coding=utf-8

"""This module, check_quasar_server_status.py, is used to ensure that Quasar is currently running."""

import requests as r
from universal_code import output_coloring as oc


result = r.get('http://www.quasarsource.com:1337/ping')

if result.status_code == 200:
	content = result.content.decode('utf-8')
	if content == 'Alive!':
		oc.print_ascii_yellow('build success')
	else:
		oc.print_ascii_red('build error')
		oc.print_data_with_red_dashes_at_start(str(content))
else:
	oc.print_ascii_red('build error')
	oc.print_data_with_red_dashes_at_start('HTTP response code : {' + str(result.status_code) + '}')
