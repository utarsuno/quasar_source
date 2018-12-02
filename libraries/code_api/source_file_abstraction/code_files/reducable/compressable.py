# coding=utf-8

"""This module, compressable.py, provides an abstraction for files that can get compressed."""


from libraries.universal_code import useful_file_operations as ufo
from PIL import Image


class Compressable(object):
	"""Abstraction for files that can be compressed."""

	def __init__(self):
		super().__init__()

	def convert_to_jpg_then_compress(self):
		"""Convert the file to a JPG then compress the file."""
		self._compressed_file_name = 'c_' + self.file_name
		self._compressed_save_path = self.full_path.replace(self.file_name, self._compressed_file_name).replace('.png', '.jpg')

		image = Image.open(self.full_path)
		image.save(self._compressed_save_path)

		image = Image.open(self._compressed_save_path)
		image.save(self._compressed_save_path, quality=85, progressive=False)

		transfer_path = self._compressed_save_path.replace('c_' + self.file_name, self.file_name).replace('/configuration_files/', '/quasar_site_django/')
		ufo.file_op_copy(self._compressed_save_path, transfer_path)

	def create_compressed_file(self):
		"""Creates the compressed version of the file."""
		self._compressed_file_name = 'c_' + self.file_name
		self._compressed_save_path = self.full_path.replace(self.file_name, self._compressed_file_name)
		self._is_png = 'png' in self.file_extension
		self._is_jpg = 'jpg' in self.file_extension

		image = Image.open(self.full_path)

		if self._is_png:
			image.save(self._compressed_save_path, quality=85, optimize=True, compress_level=9)
		elif self._is_jpg:
			image.save(self._compressed_save_path, quality=85, progressive=False)
		else:
			print('Non-recognized asset format!!')
			exit()


		transfer_path = self._compressed_save_path.replace('c_' + self.file_name, self.file_name).replace('/configuration_files/', '/quasar_site_django/')
		ufo.file_op_copy(self._compressed_save_path, transfer_path)

