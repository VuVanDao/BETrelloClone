export const RemoveItemExistInArr = (arr, IdItemExist) => {
  // danh cho cac mang la object
  const checkContain = arr.find((item) => item?.Id?.toString() === IdItemExist);
  if (checkContain) {
    return arr.filter((item) => item?.Id?.toString() !== IdItemExist);
  } else {
    return arr;
  }
};
