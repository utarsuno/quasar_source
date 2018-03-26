# coding=utf-8

"""This module, asset_file.py, provides an abstraction to asset files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo


from code_api.source_file_abstraction.code_files.code_file import *
from code_api.source_file_abstraction.code_files.reducable.compressable import Compressable


class AssetFile(CodeFile):
	"""Represents a single asset file."""

	def __init__(self, file_type, file_name, file_extensions=None):
		super().__init__(file_type, file_name, file_extensions)


class PNGFile(AssetFile, Compressable):
	"""Represents a single PNG asset file."""

	def __init__(self, file_name, file_extensions=None):
		AssetFile.__init__(self, CODE_FILE_TYPE_ASSET_PNG, file_name, file_extensions)
		Compressable.__init__(self)


class JPGFile(AssetFile, Compressable):
	"""Represents a single JPG asset file."""

	def __init__(self, file_name, file_extensions=None):
		AssetFile.__init__(self, CODE_FILE_TYPE_ASSET_JPG, file_name, file_extensions)
		Compressable.__init__(self)

