// From : https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Shader-Glow.html
uniform vec3 glowColor;
varying float intensity;
void main()
{
	vec3 glow = glowColor * intensity;
    gl_FragColor = vec4( glow, 1.0 );
}