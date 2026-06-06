# Technical Specifications

## Plataforma
- TikTok Effect House

## Desarrollo
- Visual Scripting de Effect House
- JavaScript opcional para lógica básica de interacción
- Experiencia 100% local en el dispositivo

## Assets
- Cancha de tenis simplificada (2D o 3D de baja complejidad)
- Pelota de tenis básica (modelo o sprite)
- UI ligera para marcador
- Efectos de partículas suaves (tierra batida)

## Arquitectura
### Entrada
- Cámara frontal del dispositivo
- Head Tracking nativo para detección de movimiento

### Lógica
- Spawn de pelotas en intervalos regulares
- Detección de impacto basada en posición de cabeza
- Sistema de puntuación incremental por acierto
- Progresión de niveles según score

### Salida
- Animación de impacto al golpear la pelota
- Marcador de score visible
- Cambio de dificultad entre niveles
- Pantalla final de victoria

## Decisiones técnicas
- Evitar backend para maximizar velocidad de desarrollo y compatibilidad
- Mantener assets ligeros para buen rendimiento en móviles
- Enfatizar una mecánica clara y comprensible en segundos
- Priorizar compatibilidad con dispositivos de consumo masivo de TikTok