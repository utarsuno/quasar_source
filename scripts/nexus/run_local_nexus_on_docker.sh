#!/usr/bin/env bash

source /quasar/libraries/scripts/script_utilities.sh

#export PYTHONPATH="${PYTHONPATH}:/quasar"

python /quasar/libraries/code_api/discrete_projects/rendering_engine/build_rendering_engine.py 'n';
VAR_BUILD_RESULT=$?;

print_dashed_line_with_text "Build Result:"
if [ ${VAR_BUILD_RESULT} -eq 0 ]; then
    print_green_text "Success building Nexus Local!";
else
    terminate_script "Error building Nexus local!";
    exit;
fi
print_dotted_line_green


ln -s /quasar/generated_output/web_assets/quasar_nexus.min.css           /assets/nl.min.css
ln -s /quasar/libraries/front_end/html/quasar_nexus/nexus_local.min.html /assets/nl.min.html

ln -s /quasar/libraries/front_end/js/third_party/three.min.js                    /assets/third_party/three.min.js
ln -s /quasar/libraries/front_end/js/third_party/stats.min.js                    /assets/third_party/stats.min.js
ln -s /quasar/libraries/front_end/js/third_party/javascript_cookies/js.cookie.js /assets/third_party/js.cookie.js
ln -s /quasar/libraries/front_end/js/third_party/CSS3DRenderer.js                /assets/third_party/CSS3DRenderer.js

#<!-- Shaders and Post Processors -->
ln -s /quasar/libraries/front_end/js/third_party/graphics/shaders/CopyShader.js             /assets/third_party/CopyShader.js
ln -s /quasar/libraries/front_end/js/third_party/graphics/shaders/FXAAShader.js             /assets/third_party/FXAAShader.js
ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/EffectComposer.js /assets/third_party/EffectComposer.js
ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/RenderPass.js     /assets/third_party/RenderPass.js
ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/ShaderPass.js     /assets/third_party/ShaderPass.js
ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/OutlinePass.js    /assets/third_party/OutlinePass.js

#
ln -s /quasar/libraries/front_end/js/nexus/nexus/nexus_local.min.js /assets/nl.min.js

# Assets.
ln -s /quasar/assets/front_end/texture/spritesheet/icons.png              /assets/p0.png
ln -s /quasar/assets/front_end/texture/third_party/transition.png         /assets/p1.png
ln -s /quasar/assets/front_end/fonts/elegandhandwritingfont_medium_16.png /assets/p2.png
ln -s /quasar/assets/front_end/fonts/elegandhandwritingfont_medium_32.png /assets/p3.png

ln -s /quasar/assets/front_end/favicon/favicon.png /assets/favicon.png



#############
python /quasar/applications/nexus/local/manage.py runserver 0:1337 --noreload
#python /quasar/applications/nexus/local/manage.py runworker


