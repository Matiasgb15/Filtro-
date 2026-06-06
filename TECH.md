Plataforma
TikTok Effect House
Desarrollo
Visual Scripting de Effect House
JavaScript (opcional, solo para lógica básica de interacción)
Assets
Cancha de tenis simplificada (2D o 3D low complexity)
Pelota de tenis básica (modelo o sprite)
UI simple para marcador
Efectos de partículas ligeros (tierra batida)
Arquitectura General
Entrada (Input)
Cámara frontal del dispositivo
Face / Head Tracking para detectar movimiento del usuario
Lógica de Interacción
Spawn simple de pelotas en intervalos
Detección de “impacto” mediante posición de cabeza
Sistema de puntuación básico (incremental)
Progresión por rondas según score
Salida (Output)
Animación de impacto
Marcador en pantalla
Cambio de nivel de dificultad
Pantalla final de resultado (victoria)
Decisiones Técnicas
Uso de Head Tracking nativo para maximizar compatibilidad y simplicidad de uso.
Lógica sin backend (100% local en el dispositivo) para acelerar desarrollo y publicación.
Mecánica tipo “Pong simplificado” para garantizar comprensión inmediata en contexto TikTok.
Assets livianos (low-poly / sprites) para asegurar buen rendimiento en dispositivos móviles.
Experiencia limitada a pocos segundos para alinearse con consumo rápido de contenido en TikTok.