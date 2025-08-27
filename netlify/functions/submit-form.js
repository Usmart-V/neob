exports.handler = async (event) => {
  console.log("¡La función ha sido llamada!");

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "La llamada fue exitosa" }),
  };
};
