import React from "react";
import * as components from "../Components";

const buildChild = (id, page) => {
  let child = page[id]?.nodes?.length
    ? page[id].nodes.map((node) => {
        return buildComponent(node, page);
      })
    : typeof page[id].linkedNodes === "object" &&
      Object.values(page[id].linkedNodes)?.length
    ? Object.values(page[id].linkedNodes).map((node) => {
        return buildComponent(node, page);
      })
    : null;

  return child;
};

const buildComponent = (id, page) => {
  let child = buildChild(id, page);
  let props =
    id === "ROOT"
      ? { isRoot: true, key: id, ...page[id].props }
      : { key: id, ...page[id].props };

  return (
    components[page[id]?.type?.resolvedName] &&
    React.createElement(components[page[id].type.resolvedName], props, child)
  );
};

const Page = ({ navigation, route, page }) => {
  const json = page?.json;
  const dataJson = json && (typeof json === "string" ? JSON.parse(json) : json);
  const params = route.params;
  const title = params?.item?.title?.rendered ?? params?.item?.name;
  const isDynamicTitle = page?.dynamicTitle;

  React.useLayoutEffect(() => {
    if (title && isDynamicTitle) {
      navigation.setOptions({ title });
    }
  }, [navigation, title, isDynamicTitle]);

  return dataJson ? buildComponent("ROOT", dataJson) : null;
};

export default React.memo(Page);
