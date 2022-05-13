import React from "react";
import { Autocomplete, AutocompleteItem } from "@ui-kitten/components";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useBillingCountry, wooCountry, wooBillingData } from "../../Hook";

const filter = (item, query) =>
  item?.name?.toLowerCase().includes(query?.toLowerCase());

const BillingCountry = ({ label }) => {
  const { countries, isLoading: isCountryLoading } = useBillingCountry();
  const [{ name: countryName }, setCountry] = useRecoilState(wooCountry);
  const setBillingData = useSetRecoilState(wooBillingData);

  const dataCountry = React.useMemo(
    () =>
      countryName
        ? countries?.filter((item) => filter(item, countryName))
        : countries,
    [countries, countryName]
  );

  const onSelectCountry = (index) => {
    setCountry(dataCountry[index]);
    setBillingData((data) => ({ ...data, country: dataCountry[index]?.code }));
  };

  const onChangeCountry = (name) => {
    setCountry((country) => ({ ...country, name }));
  };

  const renderOption = (item) => (
    <AutocompleteItem key={item.code} title={item.name} />
  );

  return (
    <Autocomplete
      style={{ marginTop: 8 }}
      label={label}
      disabled={isCountryLoading}
      value={countryName}
      onSelect={onSelectCountry}
      onChangeText={onChangeCountry}
    >
      {dataCountry?.map(renderOption)}
    </Autocomplete>
  );
};

export default React.memo(BillingCountry);
