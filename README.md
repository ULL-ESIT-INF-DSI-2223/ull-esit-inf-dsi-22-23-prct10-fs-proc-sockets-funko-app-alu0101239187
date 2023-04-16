# Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js

## Daniel Jorge Acosta

### alu0101239187@ull.edu.es

[![tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/actions/workflows/node.js.yml)

[![coveralls](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187/actions/workflows/coveralls.yml)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-alu0101239187)

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

### Ejercicio 1

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

Tras comprobar que el fichero es visible, muestra un mensaje por pantalla indicando que se comienza a vigilar el fichero y ejecuta la función `watch` para ello. Tras esto, muestra el mensaje \`File $\{filename\} is no longer watched\` por consola, dado que es código síncrono. Sin embargo, `watcher` se sigue ejecutando y se ha establecido un listener que se ejecutará cada vez que se genere un evento de tipo *change*, lo que en este contexto será cada vez que haya un cambio en el fichero.

#### Traza del programa

Asumimos que durante la ejecución del programa todo va bien y no sucede ningún error, es decir, se introduce el nombre de un fichero y este es visible y accesible por parte del programa. En este caso, lo primero que pasará es que entrará a la pila de llamadas la función `access`. Al ejecutarse, esta saldrá de la pila de llamadas y el callback resultado de su ejecución pasará a la cola de manejadores, dado que su primera sentencia no necesita esperar. Esto significa que la sentencia `console.log("Starting to watch file ${filename}");` pasará a la pila de llamadas para ejecutarse. Tras su ejecución, pasará a la pila de llamadas la función `watch`, que se ejecutará en segundo plano al tratarse de una función asíncrona. Tras esto, se añadirá a la pila de llamadas la creación del listener sobre `watcher`, que pasará tras crearse y salir de la pila de llamadas al registro de eventos de la API a la espera de que suceda algún evento de tipo *change*. Para terminar con la ejecución inicial, pasará a la pila de llamadas la última sentencia del callback, `console.log("File ${filename} is no longer watched");`, ejecutándose y mostrando el contenido por pantalla. 

En este punto, la pila de llamadas y la cola de manejadores están vacías y en el registro de eventos de la API se encuentra el listener de `watcher`. Cada vez que suceda un cambio en el fichero, `watcher` emitirá uno o dos(presumiblemente por errores en la función) eventos *change*. Estos eventos desencadenarán que el callback del listener pase a la cola de manejadores, tras lo que pasarán en orden de entrada a la pila de llamadas, ejecutándose en orden LIFO.

### Ejercicio 2

Este ejercicio se trata de crear un programa que ejecute el comando `wc` con las opciones requeridas por el usuario y muestre su resultado por consola. Para controlar la entrada de argumentos al programa se utiliza `yargs`, creando dos comandos:

- Comando `pipe`: Este comando forma un array de opciones según las que se hayan introducido en `yargs` y ejecuta `wc` con este array, utilizando un pipe para mostrar por consola la salida estándar y la salida de errores.
- Comando `no-pipe`: Este comando ejecuta el comando `wc` sobre el fichero introducido y muestra por consola una cadena con la salida del comando cuando este termina que varía dependiendo de las opciones que se hayan introducido en `yargs` y el resultado de este.

Para asegurar que las opciones introducidas al comando son válidas, se ha utilizado el método `strict(true)` de `yargs`, haciendo que se muestre la ayuda y el error cuando se encuentre un argumento inválido. En el caso de este ejercicio, no se han realizado pruebas por la intervención de `yargs` y dado que el resultado del código asíncrono es mostrado por la consola únicamente.

### Ejercicio 3 - Cliente y servidor para aplicación de registro de Funko Pops

En este ejercicio se cambia la implementación de la aplicación de registro de Funko Pops desarrollada en la [práctica 9](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct09-funko-app-alu0101239187), separándola en un servidor encargado de la gestión de ficheros y colecciones y un cliente encargado de la interacción con el usuario. En este informe se tratarán los cambios que se han realizado únicamente.

#### Clase Funko

En la clase `Funko` que se utiliza para almacenar los datos de los Funkos se ha agregado una función estática `funkoFromJSON` que permite obtener una instancia de un Funko a partir de un objeto JSON con la información del Funko.

#### Servidor

Como se ha explicado antes, la aplicación se ha divido en cliente y servidor. El lado servidor se encarga de la gestión de ficheros. Para esto, lo primero que hace es comprobar que la carpeta en la que se va a guardar la información exista para evitar fallos y, en caso de que no exista, la crea con el uso de la API síncrona, ya que no se debe iniciar el servidor sin haber creado la carpeta antes porque podrían ocurrir comportamientos no deseados. Con cada conexión, el servidor inicia listeners para varios eventos:

- *data*: Cuando llega información en la conexión la añade a una cadena. Cuando encuentra un salto de línea, interpreta que la información está completa y emite un evento *request* junto a la información obtenida en formato JSON.
- *request*: Cuando el servidor detecta este evento, revisa el tipo de operación a realizar en el objeto JSON y actúa en consecuencia, realizando la operación deseada por el usuario con la información contenida en el mensaje, es decir, el usuario, el ID y el Funko. Cuando se complete la operación, se le enviará una respuesta al cliente con el resultado de la operación y, en caso de que sea necesario, la información que haya pedido. El funcionamiento de las operaciones es idéntico al de la práctica anterior, adaptándolo a la API asíncrona.
- *read_funko*: Este evento es un poco distinto al resto. Ya que no se pueden usar promesas, para rellenar el array de Funkos que será devuelto al usuario en la operación listar se debe usar propagación de eventos. Este evento se emite cada vez que se lee un fichero de una colección e incluye el objeto Funko contenido en este fichero. Este listener únicamente agrega el Funko a un array.
- *send_funkos*: Este evento se emite cuando se ha leído el último fichero de la colección de un usuario y el listener que lo detecta envía un mensaje con el array obtenido al cliente.
- *close*: Informa de que un cliente se ha desconectado.

Las respuestas del servidor son del tipo `ResponseType`, cuyos atributos son los siguientes:

- `type`: Tipo de operación realizada.
- `success`: Verdadero si la operación se pudo realizar, falso en caso contrario.
- `funkos`: Atributo opcional en el que se guardan los Funkos a enviar al cliente en caso de que sea necesario.

#### Cliente

El lado cliente del programa se encarga de la interacción con el usuario. Para comprobar como funciona lo primero que tenemos que revisar es la clase `MessageEventEmitterClient`. Esta clase recibe en el constructor la conexión al servidor y se encarga de recibir todos los eventos *data* con la información que este envíe. De igual manera que en el servidor, cuando encuentra un salto de línea interpreta que la información está completa y emite un evento *message* que el programa se encargará de procesar.

El funcionamiento del cliente es muy sencillo gracias al paquete `yargs`, que se encarga de gestionar los argumentos que le llegan al programa. De forma similar a la práctica anterior, la aplicación recoge los parámetros del comando seleccionado, pero esta vez en lugar de realizar la operación, envía la información al servidor que se encarga de procesarla. Estos mensajes son del tipo `RequestType`, que posee los siguientes atributos:

- `type`: Tipo de operación realizada.
- `user`: Usuario que ejecutó el comando.
- `id`: Atributo opcional para el ID del Funko.
- `funko`: Atributo opcional para el Funko con el que realizar la operación.

Una vez enviado el mensaje y respondido por parte del servidor, el cliente procesa la respuesta gracias al listener del evento *message* que tratamos previamente, que muestra por consola al usuario el resultado de la operación.

### Ejercicio PE 103

El ejercicio de la sesión de prácticas trata del desarrollo de una conexión cliente-servidor en la que el cliente envía un comando al servidor, este lo ejecuta y envía su resultado al cliente.

#### Servidor

El lado servidor se encarga de ejecutar el comando recibido. Para esto, con cada conexión, el servidor inicia listeners para varios eventos:

- *data*: Cuando llega información en la conexión la añade a una cadena. Cuando encuentra un salto de línea, interpreta que la información está completa y emite un evento *request* junto a la información obtenida en formato JSON.
- *request*: Cuando el servidor detecta este evento, forma el comando a ejecutar con la información obtenida del cliente y lo ejecuta. En caso de error se lo comunica al cliente y si el comando se logra ejecutar se le envía la información resultado de la ejecución al cliente.
- *close*: Informa de que un cliente se ha desconectado.

Las respuestas del servidor son del tipo `ResponseType`, cuyos atributos son los siguientes:

- `success`: Verdadero si el comando se ejecutó con éxito, falso en caso contrario.
- `result`: Atributo opcional con el resultado de la ejecución.

#### Cliente

El lado cliente del programa se encarga de la interacción con el usuario. Este funciona, al igual que el cliente del ejercicio anterior, gracias a la clase  `MessageEventEmitterClient` explicada anteriormente. 

El cliente recoge de la la terminal el comando a ejecutar y los argumentos a utilizar y se los envía al servidor en un mensaje del tipo `RequestType`, que posee los siguientes atributos:

- `command`: Comando a ejecutar.
- `args`: Argumentos para ejecutar el comando.

Una vez enviado el mensaje y respondido por parte del servidor, el cliente procesa la respuesta gracias al listener del evento *message*, que muestra por consola al usuario el resultado de la operación.

## Conclusión

En esta práctica hemos tratado el uso un gran número de funcionalidades proporcionadas por el entorno asíncrono de Node, como el uso de sockets, ejecución de comandos y gestión de ficheros manera asíncrona. De esta manera, comenzamos a introducir una nueva manera de programar que introduce bastantes cambios respecto a la programación síncrona a la que estamos acostumbrados.

## Bibliografía

- [Desarrollo de Sistemas Informáticos - Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js](https://ull-esit-inf-dsi-2223.github.io/prct10-fs-proc-sockets-funko-app/)
- [Desarrollo de Sistemas Informáticos - Node.js](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)
- [Node.js fs documentation](https://nodejs.org/docs/latest-v19.x/api/fs.html)
- [JavaScript Visualized: Event Loop](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)
- [yargs documentation](https://yargs.js.org/docs/)