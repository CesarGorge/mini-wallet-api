### Pruebas con la Colección de Postman

Para facilitar las pruebas, se incluye una colección de Postman pre-configurada que automatiza el uso del token de autenticación.

1.  Abre Postman.
2.  Ve a **File > Import...** y selecciona los dos archivos JSON que se encuentran en la carpeta `/postman` de este repositorio. Esto importará la colección de endpoints y el entorno con las variables.
3.  En la esquina superior derecha de Postman, asegúrate de que el entorno importado (**"Wallet Local"**) esté seleccionado.
4.  Ejecuta la petición `POST /login` primero para obtener y guardar el token automáticamente.
5.  ¡Listo! Ya puedes ejecutar cualquier otra petición de la colección sin necesidad de copiar y pegar el token.