const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Método no permitido" })
      };
    }

    const { filename, content } = JSON.parse(event.body || "{}");
    if (!filename || !content) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Faltan parámetros: filename o content" })
      };
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/drive"]
    });

    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };

    const media = {
      mimeType: "text/plain",
      body: content
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
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
