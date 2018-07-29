# coding=utf-8

"""TODO : Put in proper location + document."""

from libraries.universal_code import useful_file_operations as ufo
import xml.etree.ElementTree as ET

TEMP_PATH = '/Users/utarsuno/git_repos/quasar_source/assets/front_end/fonts/elegandhandwritingfont_medium_16.xml'

root = ET.fromstring(ufo.get_file_content_as_string(TEMP_PATH))


class C():
	def __init__(self, data):
		self.data = data
		self.c    = self.data['code']
		self.width = self.data['width']
		self.offset_x = self.data['offset'].split()[0]
		self.offset_y = self.data['offset'].split()[1]
		self.rect_x = self.data['rect'].split()[0]
		self.rect_y = self.data['rect'].split()[1]
		self.rect_width = self.data['rect'].split()[2]
		self.rect_height = self.data['rect'].split()[3]

	def __str__(self):
		return "'" + self.data['code'] + '\': new Uint16Array(7),'

	def get_settings(self):
		# self.data['rect'].split()[0]
		lines = 'this._codes[\'' + self.c + '\'][0] = ' + self.width + ';\n'
		lines += 'this._codes[\'' + self.c + '\'][1] = ' + self.offset_x + ';\n'
		lines += 'this._codes[\'' + self.c + '\'][2] = ' + self.offset_y + ';\n'
		lines += 'this._codes[\'' + self.c + '\'][3] = ' + self.rect_x + ';\n'
		lines += 'this._codes[\'' + self.c + '\'][4] = ' + self.rect_y + ';\n'
		lines += 'this._codes[\'' + self.c + '\'][5] = ' + self.rect_width + ';\n'
		lines += 'this._codes[\'' + self.c + '\'][6] = ' + self.rect_height + ';\n'
		return lines

nodes = []

for child in root:
	#print(child)
	#print(child.tag)
	#print('attrib')
	#print(child.attrib)
	# Not used.
	for c in child:
		print('---SUB CHILD---')
		print(c)
		print(c.tag)
		print(c.attrib)
		print('---------------')
	nodes.append(C(child.attrib))


for n in nodes:
	print(n)

for n in nodes:
	print(n.get_settings())
'''
width, offset_x, offset_y, rect_y, rect_width, rect_height



codes = {
	'*': [new Uint8Array(6), width, list_to_kernings],
}
'''



