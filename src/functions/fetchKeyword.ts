interface KeywordParams {
  keyword: string;
  topic?: string;
}

export const findKeywords = async (opts: KeywordParams) => {
  const queryParams = new URLSearchParams({
    ml: opts.keyword,
    ...(opts.topic && { topics: opts.topic }),
  }).toString();

  try {
    const response = await fetch(
      `https://api.datamuse.com/words?${queryParams}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: any = await response.json();
    return data
      .map((item: { word: string }) => item.word)
      .slice(0, Math.min(data.length, 10));
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return [];
  }
};
