import React from "react";
import { Icon as IconUi } from "react-native-elements";
import { useAction } from "../Hook";

export const Icon = ({ onPressAction, navigateTo, ...props }) => {
  const handleAction = useAction({ navigateTo });

  const { style, icon, ...restProps } = props;

  const handleOnPress = () => {
    if (Array.isArray(onPressAction) && onPressAction.length) {
      onPressAction.forEach((action) => {
        handleAction(action);
      });
    }
  };

  return (
    <IconUi
      onPress={handleOnPress}
      containerStyle={{
        ...style,
        justifyContent: "center",
        alignItems: "center",
      }}
      name={icon.name}
      type={icon.provider}
      size={icon.size}
      color={icon.color}
      {...restProps}
    />
  );
};
