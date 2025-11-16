export const sortCardsByOrder = (cardOrderIds, cards) => {
  // Tạo map để truy cập card theo id nhanh hơn
  const cardMap = new Map();
  cards.forEach((card) => cardMap.set(card._id.toString(), card));

  // Trả về mảng cards được sắp theo đúng thứ tự trong cardOrderIds
  return cardOrderIds.map((id) => cardMap.get(id.toString()));
};
export const sortColumnsByOrder = (columnOrderIds, columns) => {
  // Tạo map để truy cập card theo id nhanh hơn
  const columnMap = new Map();
  columns.forEach((column) => columnMap.set(column._id.toString(), column));

  // Trả về mảng columns được sắp theo đúng thứ tự trong columnOrderIds
  return columnOrderIds.map((id) => columnMap.get(id.toString()));
};
