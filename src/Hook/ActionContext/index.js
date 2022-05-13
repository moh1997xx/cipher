import React from "react";
import { useCart } from "../Cart";
import { useForm } from "../Form";
import { useItem } from "../PostContent";
import { useNavigation } from "@react-navigation/native";

const ActionContext = React.createContext();

function ActionProvider({ value, children }) {
  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
}

function useAction({ navigateTo = "" }) {
  const navigation = useNavigation();
  const form = useForm();
  const item = useItem();
  const { addCart, addQty, reduceQty } = useCart();

  const handleAction = (action) => {
    switch (action) {
      case "navigate":
        if (navigateTo) {
          if (item) {
            navigation.push(navigateTo, { item });
          } else {
            navigation.push(navigateTo);
          }
        }
        break;

      case "goBack":
        navigation.goBack();
        break;

      case "addToCart":
        addCart(item, 1);
        break;

      case "addQty":
        addQty(item?.id);
        break;

      case "reduceQty":
        reduceQty(item?.id);
        break;

      case "submit":
        if (form) form.handleSubmit();
        break;

      default:
        break;
    }
  };

  return handleAction;
}

export { ActionProvider, useAction };
