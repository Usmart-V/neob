exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }
  return {
    statusCode: 200,
    body: 'Función de prueba recibida!'
  };
};
