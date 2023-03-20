# December Labs (Bank API)

_Proyecto realizado en NodeJs y se utilizo una base de datos MongoDB_

## Intalación:

> Para correr el proyecto en necesario tener instalados Node y mongoDb

Iniciar el proyecto:

```sh
npm i
npm run start
```

Para correr las migraciones e insertar la data inicial

```sh
npm run migrate up
```

Iniciar el scheduler para completar la info de conversion de las monedas:

```sh
npm run start:scheduler
```

> NOTA: Luego importar las colecciones en postman (tiene variables de ambiente para no tener que setear token a mano tanto de admin como de cliente);
> Primero siempre correr el login y tener en cuenta que el token expira en 1 hora

### Mejoras a nivel negocio:

- En el caso de ser necesario, adaptar la periodicidad del cron que consulta las conversiones entre monedas para ser mas preciso
- Crear tipos de persona para personas juridicas y poder asociarle distinta información
- Crear tipos de cuenta (CA, CC) y el descubierto por tipo de cuenta/cliente
- Implementar permisos asociados a los roles (Ej: create.accounts) para complejizar los accesos a los endpoints
- Crear a nivel negocio una cuenta de propiedad del banco en la cual se depositarian todos los importes de comisiones por transferencias entre cuentas de distintos usuarios

### Mejoras a nivel tecnico:

- Encapsular algunos comportamientos (como el de cobrar la comision)
- Implementar paginado para las consultas de transferencias
- Implementar casos de prueba
- Implementar Typescript para hacer mas controlado el desarrollo y evitar errores de tipos

**By Gaston Ariel Larriera**
