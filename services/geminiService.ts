
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "거래 내역을 입력하면 AI의 맞춤형 분석을 받을 수 있습니다.";

  const dataSummary = transactions.map(t => `${t.date}: ${t.type === 'INCOME' ? '+' : '-'}${t.amount} (${t.category} - ${t.description})`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음은 한 달간의 가계부 내역입니다. 이 데이터를 분석하여 소비 습관에 대한 조언과 다음 달 예산 계획을 3줄 이내로 한국어로 제안해주세요.\n\n${dataSummary}`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "분석 결과를 가져올 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 분석 중 오류가 발생했습니다.";
  }
};
