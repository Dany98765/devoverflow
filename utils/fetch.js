// import logger from "./logger"

// export async function fetchHandler(url, options = {}){
//     const {
//         timeout = 5000,
//         headers,
//         ...restOptions
//     } = options
//     const controller = new AbortController()
//     const id = setTimeout(() => controller.abort(), 5000)
//     const defaultHeaders = {
//         "Content-Type": "application/json",
//         Accept: "application/json"
//     }
//     headers = {defaultHeaders, ...restOptions}

//     try{
//         const response = await fetch(url, config);
//         clearTimeout(id);
//         if (!response.ok) {
//             logger.error(response.status, `HTTP error: ${response.status}`);
//         }
//         return await response.json();
//     } catch (error) {
//         if (error.name === "AbortError") {
//             logger.warn(`Request to ${url} timed out`);
//         } else {
//             logger.error(`Error fetching ${url}: ${error.message}`);
//         }
//     }
// }
import logger from "./logger";

export async function fetchHandler(url, options = {}) {
  const {
    timeout = 5000,
    headers = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers
  };

  const config = {
    ...restOptions,
    headers: mergedHeaders,
    signal: controller.signal
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(id);

    if (!response.ok) {
      logger.error(response.status, `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }
  }
}
