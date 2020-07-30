/* this file has the proper functionalities to scan a barcode image and perform a db call to check 
for the product or do some operation as requested from the front end  */

/** for more read on the documentation for further customization
 *  https://serratus.github.io/quaggaJS/
 *
 */
const LOCAL_API = `http://127.0.0.1:8000/products/`;
let LookingForProduct = true;
/* ------------------- helper functions -------------------  */
const fetchProducts = async () => {
  try {
    const response = await fetch(`${LOCAL_API}`);
    const result = await response.json();
    console.log("result is : ", result);
    return result;
  } catch (error) {
    console.log(
      `error happened while fetching product  at the function fetchProducts() , error ${error.message}`
    );
  }
};

const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${LOCAL_API}/${id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(
      `error happened while fetching product  at the function fetchProductById() , error ${error.message}`
    );
  }
};

const fetchProductByCode = async (code) => {
  try {
    const response = await fetch(`${LOCAL_API}/?code=${code}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(
      `error happened while fetching product  at the function fetchProductById() , error ${error.message}`
    );
  }
};

const startLookingForProduct = async (code) => {
  if (startLookingForProduct) {
    setTimeout(async () => {
      if (LookingForProduct) {
          
        const response = await fetchProductByCode(code);
        if (response.code === 200) {
          //after we found it finally
          LookingForProduct = false;
          //means it was found and scanned correctly
          Quagga.stop();
          document.querySelector("#resultado").innerText = code;
          console.log(response);
          //stop calling the function
          return response;
        }
      }
    }, 1000);
  }
};

/* ------------------- Quagga Configuration ------------------- */
Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#camera"), // Or '#yourElement' (optional)
    },
    decoder: {
      readers: [
        "code_128_reader",
        "ean_reader",
        "ean_8_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "upc_reader",
        "upc_e_reader",
        "i2of5_reader",
      ],
    },
  },
  function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  }
);

Quagga.onDetected(async function (data) {
  //stop after dedication by setting time interval every second call db
  const code = data.codeResult.code;
  await startLookingForProduct(code);
});
