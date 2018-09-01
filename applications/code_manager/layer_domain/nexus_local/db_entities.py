# coding=utf-8

"""This module, html_file.py, represents a DB Entity (HTML file)_for NexusLocal."""

from applications.code_manager.layer_domain.abstractions import db_entities_base as db
from libraries.universal_code.system_abstraction.system_functions import get_system_environment as get_env


class DBEntityCodeProjectNexusLocal(db.DBEntityCodeProject, db.DBEntitySpecificInstance):
	"""Represents the Nexus Local project."""

	def __init__(self):
		db.DBEntityCodeProject.__init__(self, get_env('CODE_BUILDER_DB_PATH'), get_env('DB_DEBUG'))
		db.DBEntitySpecificInstance.__init__(self, 'nexus_local')
		self.instance_name = 'nexus_local'

		self.files_project   = db.DBEntityProjectFile()
		self.files_generated = db.DBEntityGeneratedFile(self.files_project)
		self.files_source    = db.DBEntitySourceFile(self.files_project)

	def ensure_data(self):
		"""Ensures any data the needs to exist, does."""
		self.ensure_self_row_exists()
		self.files_project.initial_load(self._db)

	def ensure_generated_filed_cached(self, full_path, file_size, parent_file, parent_file_generated, sent_path=False, update=False):
		"""Checks if the generated file provided is cached. If not, cache it."""
		was_cached = True
		gf_id      = None

		if not self.files_project.is_cached(full_path):
			pf_id = self.files_project.cache_file_data(full_path, file_size)
			if sent_path:
				gf_id = self.files_generated.cache_file(pf_id, self.files_project.get_file_id_from_path(parent_file), parent_file_generated)
			else:
				gf_id = self.files_generated.cache_file(pf_id, self.files_project.get_file_id(parent_file), parent_file_generated)
			was_cached = False
		elif update:
			self.files_project.update_file_size(full_path, file_size)

		return was_cached, gf_id, full_path

	def ensure_source_file_cached(self, f):
		"""Checks if the source file provided is cached. If not, cache it."""
		if not self.files_project.is_cached(f.full_path):
			pf_id = self.files_project.cache_file(f)
			self.files_source.cache_file(f, pf_id)
			return True, False
		else:
			cached_md5sum = self.files_source.table.get_value('md5sum', 'sf_id', self.files_source.get_sf_id_from_pf_id(self.files_project.get_file_id_from_path(f.full_path)))
			current_md5sum = f.md5sum
			if cached_md5sum != current_md5sum:
				self.files_source.update_md5sum(f, self.files_project.get_file_id_from_path(f.full_path))
				self.files_project.update_file_size(f.full_path, f.file_size)
				return False, True
			return False, False


class DBEntityMicroServiceNexusLocal(db.DBEntityMicroService, db.DBEntitySpecificInstance):
	"""Represents the front end component of NexusLocal."""

	def __init__(self, parent_code_project):
		db.DBEntityMicroService.__init__(self, parent_code_project)
		db.DBEntitySpecificInstance.__init__(self, 'nexus_local')

	def ensure_data(self):
		"""Ensures any data the needs to exist, does."""
		self.ensure_self_row_exists()


class DBEntityBuildProcessNexusLocalFrontEnd(db.DBEntityBuildProcess, db.DBEntitySpecificInstance):
	"""Represents the build process for Nexus Local front end."""

	def __init__(self, parent_micro_service):
		db.DBEntityBuildProcess.__init__(self, parent_micro_service)
		db.DBEntitySpecificInstance.__init__(self, 'front_end')

	def ensure_data(self):
		"""Ensures any data the needs to exist, does."""
		self.ensure_self_row_exists()


# TODO:
class DBEntitySubBuildProcessNexusLocalFrontEndHTML(db.DBEntitySubBuildProcess, db.DBEntitySpecificInstance):
	"""Represents the sub build process for Nexus Local front end HTML."""

	def __init__(self, parent_build_process):
		db.DBEntitySubBuildProcess.__init__(self, parent_build_process)
		db.DBEntitySpecificInstance.__init__(self, 'front_end_HTML')

	def ensure_data(self):
		"""Ensures any data the needs to exist, does."""
		self.ensure_self_row_exists()

