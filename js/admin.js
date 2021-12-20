// console.log(1);

// console.log(axios);

axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
    headers: {
        'Authorization': `${api_key}`
    }
})
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })

    // curl -X 'GET' \
//   'https://livejs-api.hexschool.io/api/livejs/v1/admin/aTHT78FNvcXuZ55cV3NiIAaF8pv1/orders' \
//   -H 'accept: application/json'