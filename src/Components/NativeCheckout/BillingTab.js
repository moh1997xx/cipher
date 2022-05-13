import React from "react";
import { View } from "react-native";
import { Input, Text } from "@ui-kitten/components";
import { useRecoilState } from "recoil";
import BillingCountry from "./BillingCountry";
import { BillingState } from "./BillingState";
import { wooBillingData } from "../../Hook";
import NoBillingCountry from "./NoBillingCountry";

const components = {
  Input,
  BillingCountry,
  BillingState,
};

export const BillingTab = ({ fields, billingTitle }) => {
  const [billingData, setBillingData] = useRecoilState(wooBillingData);
  const handleSetBillingData = (key, value) => {
    setBillingData((data) => ({ ...data, [key]: value }));
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text category="h4">{billingTitle ?? "Billing Information"}</Text>
      {Object.keys(fields)
        .filter((key) => fields[key]?.enable)
        .sort((a, b) => fields[a].priority - fields[b].priority)
        .map((key) => {
          const field = fields[key];
          const Field = components[field.type];
          if (field.type === "Input") {
            return (
              <Field
                key={key}
                style={{ marginTop: 8 }}
                label={field.label}
                value={billingData?.[field.name]}
                onChangeText={(value) =>
                  handleSetBillingData(field.name, value)
                }
              />
            );
          }
          return <Field key={key} label={field.label} />;
        })}
      {!fields.country.enable && <NoBillingCountry />}
    </View>
  );
};
