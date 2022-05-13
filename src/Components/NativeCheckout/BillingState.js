import React from "react";
import { Autocomplete, AutocompleteItem } from "@ui-kitten/components";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { wooCountry, wooBillingData } from "../../Hook";

const filter = (item, query) =>
  item?.name?.toLowerCase().includes(query?.toLowerCase());

export const BillingState = ({ label }) => {
  const [{ name: stateName }, setState] = React.useState({
    name: null,
    code: "",
  });
  const { states } = useRecoilValue(wooCountry);
  const setBillingData = useSetRecoilState(wooBillingData);

  const dataState = stateName
    ? states?.filter((item) => filter(item, stateName))
    : states;

  const onSelectState = (index) => {
    setState(dataState[index]);
    setBillingData((data) => ({ ...data, state: dataState[index]?.code }));
  };

  const onChangeState = (name) => {
    setState((state) => ({ ...state, name }));
  };

  const renderOption = (item) => (
    <AutocompleteItem key={item.code} title={item.name} />
  );

  return (
    <Autocomplete
      style={{ marginTop: 8 }}
      label={label}
      value={stateName}
      onSelect={onSelectState}
      onChangeText={onChangeState}
    >
      {dataState?.map(renderOption)}
    </Autocomplete>
  );
};
