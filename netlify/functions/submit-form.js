const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    // Solo aceptamos POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Método no permitido" })
      };
    }

    // Extraer datos del body
    const { filename, content } = JSON.parse(event.body || "{}");
    if (!filename || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan parámetros: filename o content" })
      };
    }

    // Autenticación con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/drive.file"]
    });

    const drive = google.drive({ version: "v3", auth });

    // Metadatos del archivo
    const fileMetadata = {
      name: filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };

    // El contenido lo pasamos como Buffer (texto)
    const media = {
      mimeType: "text/plain",
      body: Buffer.from(content, "utf-8")
    };

    // Crear archivo en Drive
    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, name"
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Archivo subido con éxito",
        file: file.data
      })
    };

  } catch (error) {
    console.error("Error al subir a Drive:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Error interno", details: error.message })
    };
  }
};
