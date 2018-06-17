/*

        // Disabled until this feature is needed again.
        // CSS3DRenderer.
        this.css_renderer = new THREE.CSS3DRenderer();
        this.css_renderer.setSize(this.window_width, this.window_height);
        this.css_renderer.domElement.style.position = 'absolute';
        this.css_renderer.domElement.style.top = 0;
        // TEMP
        this.css_renderer.domElement.zIndex = 900;
        document.body.appendChild(this.css_renderer.domElement);
        //this.renderer.domElement.style.top = 0;






        // Disabled until this feature is needed again.
        if (is_defined(this.css_renderer)) {
            if (is_defined(MANAGER_WORLD.current_world.css_scene)) {
                this.css_renderer.render(MANAGER_WORLD.current_world.css_scene, this.camera);
            }
        }


    this._resize_event_css = function( ) {
        // Disabled for now
        //if (is_defined(this.css_renderer)) {
        //    this.css_renderer.setSize(this.client.state_window_width_inner, this.client.state_window_height_inner);
        //}
    };

 */