const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Método no permitido" }),
      };
    }

    // Parseamos el body recibido
    const body = JSON.parse(event.body || "{}");

    if (!body.filename || !body.fileContent) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Se requieren filename y fileContent" }),
      };
    }

    // Autenticación con Service Account
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Carpeta destino desde variable
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Subir archivo
    const res = await drive.files.create({
      requestBody: {
        name: body.filename,
        parents: [folderId],
      },
      media: {
        mimeType: body.mimeType || "application/octet-stream",
        body: Buffer.from(body.fileContent, "base64"),
      },
      fields: "id, name",
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Archivo subido con éxito",
        file: res.data,
      }),
    };
  } catch (err) {
    console.error("Error al subir a Drive:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Error interno", details: err.message }),
    };
  }
};
