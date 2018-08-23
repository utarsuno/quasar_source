#!/usr/bin/env bash

# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
apk add --no-cache bash
apk add --no-cache bash-completion

if [ "$1" = "true" ]; then

    mkdir /assets
    mkdir /assets/third_party
    chmod 701 /assets
    chmod 701 /assets/third_party

    ln -s /quasar/generated_output/web_assets/quasar_nexus.min.css    /assets/nl.min.css
    ln -s /quasar/generated_output/web_assets/quasar_nexus.min.css.gz /assets/nl.min.css.gz
    ln -s /quasar/generated_output/web_assets/nexus_local.min.html    /assets/nl.min.html
    ln -s /quasar/generated_output/web_assets/nexus_local.min.html.gz /assets/nl.min.html.gz
    ln -s /quasar/generated_output/web_assets/nexus_local.min.js      /assets/nl.min.js
    ln -s /quasar/generated_output/web_assets/nexus_local.min.js.gz   /assets/nl.min.js.gz

    ln -s /quasar/libraries/front_end/js/third_party/javascript_cookies/jcookie.js                 /assets/third_party/js.cookie.js
    ln -s /quasar/libraries/front_end/js/third_party/javascript_cookies/jcookie.js.gz              /assets/third_party/js.cookie.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three.min.js                                  /assets/third_party/three.min.js
    ln -s /quasar/libraries/front_end/js/third_party/three.min.js.gz                               /assets/third_party/three.min.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/graphics/shaders/CopyShader.js                /assets/third_party/CopyShader.js
    ln -s /quasar/libraries/front_end/js/third_party/graphics/shaders/CopyShader.js.gz             /assets/third_party/CopyShader.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/graphics/shaders/FXAAShader.js                /assets/third_party/FXAAShader.js
    ln -s /quasar/libraries/front_end/js/third_party/graphics/shaders/FXAAShader.js.gz             /assets/third_party/FXAAShader.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/EffectComposer.js    /assets/third_party/EffectComposer.js
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/EffectComposer.js.gz /assets/third_party/EffectComposer.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/RenderPass.js        /assets/third_party/RenderPass.js
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/RenderPass.js.gz     /assets/third_party/RenderPass.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/ShaderPass.js        /assets/third_party/ShaderPass.js
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/ShaderPass.js.gz     /assets/third_party/ShaderPass.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/OutlinePass.js       /assets/third_party/OutlinePass.js
    ln -s /quasar/libraries/front_end/js/third_party/graphics/post_processing/OutlinePass.js.gz    /assets/third_party/OutlinePass.js.gz

    ln -s /quasar/assets/front_end/texture/spritesheet/icons.png              /assets/p0.png
    ln -s /quasar/assets/front_end/texture/third_party/transition.png         /assets/p1.png
    ln -s /quasar/assets/front_end/fonts/elegandhandwritingfont_medium_16.png /assets/p2.png
    ln -s /quasar/assets/front_end/fonts/elegandhandwritingfont_medium_32.png /assets/p3.png

    ln -s /quasar/assets/front_end/favicon/favicon.png /assets/favicon.png
fi

rm -rf /var/cache/apk/*
rm -rf /root/.cache/pip/*
rm /var/cache/quasar_application_setup_steps.sh



# ------------------------------------------------------------------------------------------------------------------------------

#  __   __   __          __        __  ___  ___           ___  __      ___         ___
# /  ` /  \ |__) \ /    |__)  /\  /__`  |  |__     | |\ |  |  /  \    |__  | |    |__
# \__, \__/ |     |     |    /~~\ .__/  |  |___    | | \|  |  \__/    |    | |___ |___
# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
#COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
#RUN ash /var/cache/quasar_application_setup_steps.sh {true or false: to link assets}
# ------------------------------------------------------------------------------------------------------------------------------

