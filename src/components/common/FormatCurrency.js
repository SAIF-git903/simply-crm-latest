import store from '../../store';

export function formatCurrency(value) {
  const userData = store.getState()?.UserReducer?.userData;

  let decimalSeparator = userData?.currency_decimal_separator;
  let groupingSeparator = userData?.currency_grouping_separator;
  // Convert the value to a number
  let numberValue = parseFloat(value.toString().replace(/,/g, ''));
  if (isNaN(numberValue)) return 'Invalid amount';

  // Format the number
  let formattedNumber = numberValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Replace separators if they are different from the default (US format)
  if (decimalSeparator !== '.' || groupingSeparator !== ',') {
    formattedNumber = formattedNumber
      .replace('.', '[DECIMAL]') // Temporarily replace decimal
      .replace(/,/g, groupingSeparator) // Replace grouping separator
      .replace('[DECIMAL]', decimalSeparator); // Restore decimal
  }

  return formattedNumber ? formattedNumber : '';
}
