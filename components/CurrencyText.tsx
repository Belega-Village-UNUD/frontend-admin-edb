import React from 'react';

interface CurrencyTextProps {
  amount: number;
  className?: string;
}

const CurrencyText: React.FC<CurrencyTextProps> = ({ amount, className }) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  return <span className={className}>{formatter.format(amount)}</span>;
};

export default CurrencyText;

/* <CurrencyText amount={amount} className="className" /> */ 