import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIExplanation = async (topic: string, context: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Anda adalah dosen ahli Teknik Tegangan Tinggi.
      Jelaskan konsep berikut secara ringkas, padat, dan mudah dimengerti (maksimal 100 kata):
      Topik: ${topic}
      Konteks Teknis: ${context}
      
      Gunakan Bahasa Indonesia yang formal namun mudah dipahami mahasiswa teknik.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Maaf, tidak dapat menghasilkan penjelasan saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
};

export const generateQuizHint = async (question: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Berikan petunjuk (hint) singkat untuk menjawab pertanyaan kuis berikut tanpa memberitahu jawaban langsungnya.
      Pertanyaan: "${question}"
      Bahasa: Indonesia
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Tidak ada petunjuk tersedia.";
  } catch (error) {
    return "Gagal memuat petunjuk.";
  }
};