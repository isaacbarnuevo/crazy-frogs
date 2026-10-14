# 🐸 Crazy Frogs: Batalla en el Estanque

¡Videojuego retro arcade multijugador para **2 personas en el mismo teclado**! Inspirado en los clásicos juegos de ranas saltarinas cazadoras de moscas en nenúfares.

---

## 🌐 Cómo Jugar Online y Ranking Mundial (GitHub + Firebase)

El juego cuenta con un **sistema híbrido de clasificaciones**:
- **🌍 Ranking Global (Online):** Si conectas Firebase, las mejores puntuaciones de cualquier persona en el mundo se guardan y actualizan en tiempo real.
- **💻 Ranking Local (Este equipo):** Guarda las puntuaciones en el navegador actual aunque juegues sin internet.

### 1. 🚀 Publicar el juego online con GitHub Pages (100% Gratis)
Cualquier persona puede jugar entrando a tu enlace web sin instalar nada:
1. Sube esta carpeta a un nuevo repositorio público en tu cuenta de [GitHub.com](https://github.com).
2. En GitHub, entra en tu repositorio y haz clic en **Settings** (Ajustes) > **Pages** (en el menú lateral izquierdo).
3. En **Branch**, selecciona `main` (o `master`) y pulsa **Save**.
4. ¡Listo! En 1 minuto tendrás un enlace público como:
   `https://tu-usuario.github.io/crazy-frogs/`
   Compártelo con tus amigos y familiares para que jueguen directamente desde su navegador.

### 2. 🔥 Conectar el Ranking Global con Firebase Firestore (100% Gratis)
Para que todas las personas que jueguen compartan el mismo Salón de la Fama en la nube:
1. Ve a [console.firebase.google.com](https://console.firebase.google.com/) y crea un proyecto gratuito.
2. Entra en **Compilación** > **Firestore Database** > pulsa **Crear base de datos** (elige "Modo de prueba").
3. Ve al engranaje ⚙️ de **Configuración del proyecto**, baja a *Tus apps* y pulsa en el icono web **`</>`**.
4. Copia las claves que te da Firebase y pégalas dentro del archivo `firebase-config.js` de esta carpeta:
   ```javascript
   window.FIREBASE_CONFIG = {
     apiKey: "AIzaSy...",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
5. En cuanto abras el juego, el Salón de la Fama mostrará el indicador **🟢 Nube Conectada** y sincronizará automáticamente los récords del mundo entero.

---

## 👥 Nombres de Jugadores y Salón de la Fama

- **Nombres Personalizados:** Escribe el nombre de cada jugador directamente en el menú principal (ej: *Alex* vs *Dani*).
- **🏆 Salón de la Fama (Ranking):**
  - Selector entre **🌍 Ranking Global** (nube) y **💻 Este Equipo** (local).
  - Pestañas para cada modo: **Tiempo (60s)**, **Supervivencia (Vidas)** y **Carrera (30 pts)**.
  - Podio con medallas (🥇, 🥈, 🥉), dificultad y fecha.
  - Alerta especial: **⭐ ¡NUEVO RÉCORD!** si entras en el podio.

---

## 🎮 Controles

| Acción | 🐸 Jugador 1 (Rana Verde) | 🐸 Jugador 2 (Rana Coral) |
|---|---|---|
| **Moverse a los lados** | <kbd>A</kbd> / <kbd>D</kbd> | <kbd>◀</kbd> / <kbd>▶</kbd> (Flechas Izq / Dcha) |
| **Saltar** | <kbd>W</kbd> | <kbd>▲</kbd> (Flecha Arriba) |
| **Agacharse / Apuntar abajo** | <kbd>S</kbd> | <kbd>▼</kbd> (Flecha Abajo) |
| **¡LENGUAZO!** | <kbd>E</kbd> / <kbd>F</kbd> / <kbd>Espacio</kbd> | <kbd>Enter</kbd> / <kbd>Shift</kbd> / <kbd>L</kbd> / <kbd>0 NumPad</kbd> |

- **Pausar partida:** <kbd>Escape</kbd> o <kbd>P</kbd>
- **Revancha rápida (en pantalla final):** <kbd>R</kbd>

---

## 🏆 Modos de Juego

1. **⏱️ Por Tiempo (60 Segundos):** Gana quien consiga más puntos antes de que acabe el minuto.
2. **❤️ Por Vidas (Supervivencia - 3 Vidas):** Pierdes vidas con avispas y caídas profundas. ¡Gana el último en pie!
3. **🎯 Carrera (30 Puntos):** Quien antes llegue a 30 puntos gana. Se registra el tiempo récord más rápido.

---

## ⚡ Dificultades y Bichos

- **🌿 Tranquilo:** Nenúfares fijos, moscas lentas, sin avispas.
- **🦟 Normal:** Nenúfares con balanceo, libélulas rápidas y algunas avispas.
- **🌪️ Caótico:** Nenúfares en movimiento continuo, enjambre de avispas picadoras y libélulas veloces.
- **Bichos:**
  - 🦟 Mosca común (+1 pt)
  - ✨ Mosca dorada (+3 pts)
  - 🦋 Libélula (+5 pts)
  - 🐝 Avispa picadora (-2 pts o -1 vida y aturdimiento)
- **¡Mecánica BONK!:** Si golpeas con la lengua a tu rival, ¡lo empujarás y aturdirás para robarle la mosca!
