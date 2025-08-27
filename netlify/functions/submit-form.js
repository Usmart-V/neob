exports.handler = async (event, context) => {
  console.log("🚀 La función se ejecutó, método:", event.httpMethod);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Función viva!" })
  };
};
