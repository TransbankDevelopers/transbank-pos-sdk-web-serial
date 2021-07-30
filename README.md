# Repositorio experimental

[![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/transbankdevelopers/transbank-pos-sdk-web-serial)](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-serial/releases/latest)
[![GitHub](https://img.shields.io/github/license/transbankdevelopers/transbank-pos-sdk-web-serial)](LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/transbankdevelopers/transbank-pos-sdk-web-serial)](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-serial/graphs/contributors)
[![Build Status](https://travis-ci.com/TransbankDevelopers/transbank-pos-sdk-web-serial.svg?branch=master)](https://travis-ci.com/TransbankDevelopers/transbank-pos-sdk-web-serial)

# Transbank SDK Web Serial - Javascript

![transbank-pos-sdk-web-serial](https://user-images.githubusercontent.com/36648048/126574695-79a6b994-422d-45e8-88e0-b994554ba311.png)

Este SDK, permite conectar tu software web (punto de venta, tótem autoservicio) con tu POS Integrado o Autoservicio Transbank.

## Documentación

El SDK cuenta con soporte para POS Integrado y Autoservicio, cada uno tiene sus propios comandos y funciones.

La documentación relevante para usar este SDK es:

- Documentación general sobre los productos y sus diferencias:
  [POS Integrado](https://www.transbankdevelopers.cl/producto/posintegrado)
- Primeros pasos con [POS Integrado](https://www.transbankdevelopers.cl/documentacion/posintegrado).
Primeros pasos con [POS Autoservicio](https://www.transbankdevelopers.cl/documentacion/pos-autoservicio).
- Referencia detallada sobre [POS Integrado](https://www.transbankdevelopers.cl/referencia/posintegrado).

## Información para contribuir y desarrollar este SDK

### Estándares

- Para los commits respetamos las siguientes normas: https://chris.beams.io/posts/git-commit/
- Usamos ingles, para los mensajes de commit.
- Se pueden usar tokens como WIP, en el subject de un commit, separando el token con `:`, por ejemplo:
`WIP: This is a useful commit message`
- Para los nombres de ramas también usamos ingles.
- Se asume, que una rama de feature no mezclada, es un feature no terminado.
- El nombre de las ramas va en minúsculas.
- Las palabras se separan con `-`.
- Las ramas comienzan con alguno de los short lead tokens definidos, por ejemplo: `feat/tokens-configuration`

#### Short lead tokens
##### Commits
- WIP = Trabajo en progreso.
##### Ramas
- feat = Nuevos features
- chore = Tareas, que no son visibles al usuario.
- bug = Resolución de bugs.

### Todas las mezclas a master se hacen mediante Pull Request.

## Generar una nueva versión (con deploy automático a NPM)

Para generar una nueva versión, se debe crear un PR (con un título "Prepare release X.Y.Z" con los valores que correspondan para `X`, `Y` y `Z`). Se debe seguir el estándar semver para determinar si se incrementa el valor de `X` (si hay cambios no retrocompatibles), `Y` (para mejoras retrocompatibles) o `Z` (si sólo hubo correcciones a bugs).

En ese PR deben incluirse los siguientes cambios:

1. Modificar el archivo `CHANGELOG.md` para incluir una nueva entrada (al comienzo) para `X.Y.Z` que explique en español los cambios **de cara al usuario del SDK**.
2. No es necesario (ni se debe) editar la versión en el package.json, ya que esto se realiza automáticamente en Travis. 

Luego de obtener aprobación del pull request, debe mezclarse a master e inmediatamente generar un release en GitHub con el tag `vX.Y.Z`. En la descripción del release debes poner lo mismo que agregaste al changelog.