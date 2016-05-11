# LauDriveAPP

a [Ionicframework](http://ionicframework.com/) application

## Instalación

Para poder generar el APK de la aplicación es necesario que antes tenga instalado en su sistema
[ionicframework](http://ionicframework.com/getting-started/) y el SDK de [android](http://developer.android.com/sdk/index.html)

Posteriormente debera de instalar las dependencias de la aplicación usando los siguientes comandos

```bash
$ bower install
$ npm install
```

## Configuración

Antes de generar el APK es necesario que cambies la ruta del servidor donde se estará
comunicando el app. Esta configuración la podrás encontrar en el archivo **/www/js/constants.js**.

## Generación del APK

Si tienes correctamente instalado el SDK de Android, podrás generar el APK con el siguiente
comando:

```bash
$ ionic build android
```

Nota: El usuario administrativo por default es:

```bash
email: admin@correo.com
password: admin2016
```
