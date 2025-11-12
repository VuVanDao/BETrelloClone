const createNew = async (data) => {
  try {
    console.log("🚀 ~ createNew ~ data:", data);
    return data;
  } catch (error) {
    throw error;
  }
};
export const boardService = {
  createNew,
};
