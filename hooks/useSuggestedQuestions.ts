import { useCallback } from "react";
import { SuggestedQuestion } from "@/lib/types";

export interface UseSuggestedQuestionsOptions {
  suggestedQuestions: SuggestedQuestion[];
  setSuggestedQuestions: (questions: SuggestedQuestion[]) => void;
  maxQuestions?: number;
}

export interface UseSuggestedQuestionsReturn {
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  updateQuestion: (index: number, field: "question" | "answer", value: string) => void;
  canAddMore: boolean;
}

export function useSuggestedQuestions(
  options: UseSuggestedQuestionsOptions
): UseSuggestedQuestionsReturn {
  const {
    suggestedQuestions,
    setSuggestedQuestions,
    maxQuestions = 3,
  } = options;

  const addQuestion = useCallback(() => {
    if (suggestedQuestions.length < maxQuestions) {
      setSuggestedQuestions([
        ...suggestedQuestions,
        { question: "", answer: "" },
      ]);
    }
  }, [suggestedQuestions, setSuggestedQuestions, maxQuestions]);

  const removeQuestion = useCallback(
    (index: number) => {
      setSuggestedQuestions(suggestedQuestions.filter((_, i) => i !== index));
    },
    [suggestedQuestions, setSuggestedQuestions]
  );

  const updateQuestion = useCallback(
    (index: number, field: "question" | "answer", value: string) => {
      const updated = [...suggestedQuestions];
      updated[index] = { ...updated[index], [field]: value };
      setSuggestedQuestions(updated);
    },
    [suggestedQuestions, setSuggestedQuestions]
  );

  const canAddMore = suggestedQuestions.length < maxQuestions;

  return {
    addQuestion,
    removeQuestion,
    updateQuestion,
    canAddMore,
  };
}

