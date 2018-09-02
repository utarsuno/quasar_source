# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

import requests



class BuildProcessThreeJS(object):
	"""Cache checker for Three.JS."""

	def __init__(self):
		y = 2

	def a(self):
		print('TODO: CHECK IF uTT NEEDS TO BE UPDATED!!')

		result = requests.get('https://api.github.com/repos/mrdoob/three.js/releases/latest')
		if result.status_code == 200:
			r = result.content
			print(r)



