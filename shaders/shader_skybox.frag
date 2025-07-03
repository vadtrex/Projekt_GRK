#version 330 core

out vec4 FragColor;

in vec3 TexCoords;

uniform sampler2D skybox;

void main()
{    
    // Konwersja z koordynat�w 3D na sferyczne wsp�rz�dne tekstury
    vec3 dir = normalize(TexCoords);
    
    // Obliczenie longitude (u) i latitude (v)
    float u = 0.5 + atan(dir.z, dir.x) / (2.0 * 3.14159265359);
    float v = 0.5 - asin(dir.y) / 3.14159265359;
    
    // Pobranie koloru z tekstury
    vec3 color = texture(skybox, vec2(u, v)).rgb;
    
    FragColor = vec4(color, 1.0);
}