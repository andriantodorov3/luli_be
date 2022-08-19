## Description

LucidLink demo backend project.

The application has a single module and API endpoint <b>/api/v1/stocks/search</b> accepting payloads like: 
<br />
<code>start_time=1659630900&end_time=1659976500</code>
<b>"start_time"</b>:  is the start of the window of interest,
<b>"end_time"</b>:  is the end of the window respectively.
The service would return a json-encoded payload, looking like 
<code>{"buy_point":1659630908,"buy_point_price":10,"sell_point":1659631111,"sell_point_price":100}</code>

<h3>Settings</h3>
<p>Please see and modify the settings in .env file if needed. The file contains timeframe, for which the data would be generated and service port number</p>
<h3>Data:</h3>
<p>As per specification, data is static. I decided to have it generated once (when the app spins up and the DI container initates the appropriate module) and keep it memory. Alternatively, this data could be written to a file on the same hook and be  read/processed on the fly. This is not a requirement and adds unnecessary complications, so I did not go this way.<br />
Please be careful how big time window you define in the .env file. Since data is generated and kept in memory, for bigger timeframes it would generate a huge array and would kill application's memory. For the sake of the demo and according to the requirements it should be fine, for real use case we would need a proper data store like a database service.
</p>


<h3>Algorithm:</h3>
<p>The backend service should locate the best time to buy and sell in a user-defined time window, so you make highest possible profit.
Logically you need to find the max difference between the points and have in mind that selling comes after buying and the curve of the prices contantly change, so you care about order and max difference (not max and min value, since they don't guarantee order and difference).
Easiest approach is going through all the elements in the searched time one by one and checking if there is a better match (higher difference). This is implemented in <code>src/modules/stocks/stocks/workers/diff.slow.ts</code>. The algorigthm is safe but is pretty slow.
<br />
The option I prefer is in <code>src/modules/stocks/stocks/workers/diff.linear.ts</code>. What it does is - it goes from right to left (additional requirement in the specs is to find the earliest match if multiple with same profit are found), checks max value and max difference and if difference higher, stores that value and new max value. This way we keep the order of the buy/sell time points.
This option is much faster and preferable.</p>


<h3>Execution</h3>
<p>Since searching in that dataset is a blocking and slow process, there are a few options how NOT to block the main event loop thread. One of the easiest (without using a 3rd party service like message queue) is to use the thread pool with a library like <a href="https://www.npmjs.com/package/piscina">piscina</a></p>
<h3>Validation</h3>
<p>Validation comes from the base validation pipe from nestjs, needs to be installed and configured and via an additional service that I wrote. The base one is for taking care of the DTO format, the second one is taking care of applying logic (which time comes first) and to compare with .env settings for timeframe. Nest provides an easy way to hook and chain such functions as decorators (see controller). The second service also provides more verbose error messages about what exacty has failed (to be fed in the UI component)</p>

<h3>Errors and status</h3>
<p>Nest.js by default mixes all the responses into a single message, which is bad for the UI (you cannot split error message and show them in the right places), so I put a new filter to handle such exceptions, coming from the custom validation and to reformat them into a nested structure</p>

<h3>Notes</h3>
<p><ul>
<li>Have in mind that the dataset is being generated for each second in the time window, defined in the .env file. The actual value is coming from running rand() of values between 10 and 100, meaning that for bigger timeframes the chances to hit lowest price 10 and highest 100 is almost 100%</li>
<li>Since the app is split into frontend and backend, getting the time values between the applications needs unification. It can be either based on strings in a fully qualified format (including timezones) or just unix timestamps. I picked unix timestamps as an easier approach.</li>
<li>At the moment timezone is not being passed additionally, so some errors contain the server timezone in the error message. Since frontend is mapped by default to user's time (coming from browser), there might be an offset and without it errors would contain wrong to the user data. As an enhancement, timezone param could be passed by the FE and the BE could return a string, containing the time in user's zone(This is a not a requirement though)</li> </p> 

## Installation and running

```bash
$ npm install
```
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```