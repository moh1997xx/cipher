const containerStyleProps = [
  "flex",
  "width",
  "height",
  "margin",
  "marginLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "position",
  "top",
  "right",
  "bottom",
  "left",
];

export function getSeparatedStyle(style) {
  let containerStyle = {};
  let componentStyle = style;
  containerStyleProps.forEach((key) => {
    if (key in style) {
      containerStyle[key] = style[key];
      let { [key]: removed, ...usedStyle } = componentStyle;
      componentStyle = usedStyle;
    }
  });

  return { containerStyle, componentStyle };
}
