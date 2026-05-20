import axios from "axios";

const BASE = "https://api.github.com/gists";

// =============================
// 📥 LEER GIST
// =============================
export async function getGist(gistId, fileName = null) {
  try {
    const res = await axios.get(`${BASE}/${gistId}`, {
      headers: {
        Authorization: `token ${process.env.GIST_TOKEN}`
      }
    });

    let file;

    if (fileName) {
      file = res.data.files[fileName];

      if (!file) {
        console.warn(`⚠️ Archivo ${fileName} no existe en el gist`);
        return "{}";
      }

    } else {
      const firstFile = Object.keys(res.data.files)[0];
      file = res.data.files[firstFile];
    }

    return file.content;

  } catch (err) {
    console.error("❌ Error leyendo gist:", err.response?.data || err.message);
    return "{}";
  }
}

// =============================
// 💾 ACTUALIZAR GIST
// =============================
export async function updateGist(gistId, content, fileName = "data.json") {
  try {
    await axios.patch(`${BASE}/${gistId}`, {
      files: {
        [fileName]: {
          content: JSON.stringify(content, null, 2)
        }
      }
    }, {
      headers: {
        Authorization: `token ${process.env.GIST_TOKEN}`
      }
    });

  } catch (err) {
    console.error("❌ Error actualizando gist:", err.response?.data || err.message);
  }
}
