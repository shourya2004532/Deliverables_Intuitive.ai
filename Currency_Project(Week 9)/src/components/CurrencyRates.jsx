import React from 'react'

function CurrencyRates({rates, fromCurrency, baseAmount}) {
    if (!rates) return null;

    const currencies = ['USD', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', 'CNY'];

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 mb-10 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Current Exchange Rates for  {baseAmount} {fromCurrency}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currencies.map(curr => {
                    if (curr.toLowerCase() === fromCurrency.toLowerCase()) return null;
                    const rate = rates[curr] || rates[curr.toLowerCase()];
                    if (!rate) return null;
                    
                    return (
                        <div key={curr} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                            <div className="flex items-center gap-2">
                                <img 
                                    src={`https://flagsapi.com/${curr.toUpperCase().slice(0, 2)}/flat/64.png`} 
                                    className="w-5 h-5 object-contain"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/32?text=?"
                                    }}
                                />
                                <span className="font-bold text-gray-700">{curr}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-indigo-600">
                                    {(baseAmount * rate).toFixed(3)}
                                </p>
                                
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CurrencyRates
