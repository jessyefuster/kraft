export const truncateListWithSummary = (items: string[], maxShownCount = 3) => {
  if (items.length <= maxShownCount)
    return items.join(', ');

  return items.slice(0, maxShownCount).join(', ') + ` et ${items.length - maxShownCount} autre(s)`;
};
