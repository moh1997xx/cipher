/* eslint-disable react/display-name */
import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import Page from "../Page";

function getOptions(route, pages) {
  const routeName = getFocusedRouteNameFromRoute(route);
  const index = pages.findIndex(
    (page) => page.slug === routeName?.replace("tab-", "")
  );

  if (index === -1) return false;

  let title = pages[index]?.name || "";

  if (pages[index]?.dynamicTitle) {
    const params = route.params;
    title = params?.item?.title?.rendered ?? params?.item?.name;
  }

  const headerShown = pages?.[index]?.showHeaderBar;
  return { title, headerShown };
}

const Tab = createBottomTabNavigator();

function DefaultTab({ children, pages }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const index = pages.findIndex(
            (page) => page.slug === route.name.replace("tab-", "")
          );
          const icon = pages?.[index]?.icon;
          const { name, provider, size, activeColor, inactiveColor } = icon;
          return (
            <Icon
              name={name}
              type={provider}
              size={size}
              color={focused ? activeColor : inactiveColor}
            />
          );
        },
        tabBarLabel: "",
      })}
    >
      {children}
    </Tab.Navigator>
  );
}

export default function BottomBar({ navigation, route, pages }) {
  React.useLayoutEffect(() => {
    const options = getOptions(route, pages);
    navigation.setOptions({ ...options });
  }, [navigation, route, pages]);

  const bottomNavPages = pages
    .filter((page) => page?.addToBottomNav)
    .sort((a, b) => a.navPriority - b.navPriority);

  return (
    <DefaultTab pages={pages}>
      {Array.isArray(bottomNavPages) &&
        bottomNavPages.map((page) => {
          return (
            <Tab.Screen
              key={page.slug}
              name={`tab-${page.slug}`}
              options={{
                title: page.name,
                headerShown: page.showHeaderBar,
              }}
            >
              {(props) => <Page {...props} page={page} />}
            </Tab.Screen>
          );
        })}
    </DefaultTab>
  );
}
