import { ConvertStringToSlug } from "../utils/StringToSlug.js";

const createNew = async (data) => {
  try {
    const newBoard = {
      ...data,
      slug: ConvertStringToSlug(data.title),
    };

    return newBoard;
  } catch (error) {
    throw error;
  }
};
export const boardService = {
  createNew,
};
