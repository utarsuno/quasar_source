var pointer_lock_error = function() {
    console.log('Pointer lock is not supported!')
}

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document

if (havePointerLock) {

    var element = document.body

    var pointer_lock_change = function (event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controls.enabled = true
        } else {
            pointer_lock_error()
        }
    }

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointer_lock_change, false )
    document.addEventListener( 'mozpointerlockchange', pointer_lock_change, false )
    document.addEventListener( 'webkitpointerlockchange', pointer_lock_change, false )
    document.addEventListener( 'pointerlockerror', pointer_lock_error, false )
    document.addEventListener( 'mozpointerlockerror', pointer_lock_error, false )
    document.addEventListener( 'webkitpointerlockerror', pointer_lock_error, false )

    instructions.addEventListener( 'click', function (event) {
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
        if ( /Firefox/i.test( navigator.userAgent ) ) {
            var full_screen_change = function (event) {
                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                    document.removeEventListener( 'fullscreenchange', full_screen_change )
                    document.removeEventListener( 'mozfullscreenchange', full_screen_change )
                    element.requestPointerLock()
                }
            }
            document.addEventListener( 'fullscreenchange', full_screen_change, false )
            document.addEventListener( 'mozfullscreenchange', full_screen_change, false )
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen
            element.requestFullscreen()
        } else {
            element.requestPointerLock()
        }
    }, false)
} else {
    pointer_lock_error()
}
