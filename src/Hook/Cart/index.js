import React from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { ItemProvider } from "../PostContent";
import { PostTypeProvider } from "../PostTypeContext";

export const generalCart = atom({
  key: "generalCart",
  default: {
    items: [],
    priceField: "price",
  },
});

function useCart() {
  const [cart, setCart] = useRecoilState(generalCart);
  const items = cart.items;

  const addCart = (post, qty) => {
    const index = items.findIndex((item) => item?.id === post?.id);
    if (items?.length && index !== -1) {
      const newQty = parseInt(items[index].qty) + parseInt(qty);
      let newItems = items.map((item, id) => {
        if (id === index) {
          return { ...item, qty: newQty };
        }
        return item;
      });
      newItems[index].qty = newQty;
      setCart((cart) => ({ ...cart, items: newItems }));
    } else {
      const newItems = [...items, { ...post, qty }];
      setCart((cart) => ({ ...cart, items: newItems }));
    }
  };

  const addQty = (itemId) => {
    const index = items.findIndex((item) => item?.id === itemId);
    if (items?.length && index !== -1) {
      const newQty = parseInt(items[index].qty) + 1;
      let newItems = items.map((item, id) => {
        if (id === index) {
          return { ...item, qty: newQty };
        }
        return item;
      });
      setCart((cart) => ({ ...cart, items: newItems }));
    }
  };

  const reduceQty = (itemId) => {
    const index = items.findIndex((item) => item?.id === itemId);
    if (items?.length && index !== -1) {
      const newQty = items[index].qty > 0 ? parseInt(items[index].qty) - 1 : 0;

      if (newQty) {
        let newItems = items.map((item, id) => {
          if (id === index) {
            return { ...item, qty: newQty };
          }
          return item;
        });
        setCart((cart) => ({ ...cart, items: newItems }));
      } else {
        let newItems = items.filter((item, id) => id !== index);
        setCart((cart) => ({ ...cart, items: newItems }));
      }
    }
  };

  const resetCart = () => {
    setCart((cart) => ({ ...cart, items: [] }));
  };

  const priceField = cart.priceField;

  const total = items?.reduce(
    (total, item) => total + item?.qty * item?.[priceField],
    0
  );

  const cartItems = items?.map((item) => {
    return {
      ...item,
      subtotal: item.qty * item[priceField],
      image:
        item?.images?.[0]?.src ??
        item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      total,
    };
  });

  const refocusCartItems = () => {
    setCart(cart);
  };

  return {
    cart,
    cartItems,
    addCart,
    addQty,
    reduceQty,
    refocusCartItems,
    resetCart,
  };
}

function useCartReset() {
  const setCart = useSetRecoilState(generalCart);
  const resetCart = () => {
    setCart((cart) => ({ ...cart, items: [] }));
  };

  return resetCart;
}

function useCartTotal() {
  const cart = useRecoilValue(generalCart);
  const priceField = cart.priceField;

  const total = cart?.items?.reduce(
    (total, item) => total + item?.qty * item?.[priceField],
    0
  );

  if (total) return total;

  return 0;
}

function CartRoot({ children, postType = "" }) {
  const total = useCartTotal();
  const postTypeMemo = React.useMemo(() => [postType, "cartItem"], [postType]);
  const cartMemo = React.useMemo(() => ({ total }), [total]);

  return (
    <PostTypeProvider value={postTypeMemo}>
      <ItemProvider value={cartMemo}>{children}</ItemProvider>
    </PostTypeProvider>
  );
}

export { CartRoot, useCart, useCartTotal, useCartReset };
