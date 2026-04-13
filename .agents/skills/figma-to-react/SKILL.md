# Skill: Figma JSON → React Frontend

## Rol
Actúa como Desarrollador Senior de Frontend especializado en React y UI/UX.
Cuando el usuario te pase un figma-file.json o te pida desarrollar una pantalla,
sigue este proceso completo.

## Stack obligatorio
- React 18 con hooks
- React Router v6 para navegación
- Tailwind CSS para estilos
- Fetch para llamadas HTTP
- Lucide React para iconos (cuando el JSON de Figma solo tenga referencias a IDs)

---

## Proceso de ejecución

### 1. Análisis del JSON de Figma
Antes de escribir código, extrae del figma-file.json:
- Paleta de colores → mapearlos a variables CSS y configuración de Tailwind
- Escala tipográfica → font-family, font-size, font-weight, line-height
- Espaciado y border-radius → tokens reutilizables
- Componentes identificados → mapearlos a componentes React
- Auto Layout → traducir padding, gap y flex-direction a clases Tailwind

### 2. Sistema de diseño
Crea o actualiza estos ficheros base antes de los componentes:

`src/styles/index.css`
- Variables CSS con todos los tokens del diseño
- Reset base

`tailwind.config.js`
- Extiende la paleta con los colores exactos del JSON
- Añade fuentes y tamaños custom si el diseño los usa

### 3. Estructura de ficheros esperada
src/
├── components/        # Componentes reutilizables (Button, Input, Card...)
├── pages/             # Una carpeta por pantalla
│   ├── Login/
│   ├── Register/
│   ├── VerifyEmail/
│   ├── RecoverPassword/
│   ├── Chat/
│   └── Dashboard/
├── hooks/             # Custom hooks (useAuth, useChat, useApplications)
├── services/          # Llamadas a la API usando fetch nativo (api.js wrapper)
├── context/           # AuthContext con JWT
├── styles/
│   └── index.css
└── App.jsx            # Rutas con React Router

### 4. Autenticación
- Guarda el JWT en localStorage tras login
- Crea un AuthContext que exponga: user, token, login(), logout()
- Protege rutas con un componente PrivateRoute
- Si isVerified === false tras login, redirige a /verify-email

### 5. Por cada pantalla genera
- Componente principal en su carpeta bajo /pages
- Estilos Tailwind fieles al diseño de Figma
- Integración con el servicio correspondiente
- Estados: idle | loading | error | success
- Manejo de errores visible al usuario

### 6. Estética y microinteracciones
- Transiciones suaves en hover y cambios de estado: `transition-all duration-200`
- Animaciones de entrada sutiles con Tailwind (opacity, translate)
- Glassmorphism si el diseño lo sugiere (backdrop-blur, bg-opacity)
- Sombras suaves coherentes con el JSON
- Mobile First: diseña primero para móvil y escala con breakpoints

### 7. Calidad de código
- Nombres de componentes y clases semánticos
- Accesibilidad: aria-labels, roles, contraste de color
- No uses placeholders de texto; si faltan assets usa Lucide React
- Presta atención a propiedades Auto Layout del JSON:
  - `paddingLeft/Right/Top/Bottom` → padding Tailwind
  - `itemSpacing` → gap
  - `layoutMode: HORIZONTAL/VERTICAL` → flex-row / flex-col

---

## Endpoints del backend

Base URL: definida en `src/services/api.js` como variable de entorno VITE_API_URL

### Auth
| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | /register | name, lastName, email, password | { data: { id, name, email, verifyToken } } |
| POST | /login | email, password | { data: { id, name, email, isVerified }, token } |
| POST | /verify-email | token, userId | { message } |
| POST | /send-verification-email | id, email | { message } |
| POST | /send-recovery-mail | email | { message } |
| POST | /recover-password | token, newPassword, email | { message } |

### Aplicaciones
| Método | Ruta | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | /chat | No | jobDescription, cvTemplate | { data: { company, position, email, salary, medium, cv, cover } } |
| POST | /applications | Bearer token | company, position, cv, cover, email?, salary?, medium? | { data: { id, company, position, createdAt, cvUrl, coverUrl, ... } } |

---

## Pantallas

1. **Register** → /register
2. **Login** → /login (ruta por defecto si no hay token)
3. **Email verification** → /verify-email (con token en URL params)
4. **Recovery password** → /recover-password (2 pasos: email → token+password)
5. **Chat** → /chat (ruta principal tras login)
   - Textarea para jobDescription
   - Textarea para cvTemplate
   - Muestra resultado de la IA: company, position, cover, cv
   - Campos opcionales editables: email, salary, medium
   - Botón Guardar → POST /applications
6. **Dashboard** → /dashboard
   - Lista de aplicaciones guardadas
   - cvUrl y coverUrl como botones de descarga

---

## Entregables por cada sesión de desarrollo
1. Ficheros de componentes y páginas creados
2. Integración con servicios del backend
3. Breve explicación de cómo mapeaste los elementos complejos del JSON al código

## Cliente HTTP

No uses Axios. Usa este wrapper sobre fetch nativo en `src/services/api.js`:
```javascript
const BASE_URL = import.meta.env.VITE_API_URL;

export async function api(endpoint, { body, token, method, ...options } = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: method ?? (body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...options,
  });

  if (!res.ok) throw await res.json();
  return res.json();
}
```

Todos los servicios importan y usan esta función. Ejemplo:
```javascript
// src/services/auth.service.js
import { api } from "./api";

export const login = (email, password) =>
  api("/login", { body: { email, password } });

export const register = (data) =>
  api("/register", { body: data });
```