"use client";

import { useCallback } from "react";
import { BotData, UploadedFile } from "@/lib/types";
import mammoth from "mammoth";

export interface UseBotFileUploadOptions {
  botData: BotData;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
  setError: (error: string | null) => void;
}

export interface UseBotFileUploadReturn {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeFile: (fileId: string) => void;
  isValidFileType: (file: File) => boolean;
}

export function useBotFileUpload({
  setBotData,
  setError,
}: Omit<UseBotFileUploadOptions, "botData">): UseBotFileUploadReturn {
  const isValidFileType = useCallback((file: File): boolean => {
    const validTypes = [
      "text/plain",
      "text/markdown",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return (
      validTypes.includes(file.type) ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx")
    );
  }, []);

  const extractTextFromFile = useCallback(
    async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const content = e.target?.result;
            if (!content) {
              reject(new Error("Failed to read file content"));
              return;
            }

            if (
              file.type === "application/msword" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              // Handle Word documents
              const result = await mammoth.extractRawText({
                arrayBuffer: content as ArrayBuffer,
              });
              resolve(result.value);
            } else {
              // Handle text files
              resolve(content as string);
            }
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));

        if (
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      });
    },
    []
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      for (const file of Array.from(files)) {
        if (!isValidFileType(file)) {
          setError(
            `Invalid file type: ${file.name}. Please upload .txt, .md, .doc, or .docx files.`
          );
          continue;
        }

        try {
          const content = await extractTextFromFile(file);
          const uploadedFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            content,
            size: file.size,
          };

          setBotData((prev: BotData) => ({
            ...prev,
            files: [...prev.files, uploadedFile],
          }));
        } catch (err) {
          setError(
            `Error processing file ${file.name}: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      }
    },
    [isValidFileType, extractTextFromFile, setBotData, setError]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      setBotData((prev: BotData) => {
        const fileToRemove = prev.files.find((f) => f.id === fileId);
        if (!fileToRemove) return prev;

        const updatedFiles = prev.files.filter((f) => f.id !== fileId);

        return {
          ...prev,
          files: updatedFiles,
        };
      });
    },
    [setBotData]
  );

  return {
    handleFileUpload,
    removeFile,
    isValidFileType,
  };
}

