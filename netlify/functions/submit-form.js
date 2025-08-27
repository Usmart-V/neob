const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Método no permitido" };
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/drive"]
    });

    const drive = google.drive({ version: "v3", auth });

    // Esta llamada solo sirve para verificar que podemos conectar a la API.
    await drive.about.get({ fields: "user" });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Conexión a Google Drive exitosa" })
    };
  } catch (error) {
    console.error("Error de conexión a Drive:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno", details: error.message })
    };
  }
};
