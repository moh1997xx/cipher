import React from "react";
import { Button as ButtonUi } from "@ui-kitten/components";
import { Icon } from "react-native-elements";
import { Text } from "react-native";
import { useAction, useCustomProps } from "../Hook";

export const Button = ({ onPressAction, title, navigateTo, ...props }) => {
  const handleAction = useAction({ navigateTo });
  const { onPress, disabled } = useCustomProps();

  const {
    style: { fontSize, color, ...restStyle },
    icon,
    ...restProps
  } = props;

  let fontStyle = { fontSize };

  if (color) {
    fontStyle["color"] = color;
  }

  const handleOnPress = () => {
    if (onPress) onPress();
    if (Array.isArray(onPressAction) && onPressAction.length) {
      onPressAction.forEach((action) => {
        handleAction(action);
      });
    }
  };

  return (
    <ButtonUi
      {...restProps}
      style={restStyle}
      onPress={handleOnPress}
      disabled={disabled}
      {...(icon?.name
        ? {
            // eslint-disable-next-line react/display-name
            accessoryLeft: () => (
              <Icon
                containerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 4,
                }}
                name={icon.name}
                type={icon.provider}
                size={icon.size || 24}
                color={icon.color || "#FFF"}
              />
            ),
          }
        : null)}
    >
      <Text style={fontStyle}>{title}</Text>
    </ButtonUi>
  );
};
