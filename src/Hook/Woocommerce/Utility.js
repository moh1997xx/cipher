import { wooapi } from "../../Api";
import { useSWRCache } from "../Cache";

async function fetchData(url) {
  const response = await wooapi.get(url);
  return response?.data;
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  decimalCount = Math.abs(decimalCount);
  decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

  const negativeSign = amount < 0 ? "-" : "";

  let i = parseInt(
    (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
  ).toString();
  let j = i.length > 3 ? i.length % 3 : 0;

  return (
    negativeSign +
    (j ? i.substr(0, j) + thousands : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
    (decimalCount
      ? decimal +
        Math.abs(amount - i)
          .toFixed(decimalCount)
          .slice(2)
      : "")
  );
}

function convertSymbolsFromCode(name = "") {
  let final = null;
  if (name) {
    const val = name.match(/&#\d+;/) ? name.match(/&#\d+;/)[0] : false; // need to check whether it is an actual symbol code
    if (val) {
      const num = val.match(/\d+;/) ? val.match(/\d+;/)[0] : false; // if symbol, then get numeric code
      if (num) {
        final = num.replace(/;/g, "");
      }
    }
    if (final) {
      name = name.replace(/&#\d+;/g, String.fromCharCode(final));
    }
  }
  return name;
}

export function useWooSettings() {
  return useSWRCache("settings/general", fetchData);
}

export function useWooPriceFormat(amount) {
  const settings = useWooSettings();

  const currencyLabel = settings?.find(
    (item) => item.id === "woocommerce_currency"
  );

  const currencyPos = settings?.find(
    (item) => item.id === "woocommerce_currency_pos"
  )?.value;

  const thousandSep = settings?.find(
    (item) => item.id === "woocommerce_price_thousand_sep"
  )?.value;

  const decimalSep = settings?.find(
    (item) => item.id === "woocommerce_price_decimal_sep"
  )?.value;

  const decimalNum = settings?.find(
    (item) => item.id === "woocommerce_price_num_decimals"
  )?.value;

  const currency = convertSymbolsFromCode(
    currencyLabel?.options?.[currencyLabel?.value]?.match(
      /\(([^)]*)\)[^(]*$/
    )?.[1]
  );

  const price = formatMoney(amount, decimalNum, decimalSep, thousandSep);

  switch (currencyPos) {
    case "left_space":
      return [currency, ` ${price}`];
    case "right":
      return [price, currency];
    case "right_space":
      return [`${price} `, currency];
    default:
      return [currency, price];
  }
}
