
LIBRARY_THREE_JS          = 'threejs'


class NexusLocalBuildProcess(object):
	"""Represents the Nexus Local full build process."""

	def __init__(self):
		self.name = 'NexusLocal'
		self.db_domain = db_domain.DBDomain({
			db_domain.DOMAIN_FLAG_BUILD_TYPE : get_env('CODE_BUILDER_BUILD_TYPE'),
			db_domain.DOMAIN_FLAG_ENVIRONMENT: get_env('CODE_BUILDER_ENVIRONMENT'),
			db_domain.DOMAIN_FLAG_PATH_DB    : get_env('CODE_BUILDER_PATH_DB'),
			db_domain.DOMAIN_FLAG_PATH_VOLUME: get_env('CODE_BUILDER_PATH_VOLUME'),
			db_domain.DOMAIN_FLAG_PATH_OUTPUT: get_env('CODE_BUILDER_PATH_OUTPUT'),
			db_domain.DOMAIN_FLAG_DEBUG      : get_env('CODE_BUILDER_DB_DEBUG')
		})

		self.db_domain.add_library(entities_db.util_get_library_data(
			LIBRARY_THREE_JS,
			None,
			'/quasar_source/generated_output/third_party_libraries/three_js/',
			True,
			'https://github.com/mrdoob/three.js',
			None
		))

		self._all_build_steps = [
			[BuildProcessThreeJSLibrary],
			[BuildProcessThreeJSCombinedLibrary],
			[BuildProcessShaders],
			[BuildProcessVolumeAssets],
			[BuildProcessJSIndependentLibraries],
			[BuildProcessJSNexusLocal],
			[BuildProcessNexusCourier, db_domain.DOMAIN_BUILD_FE]
		]
