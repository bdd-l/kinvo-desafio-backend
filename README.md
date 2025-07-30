# 💼 Desafio Back-End - Kinvo

![Kinvo Logo](https://github.com/cbfranca/kinvo-front-end-test/blob/master/logo.svg)

---

## 📌 Sobre el Proyecto

Este repositorio contiene mi solución (incompleta) para el desafío propuesto por [Kinvo](https://github.com/kinvoapp/node.js-challenge/tree/master), con un enfoque en el desarrollo back-end. La propuesta consiste en construir una API RESTful para el control de finanzas personales: un sistema de movimientos financieros que permita registrar ingresos y gastos, consultarlos con filtros y obtener el saldo total.

---

## ⚙️ Tecnologías Utilizadas

* **Node.js**
* **TypeScript**
* **Express.js** (router elegido)
* **Yarn** (gestor de paquetes)
* **JSON** (almacenamiento de transacciones)

---

## 🚀 ¿Por qué elegí estas tecnologías?

Opté por usar **ExpressJS** por su amplia gama de bibliotecas compatibles y su flexibilidad. Es una tecnología consolidada, fácil de mantener y muy bien documentada. Para el almacenamiento de datos, decidí utilizar inicialmente un archivo **JSON** por su simplicidad y para establecer una base sólida en la construcción de rutas. Sin embargo, en el futuro, se añadirá una base de datos utilizando **Prisma ORM** y **MariaDB**.

---

## 🧠 ¿Cómo desarrollé el proyecto?

Antes de escribir una sola línea de código, decidí organizar el proyecto con un **archivo de contexto** (en Markdown), donde enumeré todos los requisitos del desafío y esbocé un plan de ejecución. Este documento fue mi guía durante todo el desarrollo. Utilicé **dos inteligencias artificiales** para potenciar mi productividad y aprender más durante el proceso:

* 💡 **OpenAI (ChatGPT)** fue mi apoyo estratégico. Lo utilicé para discutir enfoques, sugerir mejoras y realizar revisiones de código.
* 🔧 **Alibaba (Qwen)** se encargó de las partes más "mecánicas" del código: generación de fragmentos repetitivos, estructura de archivos y configuraciones básicas.

Este trabajo conjunto entre humano e IA resultó en una solución simple, limpia, bien organizada y enfocada en la mantenibilidad.

---

## ✅ Funcionalidades Implementadas (hasta el momento)

* [x] Configuración inicial con Node.js + Express + TypeScript
* [x] Configuración del entorno con Yarn
* [x] Estructura de rutas y funciones utilitarias
* [x] Organización escalable por capas (entities, routes, utils)
* [x] Integración con la base de datos MariaDB mediante Prisma

### En desarrollo

* [ ] Implementar paginación en el listado de transacciones
* [ ] Implementar una cobertura mínima de pruebas automatizadas.

---

## 📂 Estructura del Proyecto

```
src/
├── entities/
├── routes/
├── utils/
├── main.ts
```

---

## 📝 Cómo ejecutar el proyecto

```bash
# Clonar el repositorio
git clone https://github.com/seu-usuario/kinvo-backend-desafio.git
cd kinvo-backend-desafio

# Instalar dependencias
yarn install

# Ejecutar el proyecto
node dist/main.js
```

> ⚠️ **Requisitos:** Node.js 18+, Yarn & NPM, Postman o Insomnia.

---

## 🤝 Consideraciones Finales

Lo que más me sorprendió de este desafío fue el enfoque que tomé y el resultado que obtuve. El uso intencional de inteligencia artificial para potenciar mi productividad dio excelentes resultados, tanto a nivel técnico como de aprendizaje. Actué como un orquestador entre las herramientas y logré finalizar rápidamente una versión funcional del proyecto, con alta calidad de código.

---

## 🧑‍💻 Autor

By João Leite – [GitHub](https://github.com/bdd-l)
