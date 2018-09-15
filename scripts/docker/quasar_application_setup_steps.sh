#!/usr/bin/env bash

# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
apk add --no-cache bash
apk add --no-cache bash-completion

if [ "$1" = "true" ]; then

    mkdir /a
    mkdir /b
    chmod 701 /a
    chmod 701 /b

    ln -s /quasar/generated_output/web_assets/nexus_local.min.css     /a/nl.min.css
    ln -s /quasar/generated_output/web_assets/nexus_local.min.css.gz  /a/nl.min.css.gz
    ln -s /quasar/generated_output/web_assets/nexus_local.min.html    /a/nl.min.html
    ln -s /quasar/generated_output/web_assets/nexus_local.min.html.gz /a/nl.min.html.gz
    ln -s /quasar/generated_output/web_assets/nexus_local.min.js      /a/nl.min.js
    ln -s /quasar/generated_output/web_assets/nexus_local.min.js.gz   /a/nl.min.js.gz

    ln -s /quasar/libraries/front_end/js/third_party/cookies/cookie.js                                      /b/cookie.js
    ln -s /quasar/libraries/front_end/js/third_party/cookies/cookie.js.gz                                   /b/cookie.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three_js/three.min.js                                  /b/three.min.js
    ln -s /quasar/libraries/front_end/js/third_party/three_js/three.min.js.gz                               /b/three.min.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/shaders/CopyShader.js                /b/CopyShader.js
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/shaders/CopyShader.js.gz             /b/CopyShader.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/shaders/FXAAShader.js                /b/FXAAShader.js
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/shaders/FXAAShader.js.gz             /b/FXAAShader.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/EffectComposer.js    /b/EffectComposer.js
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/EffectComposer.js.gz /b/EffectComposer.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/RenderPass.js        /b/RenderPass.js
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/RenderPass.js.gz     /b/RenderPass.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/ShaderPass.js        /b/ShaderPass.js
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/ShaderPass.js.gz     /b/ShaderPass.js.gz
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/OutlinePass.js       /b/OutlinePass.js
    ln -s /quasar/libraries/front_end/js/third_party/three_js/graphics/post_processing/OutlinePass.js.gz    /b/OutlinePass.js.gz

    ln -s /quasar/assets/texture/spritesheet/icons.png              /a/p0.png
    ln -s /quasar/assets/texture/third_party/transition.png         /a/p1.png
    ln -s /quasar/assets/fonts/elegandhandwritingfont_medium_16.png /a/p2.png
    ln -s /quasar/assets/fonts/elegandhandwritingfont_medium_32.png /a/p3.png

    ln -s /quasar/assets/favicon/favicon.png /a/favicon.png
fi

rm -rf /var/cache/apk/*
rm -rf /root/.cache/pip/*
rm /var/cache/quasar_application_setup_steps.sh



# ------------------------------------------------------------------------------------------------------------------------------

#  __   __   __          __        __  ___  ___           ___  __      ___         ___
# /  ` /  \ |__) \ /    |__)  /\  /__`  |  |__     | |\ |  |  /  \    |__  | |    |__
# \__, \__/ |     |     |    /~~\ .__/  |  |___    | | \|  |  \__/    |    | |___ |___
# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
# TODO: Automate management of Dockerfiles.
#COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
#RUN ash /var/cache/quasar_application_setup_steps.sh {true or false: to link assets} {other library name or null}
# ------------------------------------------------------------------------------------------------------------------------------

