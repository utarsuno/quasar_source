/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Film grain & scanlines shader
 *
 * - ported from HLSL to WebGL / GLSL
 * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 *
 * Screen Space Static Postprocessor
 *
 * Produces an analogue noise overlay similar to a film grain / TV static
 *
 * Original implementation and noise algorithm
 * Pat 'Hawthorne' Shearon
 *
 * Optimized scanlines + noise version with intensity scaling
 * Georg 'Leviathan' Steinrohder
 *
 * This version is provided under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by/3.0/
 *
 * MODIFICATIONS MADE.
 */
#include <common>

// control parameter
uniform float time;
// noise effect intensity value (0 = no effect, 1 = full effect)
uniform float nIntensity;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
	// sample the source
	vec4 cTextureScreen = texture2D(tDiffuse, vUv);
	// make some noise
	float dx = rand(vUv + time);
	// add noise
	vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp(0.1 + dx, 0.0, 1.0);

	// interpolate between source and result by intensity
	//cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );
	cResult = cTextureScreen.rgb + clamp(nIntensity, 0.0, 1.0) * (0-cTextureScreen.rgb);

	//gl_FragColor = vec4(cResult, cTextureScreen.a);
	cResult = vec3(cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11);
	gl_FragColor = vec4(cResult, cTextureScreen.a);
}