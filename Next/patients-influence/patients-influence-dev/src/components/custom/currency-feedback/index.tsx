import React, { useCallback, useEffect, useState } from 'react';
import { InfoIcon } from 'components/svg';
import { TNote } from 'components/custom/currency-feedback/types';
import {
  NoteMain,
  NoteText,
  HighlightText,
} from 'components/custom/currency-feedback/style';
import { useAppContext } from 'context';
import { Convert } from 'easy-currencies';

const CurrencyFeedback = ({ value, ...props }: TNote) => {
  const { currency } = useAppContext();

  const [euroValue, setEuroValue] = useState(0);
  const [usdValue, setUsdValue] = useState(0);

  const handleCurrency = useCallback(async () => {
    if (currency === 'EUR') {
      const convert = await Convert(value).from('CHF').to('EUR');

      setEuroValue(convert);
    }

    if (currency === 'USD') {
      const convert = await Convert(value).from('CHF').to('USD');

      setUsdValue(convert);
    }
  }, [currency, value]);

  useEffect(() => {
    handleCurrency();
  }, [value, currency]);

  return (
    <NoteMain {...props}>
      {currency === 'EUR' && parseInt(value, 10) > 0 ? (
        <>
          <InfoIcon />
          <NoteText>
            Approximatelay
            <HighlightText> {euroValue} EUR</HighlightText>.
          </NoteText>
        </>
      ) : null}
      {currency === 'USD' && parseInt(value, 10) > 0 ? (
        <>
          <InfoIcon />
          <NoteText>
            Approximatelay
            <HighlightText> {usdValue} USD</HighlightText>.
          </NoteText>
        </>
      ) : null}
    </NoteMain>
  );
};

export default CurrencyFeedback;
