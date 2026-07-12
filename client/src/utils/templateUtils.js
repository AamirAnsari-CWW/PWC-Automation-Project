export const findBannerSizeById = (template, sizeId) => {
  return template?.sizeDetails?.find((size) => size.id === sizeId);
};

export const getTemplateDefaultSize = (template) => {
  return template?.sizeDetails?.[0];
};

export const parseBannerSize = (sizeId) => {
  const [width, height] = sizeId.split("x").map(Number);

  return {
    id: sizeId,
    label: `${width} x ${height}`,
    width,
    height,
  };
};
