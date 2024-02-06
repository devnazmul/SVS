export const buildHierarchy = (data, parentId = null) => {
  const result = [];

  data
    .filter((item) => item.parent_id === parentId)
    .forEach((item) => {
      const children = buildHierarchy(data, item.id);

      const node = {
        name: item.name,
        pathProps: {}, // Add your pathProps if needed
        textProps: { x: -25, y: 25 }, // Add your textProps if needed
        children: children.length > 0 ? children : undefined,
      };

      result.push(node);
    });

  return result;
};
