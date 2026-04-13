---
name: refactoring
description: >
  Guidelines for refactoring code in the apply-tracker-frontend repository.
  Use this skill whenever the user wants to refactor a component, extract a custom hook,
  reorganize types or interfaces, fix naming conventions, split a bloated file, move logic
  to a service or utility, or improve code structure in any .ts or .tsx file. Also trigger
  when the user mentions "clean up this code", "this is getting too big", "where should I
  put this type", or asks how to organize anything in this project.
---

# Refactoring Guidelines — apply-tracker-frontend

## Stack

- React + TypeScript
- Servicios en `src/services/` usando el utility `api`
- Tipos compartidos en `src/types/`
- Custom hooks en `src/hooks/`

---

## Reglas de organización

### Tipos e interfaces

- **Nunca** definir interfaces inline en archivos `.ts` o `.tsx` (salvo tipos triviales y estrictamente locales).
- Todos los tipos compartidos van en `src/types/`, con nombres en singular:

```

src/types/
├── application.types.ts
├── auth.types.ts
└── common.types.ts

```

### Servicios

- Ubicación: `src/services/`
- Nombre de archivo en **singular**: `application.service.ts`, no `applications.service.ts`
- Solo manejan llamadas a la API via el utility `api`. Sin lógica de negocio.

```ts
// ✅ Correcto
export const applicationService = {
  getAll: () => api.get("/applications"),
  create: (data: CreateApplicationDto) => api.post("/applications", data),
};
```

### Custom Hooks

- Ubicación: `src/hooks/`
- Nombre: `use-[nombre].ts` (kebab-case)
- Extraer aquí cualquier lógica de estado, efectos, o llamadas a servicios que se repita en más de un componente.

### Componentes

- Un componente = una responsabilidad. Si un componente hace fetch de datos, maneja formulario Y renderiza UI compleja: dividirlo.
- Si hay lógica reutilizable, extraerla a un hook antes de duplicarla.

---

## Patrones prohibidos

| ❌ Evitar                                 | ✅ Hacer                  |
| ----------------------------------------- | ------------------------- |
| Interface inline en `.tsx`                | Moverla a `src/types/`    |
| Nombre plural en services/routes          | `application.service.ts`  |
| Números mágicos o strings hardcodeados    | Extraer a constantes      |
| Funciones de más de 25-30 líneas          | Extraer subfunciones      |
| Componente que hace fetch + form + render | Separar responsabilidades |

---

## Proceso de refactoring

1. **Identificar** el smell: tipo inline, componente inflado, lógica duplicada
2. **Extraer tipos** → `src/types/`
3. **Extraer lógica** → hook o utility
4. **Simplificar** el componente o función resultante
5. **Verificar** que todo sigue funcionando

---

## Preguntas frecuentes

**¿Dónde va este tipo?**
→ Si lo usan dos o más archivos: `src/types/`. Si es local y trivial, puede quedarse.

**¿Dónde va esta lógica?**
→ Llamada a API: `src/services/`. Estado + efectos: `src/hooks/`. Transformación de datos pura: `src/utils/`.

**¿Divido este componente?**
→ Si tiene más de una razón para cambiar, sí.

```

---
```
