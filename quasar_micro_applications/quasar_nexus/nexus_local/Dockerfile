FROM python:3.6-alpine

# Update index of available packages, then update the currently installed packages.
RUN apk update && apk upgrade

# Add required tools.
RUN apk add --no-cache libc-dev \
    && apk add --no-cache gcc \
    && apk add --no-cache bash \
    && apk add --no-cache bash-completion

# Django specific libraries needed.
RUN pip3 install --no-cache-dir Django==2.0.3 \
    && pip3 install --no-cache-dir django-channels==0.7.0 \
    #&& pip3 install --no-cache-dir django-htmlmin==0.10.0 \
    && pip3 install --no-cache-dir django-websocket-redis==0.5.1 \
    # Lazyme, from universal code.
    && pip3 install --no-cache-dir lazyme

# COMBINE LATER
RUN apk add --no-cache zlib-dev \
    && apk add --no-cache jpeg-dev

# combine this later, temporarily avoid re-building of previous libraries.
RUN pip3 install --no-cache-dir csscompressor \
    && pip3 install --no-cache-dir jsmin \
    && pip3 install --no-cache-dir pillow \
    && pip3 install --no-cache-dir htmlmin

# Clear other cache that got missed.
RUN rm -rf /var/cache/apk/* \
    && rm -rf /root/.cache/pip/*

# Create needed directories.
RUN mkdir ./quasar \
    && mkdir ./assets \
    && mkdir ./assets/js \
    && mkdir ./assets/js/third_party \
    && mkdir ./assets/js/third_party/javascript_cookies \
    && mkdir ./assets/js/third_party/graphics \
    && mkdir ./assets/js/third_party/graphics/shaders \
    && mkdir ./assets/js/third_party/graphics/post_processing \
    && mkdir ./assets/js/custom

# Run Nexus Local.
CMD ["/quasar/source/quasar_libraries_and_scripts/all_scripts/local/nexus/for_instances/run_local_nexus.sh"]



#<!-- Shaders and Post Processors -->
#ln -s /quasar/source/assets/js/third_party/graphics/shaders/CopyShader.js assets/js/third_party/graphics/shaders/CopyShader.js
#ln -s /quasar/source/assets/js/third_party/graphics/shaders/FXAAShader.js assets/js/third_party/graphics/shaders/FXAAShader.js
#ln -s /quasar/source/assets/js/third_party/graphics/post_processing/EffectComposer.js assets/js/third_party/graphics/post_processing/EffectComposer.js
#ln -s /quasar/source/assets/js/third_party/graphics/post_processing/RenderPass.js assets/js/third_party/graphics/post_processing/RenderPass.js
#ln -s /quasar/source/assets/js/third_party/graphics/post_processing/ShaderPass.js assets/js/third_party/graphics/post_processing/ShaderPass.js
#ln -s /quasar/source/assets/js/third_party/graphics/post_processing/OutlinePass.js assets/js/third_party/graphics/post_processing/OutlinePass.js