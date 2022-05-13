import React from "react";
import { FlatList, View } from "react-native";
import {
  PostRoot,
  ProductRoot,
  OrderRoot,
  ItemProvider,
  useGetOrderData,
  useGetProductData,
  useGetPostData,
} from "../Hook";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import { getSeparatedStyle } from "../Utility";
import { Container, Image } from "../Components";

const buildPlaceholder = (children) => {
  if (!children) return null;
  return React.Children.map(children, (element) => {
    let { children, style } = element.props;
    if (
      element.type.name === "Container" &&
      style.flexDirection === "row" &&
      Array.isArray(children) &&
      children.length > 1 &&
      children[0].type !== Image &&
      children[0].type !== Container
    ) {
      children = children[0];
    }

    const child = buildPlaceholder(children);

    let component = PlaceholderLine;
    if (element.type === Image) component = PlaceholderMedia;
    if (element.type === Container) component = View;

    const { containerStyle } = getSeparatedStyle(style);

    style =
      element.type === Container ? style : { width: "80%", ...containerStyle };

    if (element.type === Image && element.props.placeholder === "circle") {
      style = { ...style, borderRadius: 1000 };
    }

    return React.createElement(component, { style }, child);
  });
};

const halfColumnStyle = { flex: 0.5, marginHorizontal: 8 };

function PostPlaceholder({ children, ...props }) {
  const content = buildPlaceholder(children);
  const { numColumns } = props;
  const isHorizontal = props?.horizontal;

  const flexDirection = isHorizontal ? "row" : "column";
  if (numColumns > 1 && !isHorizontal) {
    return (
      <View style={{ flexDirection }}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={halfColumnStyle}>
            <Placeholder Animation={Fade}>{content}</Placeholder>
          </View>
          <View style={halfColumnStyle}>
            <Placeholder Animation={Fade}>{content}</Placeholder>
          </View>
        </View>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={halfColumnStyle}>
            <Placeholder Animation={Fade}>{content}</Placeholder>
          </View>
          <View style={halfColumnStyle}>
            <Placeholder Animation={Fade}>{content}</Placeholder>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flexDirection }}>
      <Placeholder Animation={Fade} style={{ width: "auto" }}>
        {content}
      </Placeholder>
      <Placeholder Animation={Fade} style={{ width: "auto" }}>
        {content}
      </Placeholder>
      <Placeholder Animation={Fade} style={{ width: "auto" }}>
        {content}
      </Placeholder>
      <Placeholder Animation={Fade} style={{ width: "auto" }}>
        {content}
      </Placeholder>
    </View>
  );
}

const FlatlistItem = ({ item, numColumns, horizontal, children }) => {
  const width = "100%";
  if (numColumns > 1 && !horizontal) {
    return (
      <View style={{ flex: 0.5, marginHorizontal: 8 }}>
        <ItemProvider value={item}>
          {React.Children.map(children, (element) =>
            React.cloneElement(element, {
              style: { ...element.props.style, width },
            })
          )}
        </ItemProvider>
      </View>
    );
  }

  return <ItemProvider value={item}>{children}</ItemProvider>;
};

export const FlatListComp = ({ data, children, ...props }) => {
  const { numColumns, ...horizontalProps } = props;
  const { showsHorizontalScrollIndicator, ...verticalProps } = props;
  const isHorizontal = props?.horizontal;
  const flatListProps = isHorizontal ? horizontalProps : verticalProps;

  if (!data) {
    return <PostPlaceholder {...props}>{children}</PostPlaceholder>;
  }

  return (
    !!data?.length &&
    Array.isArray(data) && (
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString()}
        {...(numColumns > 1 &&
          !isHorizontal && {
            columnWrapperStyle: { flex: 1, justifyContent: "space-between" },
          })}
        {...flatListProps}
        renderItem={({ item }) => (
          <FlatlistItem item={item} {...props}>
            {children}
          </FlatlistItem>
        )}
      />
    )
  );
};

const OrderList = ({ orderQuery, postType, ...props }) => {
  const { data } = useGetOrderData();

  return (
    <OrderRoot query={orderQuery}>
      <FlatListComp data={data} postType={postType} {...props} />
    </OrderRoot>
  );
};

const ProductList = ({ productQuery, postType, ...props }) => {
  const { data } = useGetProductData(productQuery);

  return (
    <ProductRoot query={productQuery}>
      <FlatListComp data={data} postType={postType} {...props} />
    </ProductRoot>
  );
};

const PostList = ({ postQuery, postType, ...props }) => {
  const { data } = useGetPostData(postQuery, postType);

  return (
    <PostRoot query={postQuery} postType={postType}>
      <FlatListComp data={data} postType={postType} {...props} />
    </PostRoot>
  );
};

export const GridPost = ({ style, ...props }) => {
  const postType = props?.postType;

  let List = PostList;
  switch (postType) {
    case "product":
      List = ProductList;
      break;
    case "order":
      List = OrderList;
      break;

    default:
      List = PostList;
      break;
  }

  return (
    <View style={style}>
      <List {...props} />
    </View>
  );
};
