#version 330 core

in float vWindSpeed;
in float vAnimationProgress;
in float vLocalPosition;

uniform vec3 baseColor;
uniform float maxWindSpeed;
uniform float time;

out vec4 FragColor;

void main()
{   
    // Parametry animacji linii wiatru
    float baseAlpha = 1.0;
    
    // Normalizacja pr�dko�ci wiatru do zakresu [0.1, 1.0]
    float speedNormalized = clamp(vWindSpeed / maxWindSpeed, 0.1, 1.0);
    
    // D�ugo�� lini zale�na od pr�dko�ci wiatru
    float lineLength = 1.0 + speedNormalized * 1.5; // Zakres od 1.1 do 2.5
    
    float wavePosition = vAnimationProgress - lineLength;
    float visibilityAlpha = 0.0;
    
    if (vLocalPosition >= wavePosition && vLocalPosition <= wavePosition + lineLength) {
        float relativePos = (vLocalPosition - wavePosition) / lineLength;
        
        // Oblicz pozycj� w �ladzie
        float trailPosition = relativePos;
        
        float trailFactor;
        
        if (trailPosition <= 0.3) {
            // Pocz�tek linii - pe�na intensywno�� z lekkim fade-in
            trailFactor = smoothstep(0.0, 0.1, trailPosition);
        } else if (trailPosition <= 0.7) {
            // �rodek linii - stopniowy spadek
            float midProgress = (trailPosition - 0.3) / 0.4;
            trailFactor = 1.0 - pow(midProgress, 0.8) * 0.3; // Delikatny spadek
        } else {
            // Koniec linii - zanikanie do 0
            float endProgress = (trailPosition - 0.7) / 0.3;
            
            // Oblicz warto�� na pocz�tku tej sekcji
            float startValue = 1.0 - pow(1.0, 0.8) * 0.3; // = 0.7
            
            // Szybszy wiatr = szybsze zanikanie
            float fadeExponent = 1.5 + speedNormalized * 1.0; // Zakres od 1.6 do 2.5
            trailFactor = startValue * pow(1.0 - endProgress, fadeExponent);
        }
        
        visibilityAlpha = trailFactor;
        
        // Ograniczenie do przedzia�u [0, 1]
        visibilityAlpha = clamp(visibilityAlpha, 0.0, 1.0);
    }
    
    float finalAlpha = baseAlpha * visibilityAlpha;
    
    // Odrzucenie niewidocznych element�w
    if (finalAlpha < 0.01) {
        discard;
    }

    FragColor = vec4(baseColor, finalAlpha);
}