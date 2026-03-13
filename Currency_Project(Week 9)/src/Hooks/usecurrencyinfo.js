import { useState, useEffect } from "react";

function usecurrencyinfo(currency) {
  const [data, setData] = useState({});

  useEffect(() => {
    let isMounted = true;

    fetch(`https://open.er-api.com/v6/latest/${currency}`)
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setData(res);
        }
      })
      .catch(() => {
        if (isMounted) {
          setData({});
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currency]);

  return data;
}

export default usecurrencyinfo;
