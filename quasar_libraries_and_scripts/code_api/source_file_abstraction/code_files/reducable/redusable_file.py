# coding=utf-8

"""This module, compressable_file.py, provides an abstraction for files that can be compressed."""


class Redusable(object):
	"""Utility abstraction for files that have compression."""

	def __init__(self):
		self._compressed_file_size = None
		self._temporary_design = False

	def set_reduced_file_to_copy_out_of_configuration_files(self):
		"""Temporary design."""
		self._temporary_design = True

	@property
	def compressed_size(self):
		"""Returns the compressed file size."""
		return self._compressed_file_size

	@property
	def percent_compressed(self):
		"""Returns the % amount saved from compression."""
		# Keep only the last 3 digits.
		p = str((1.0 - float(self._compressed_file_size) / float(self.file_size)) * 100.0)
		s = p.split('.')
		base = s[0]
		end = s[1]
		if len(end) > 2:
			end = end[:2]
		return base + '.' + end

	@property
	def bytes_compressed(self):
		"""Returns the number of bytes that got compressed out."""
		return self.file_size - self._compressed_file_size

	@property
	def compression_statistics(self):
		"""Returns the compression statistics."""
		return 'compressed{' + str(self) + '} - {' + str(self.file_size) + 'b to ' + str(self._compressed_file_size) + 'b} reduction of ' + str(self.bytes_compressed) + ' bytes or ' + str(self.percent_compressed) + '%'


