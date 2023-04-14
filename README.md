# Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js

## Daniel Jorge Acosta

### alu0101239187@ull.edu.es

[![tests]

[![coveralls]

[![Quality Gate Status]

## Índice

- [Introducción](https://ull-esit-inf-dsi-2223.github.io/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/#introducción)
- [Ejercicios](https://ull-esit-inf-dsi-2223.github.io/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/#ejercicios)
- [Conclusión](https://ull-esit-inf-dsi-2223.github.io/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/#conclusión)
- [Bibliografía](https://ull-esit-inf-dsi-2223.github.io/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/#bibliografía)

## Introducción

Esta práctica consiste en la realización de varios ejercicios relacionados con el uso de las APIs asíncronas de gestión del sistema de ficheros, de creación de procesos y de creación de sockets de Node.js. El desarrollo de dichos ejercicios se encuentra explicado más adelante. El proyecto sigue la siguiente estructura de directorios:

- **dist**: Código JavaScript generado
- **docs**: Documentación del código
- **src**: Código fuente TypeScript
  - **ejercicio-n**: Directorio para el código fuente del ejercicio n
- **tests**: Tests del código fuente TypeScript

Durante el desarrollo del sistema, se han utilizado las siguientes herramientas:

- **ESLint** para la comprobación de errores
- **Prettier** para el formateo del código
- **TypeDoc** para la generación automática de documentación del código
- **Mocha** y **Chai** para el desarrollo dirigido por pruebas
- **C8** para la comprobación del cubrimiento del código fuente
- **GitHub Actions** para la integración continua del código ejecutado en **Node.js**, el envío de información de cubrimiento a **Coveralls** y la comprobación de calidad y seguridad del código fuente con **Sonar Cloud**

## Ejercicios

### Ejercicio 1 - Traza de ejecución

En este ejercicio se realizará una traza de ejecución del siguiente código, mostrando el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores en cada momento de su ejecución:

```typescript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

#### Funcionamiento del programa

El programa vigila los cambios que se realicen en un fichero. Para esto, lo primero que hace, después de comprobar que el número de argumentos es el correcto, es comprobar que elfichero existe. Esto se puede lograr gracias al método `access` de `fs`, que permite comprobar permisos indicándole la ruta de un fichero, el permiso a comprobar y un callback a ejecutarse tras la comprobación. Para indicar que permisos se van a comprobar se utiliza el espacio de nombres `constants`, que incluye todas las constantes de las que hacen uso los métodos y clases de `fs` como opciones. En este caso, se utiliza la constante `F_OK`, que no hace que se comprueben permisos, si no la visibilidad del fichero. 

Tras comprobar que el fichero es visible, muestra un mensaje por pantalla indicando que se comienza a vigilar el fichero y ejecuta la función `watch` para ello. Tras esto, muestra el mensaje1 \`File ${filename} is no longer watched\` por consola, dado que es código síncrono. Sin embargo, `watcher` se sigue ejecutando y se ha establecido un listener que se ejecutará cada vez que se genere un evento de tipo *change*, lo que en este contexto será cada vez que haya un cambio en el fichero.

#### Traza del programa

Asumimos que durante la ejecución del programa todo va bien y no sucede ningún error, es decir, se introduce el nombre de un fichero y este es visible y accesible por parte del programa. En este caso, lo primero que pasará es que entrará a la pila de llamadas la función `access`. Al ejecutarse, esta saldrá de la pila de llamadas y el callback resultado de su ejecución pasará a la cola de manejadores, dado que su primera sentencia no necesita esperar. Esto significa que la sentencia `console.log("Starting to watch file ${filename}");` pasará a la pila de llamadas para ejecutarse. Tras su ejecución, pasará a la pila de llamadas la función `watch`, que se ejecutará en segundo plano al tratarse de una función asíncrona. Tras esto, se añadirá a la pila de llamadas la creación del listener sobre `watcher`, que pasará tras crearse y salir de la pila de llamadas al registro de eventos de la API a la espera de que suceda algún evento de tipo *change*. Para terminar con la ejecución inicial, pasará a la pila de llamadas la última sentencia del callback, `console.log("File ${filename} is no longer watched");`, ejecutándose y mostrando el contenido por pantalla. 

En este punto, la pila de llamadas y la cola de manejadores están vacías y en el registro de eventos de la API se encuentra el listener de `watcher`. Cada vez que suceda un cambio en el fichero, `watcher` emitirá uno o dos(presumiblemente por errores en la función) eventos *change*. Estos eventos desencadenarán que el callback del listener pase a la cola de manejadores, tras lo que pasarán en orden de entrada a la pila de llamadas, ejecutándose en orden LIFO.

## Conclusión

## Bibliografía

- [Desarrollo de Sistemas Informáticos - Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js](https://ull-esit-inf-dsi-2223.github.io/prct10-fs-proc-sockets-funko-app/)
- [Desarrollo de Sistemas Informáticos - Node.js](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)
- [Node.js fs documentation](https://nodejs.org/docs/latest-v19.x/api/fs.html)
- [JavaScript Visualized: Event Loop](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)