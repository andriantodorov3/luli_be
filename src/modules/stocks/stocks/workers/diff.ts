import { SearchResult } from "../../datagenerator/interfaces/SearchResult";

function findFirstIndexByTimestamp(arr, min_tstamp) {
    return arr.findIndex(v => v.tstamp >= min_tstamp);
}

function findLastIndexByTimestamp(arr, max_tstamp) {
    let index = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].tstamp <= max_tstamp) {
            index = i;
            break;
        }
    }
    return index;
}


export default function calcDiff({ arr, min_tstamp, max_tstamp }) {

    const start_index = findFirstIndexByTimestamp(arr, min_tstamp);
    const last_index = findLastIndexByTimestamp(arr, max_tstamp);

    // Initialize Result
    let best_buy_time = arr[start_index].tstamp;
    let best_sell_time = arr[last_index].tstamp;
    let best_buy_value = arr[start_index].value;
    let best_sell_value = arr[last_index].value;

    let max_diff = arr[start_index + 1].value - arr[start_index].value;
    for (let i = start_index; i <= last_index; i++) {
        for (let j = i + 1; j < last_index; j++) {
            if (arr[j].value - arr[i].value > max_diff) {
                max_diff = arr[j].value - arr[i].value;
                best_buy_time = arr[i].tstamp;
                best_sell_time = arr[j].tstamp;
                best_buy_value = arr[i].value;
                best_sell_value = arr[j].value;
            }
        }
    }
    return <SearchResult>{
        buy_point: best_buy_time,
        buy_point_price: best_buy_value,
        sell_point: best_sell_time,
        sell_point_price: best_sell_value
    }


}
