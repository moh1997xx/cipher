import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Page from "../Page";
import { config } from "../../config";
import WooPayOrder from "../Page/WooPayOrder";
import BottomBar from "./BottomBar";

const Stack = createStackNavigator();

export default function Route() {
  const pages = config.pages;
  const firstBottomNav = pages?.find((page) => page?.addToBottomNav);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
        // headerMode="none"
      >
        {firstBottomNav && (
          <Stack.Screen
            name="BottomTab"
            options={{
              title: firstBottomNav.name,
              headerShown: firstBottomNav.showHeaderBar,
            }}
          >
            {(props) => <BottomBar {...props} pages={pages} />}
          </Stack.Screen>
        )}
        {Array.isArray(pages) &&
          pages
            .filter((page) => page.slug)
            .map((page) => (
              <Stack.Screen
                key={page.slug}
                name={page.slug}
                options={{
                  title: page.name,
                  headerShown: page.showHeaderBar,
                }}
              >
                {(props) => <Page {...props} page={page} />}
              </Stack.Screen>
            ))}
        <Stack.Screen
          name="payorder"
          options={{
            title: "Payment",
            headerShown: true,
          }}
        >
          {(props) => <WooPayOrder {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
