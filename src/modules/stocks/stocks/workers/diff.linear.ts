import { SearchResult } from '../../datagenerator/interfaces/SearchResult';

export default function calcDiff({ arr, min_tstamp, max_tstamp }) {
  // Initialize Result
  let maxDiff = -1;
  let highestIndex = -1;
  let highestIndexConfirmed = -1;
  let lowestIndex = -1;

  // Initialize max element from right side
  let maxRight = arr[arr.length - 1].value;
  highestIndex = arr.length - 1;

  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i].tstamp > max_tstamp) {
      continue;
    }

    if (arr[i].tstamp < min_tstamp) {
      break;
    }

    if (arr[i].value >= maxRight) {
      maxRight = arr[i].value;
      highestIndex = i;
    } else {
      const diff = maxRight - arr[i].value;
      if (diff >= maxDiff) {
        maxDiff = diff;
        highestIndexConfirmed = highestIndex;
        lowestIndex = i;
      }
    }
  }
  return <SearchResult>{
    buy_point: arr[lowestIndex].tstamp,
    buy_point_price: arr[lowestIndex].value,
    sell_point: arr[highestIndexConfirmed].tstamp,
    sell_point_price: arr[highestIndexConfirmed].value,
  };
}
