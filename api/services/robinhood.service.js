
const axios = require('axios');

const BASE_URL = 'https://api.robinhood.com';

axios.defaults.headers.common = {'Authorization': `bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MDgxNTc4NDgsInRva2VuIjoiUXRuT2JWOHY2eEQzRDJLWlNVOG40YXRQYjB6S3p3IiwidXNlcl9pZCI6IjllNGNjMjVhLTlmYTItNDYzZi1hMmVmLTBlN2Q4MjdhYWViYSIsImRldmljZV9oYXNoIjoiMDFjMjllYjk5ZTJlNmI3ZWViYzdiM2I3ZjJjYTVjOWYiLCJzY29wZSI6IndlYl9saW1pdGVkIiwiZGN0IjoxNjAzMTMwODU1LCJ1c2VyX29yaWdpbiI6IlVTIiwib3B0aW9ucyI6dHJ1ZSwibGV2ZWwyX2FjY2VzcyI6ZmFsc2V9.qDO1eh4y4YhLVml0l3lRv3uKMBdOGnzytY4sig7wPr80wSvVT_H53pRJncDbM9YqUXRtqccZMwND1VEP63oO0o3ICd43upzPjWKyER1YksoV5nqAz8pdt_ECk1rxYY0n6svzcvGy2_92U5Z6zJnz4-P2Df_ew6HN5gDnmuBw9drYX0zMxlrtg8mJK-iuVVyY6ACb0JaK8l1oxhA5oGpaKNPMTwgI6tNn27OoM-PLaKamjnfFQs48E3xXKnLDKHuIlgnvAVXYGrHPyxu63ocMzEzAFYtafBIaUz_9bgCDunkjcuYn6n_tbPezNH-n09RmF8atl7q77yTwplqK3Y-uwg`}

const instrumentsCache = {};

const getInstrument = async (id) => {
  const cached = instrumentsCache[id];
  if (!!cached) return cached;


  const instrument = (await axios.get(`${BASE_URL}/instruments/${id}`)).data
  instrumentsCache[instrument.id] = instrument

  return instrument
}

const getRegularOrders = async () => {
  const data = (await axios.get(`${BASE_URL}/orders/?page_size=99999`)).data.results


  return await Promise.all(data.filter(el => el.state !== 'cancelled').map(async el => {
    const instrumentId = el.instrument.split('/')[el.instrument.split('/').length-2];

    // console.log("instrumentId:", instrumentId)
    // console.log("instrumentsCache:", Object.keys(instrumentsCache))
    return {
      ticker: (await getInstrument(instrumentId)).symbol,
      startDate: el.created_at,
      
    }
  }));
}

const getOptionOrders = async () => {
  return (await axios.get(`${BASE_URL}/options/orders/?page_size=99999`)).data.results
}

const getOrderHistory = async () => {
  const regularOrders = await getRegularOrders()
  console.log("regularOrders:", regularOrders)
  console.log("instrumentsCache:", Object.keys(instrumentsCache))
  // const promises = [getRegularOrders(), getOptionOrders()]
  // const orders = (await Promise.all(promises))
  //   .flat()
  //   .sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
  //   .filter(el => el.state !== 'cancelled')
  //   .map(el => ({
  //     ticker: el.chain_symbol,

  //   }));
  // console.log("orders:", orders)
  

  // console.log("resultOrders:", regularOrders)

  // const orders = [...regularOrders, ...optionOrders].sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).filter(el => el.state !== 'cancelled');
  // console.log("orders:", orders.length)

  // return orders;
}

getOrderHistory()
