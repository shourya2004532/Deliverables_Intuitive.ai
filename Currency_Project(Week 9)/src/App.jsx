import { useState } from 'react'
import { InputBox, CurrencyRates } from './components/index.js'
import useCurrencyInfo from './Hooks/usecurrencyinfo'

function App() {

  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("INR")
  const [convertedAmount, setConvertedAmount] = useState(0)

  const currencyInfo = useCurrencyInfo(from)

  const options = currencyInfo && currencyInfo.rates ? Object.keys(currencyInfo.rates) : []

  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
  }
  
  const convert = () => {
    if (currencyInfo.rates && currencyInfo.rates[to]) {
      setConvertedAmount(amount * currencyInfo.rates[to])
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 transition-all duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(30, 58, 138, 0.7)), url('https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
      }}
    >
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-white text-center mb-10 uppercase tracking-widest drop-shadow-2xl">
           Currency Converter
        </h1>

        <div className="bg-white/95 backdrop-blur-md p-7 rounded-2xl shadow-2xl border border-white/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}
          >
            <div className="space-y-4">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={(val) => setAmount(val)}
              />

              <div className="relative flex justify-center -my-6 z-10">
                <button
                  type="button"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg border-2 border-white font-bold hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                  onClick={swap}
                >
                  SWAP
                </button>
              </div>

              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => {
                  setTo(currency);
                  setConvertedAmount(0);
                }}
                selectCurrency={to}
                amountDisable
              />
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-4 rounded-xl font-bold text-xl shadow-lg active:scale-[0.75] transition-all uppercase tracking-wider"
            >
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>

        <div className="mt-10">
          <CurrencyRates
            rates={currencyInfo.rates}
            fromCurrency={from}
            baseAmount={amount}
          />
        </div>
      </div>
    </div>
  );
}

export default App
