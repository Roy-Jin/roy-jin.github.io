interface TranslateResponse {
  code: number;
  msg: string;
  data: {
    detectedLanguage?: {
      language: string;
      score: number;
    };
    translations: {
      text: string;
      to: string;
    }[];
  }[];
}

export async function translateTexts(
  texts: string[],
  to: string = "zh",
  apiUrl: string = "",
): Promise<string[]> {
  const validTexts = texts.map((t) => t || "");
  if (validTexts.length === 0) return [];

  const params = new URLSearchParams();
  params.set("to", to);
  validTexts.forEach((text) => params.append("text[]", text));

  try {
    const url = new URL(apiUrl);
    url.search = params.toString();
    const response = await fetch(
      url.href,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.warn("[translate] API request failed:", response.status);
      return validTexts;
    }

    const result: TranslateResponse = await response.json();

    if (result.code !== 200 || !Array.isArray(result.data)) {
      console.warn("[translate] API response error:", result.msg);
      return validTexts;
    }

    return result.data.map((item, index) => {
      const translated = item.translations?.[0]?.text;
      return translated || validTexts[index] || "";
    });
  } catch (e) {
    console.warn("[translate] fetch error:", e);
    return validTexts;
  }
}
