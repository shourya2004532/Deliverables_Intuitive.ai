import React, { useId } from 'react'

function InputBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectCurrency,
    amountDisable = false,
    currencyDisable = false,
    className = "",
}) {
   const amountInputId = useId()

    return (
        <div className={`bg-gray-100 p-4 rounded-lg flex items-center gap-4 ${className}`}>
            <div className="w-1/2">
                <label htmlFor={amountInputId} className="text-gray-500 mb-1 block text-sm font-semibold">
                    {label}
                </label>
                <input
                    id={amountInputId}
                    className="outline-none w-full bg-transparent py-1 text-xl font-bold text-gray-800"
                    type="number"
                    placeholder="0.00"
                    disabled={amountDisable}
                    value={amount === 0 ? "" : amount}
                    onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        onAmountChange && onAmountChange(val);
                    }}
                />
            </div>
            <div className="w-1/2 flex flex-col items-end">
                <p className="text-gray-500 mb-1 block text-sm font-semibold w-full text-right">Currency</p>
                <div className="flex items-center gap-2">
                    <img 
                        src={`https://flagsapi.com/${selectCurrency?.toUpperCase().slice(0, 2)}/flat/64.png`} 
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/24?text=?"
                        }}
                    />
                    <select
                        className="rounded-lg px-2 py-1 bg-white cursor-pointer outline-none font-bold text-gray-700 border border-gray-200"
                        value={selectCurrency}
                        onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
                        disabled={currencyDisable}
                    >
                        {currencyOptions.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default InputBox;
