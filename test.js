import axios from 'axios';

axios.post("https://api.runpod.ai/v2/cy98pf6q2ggqqt/run", {
  "input": {
    "prompt" : "Person wearing, Black, slightly cropped, smooth, Harley Davidson logo on the front, cotton t-shirt, standing model",
  },
},{
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer rpa_NWY92QPWI82LCULWJ7F3TQ45GFCO8S5FS0YXRBSV17e3bp',
  }
})
.then((res) => console.log(res.data))
.catch((e) => console.log(e));