#!/usr/bin/env bash

export PYTHONPATH="${PYTHONPATH}:/quasar/source"

python /quasar/source/quasar_libraries_and_scripts/code_api/discrete_projects/rendering_engine/build_rendering_engine.py 'n'

ln -s /quasar/source/quasar_libraries_and_scripts/front_end/css/quasar_nexus.min.css assets/_.min.css
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/html/quasar_nexus/nexus_local.min.html assets/nexus_local.min.html

ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/three.min.js assets/js/third_party/three.min.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/stats.min.js assets/js/third_party/stats.min.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/javascript_cookies/js.cookie.js assets/js/third_party/javascript_cookies/js.cookie.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/CSS3DRenderer.js assets/js/third_party/CSS3DRenderer.js

#<!-- Shaders and Post Processors -->
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/graphics/shaders/CopyShader.js assets/js/third_party/graphics/shaders/CopyShader.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/graphics/shaders/FXAAShader.js assets/js/third_party/graphics/shaders/FXAAShader.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/graphics/post_processing/EffectComposer.js assets/js/third_party/graphics/post_processing/EffectComposer.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/graphics/post_processing/RenderPass.js assets/js/third_party/graphics/post_processing/RenderPass.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/graphics/post_processing/ShaderPass.js assets/js/third_party/graphics/post_processing/ShaderPass.js
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/third_party/graphics/post_processing/OutlinePass.js assets/js/third_party/graphics/post_processing/OutlinePass.js

#
ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/nexus/nexus/nexus_local.min.js assets/js/nexus/nexus/nexus_local.min.js

# Assets.
ln -s /quasar/source/quasar_assets/front_end/texture/spritesheet/a.png assets/a.png

#
#ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/rendering_enginge/engine/engine.js assets/js/nexus_local.min.js
#ln -s /quasar/source/quasar_libraries_and_scripts/front_end/js/rendering_enginge/engine/engine.js assets/js/nexus_local.min.js

#quasar_libraries_and_scripts/front_end/js/third_party/CSS3DRenderer.js

python /quasar/source/quasar_micro_applications/quasar_nexus/nexus_local/manage.py runserver 0.0.0.0:1337 --noreload
