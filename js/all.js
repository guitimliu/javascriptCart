const productWrap = document.querySelector('.productWrap');

axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/atht78fnvcxuz55cv3niiaaf8pv1/products`)
    .then((res) => {
        let productList = res.data.products;
        let str = '';
        productList.forEach((item, index) => {
            // console.log(item);
            str += `
            <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="javascript:void();" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">${item.origin_price}</del>
                <p class="nowPrice">${item.price}</p>
            </li>
            `;
        })
        productWrap.innerHTML = str;
    })
    .catch((err) => {
        console.log(err);
    })

productWrap.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') !== 'addCardBtn') {
        return;
    }
    console.log(e.target.getAttribute('data-id'));
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/atht78fnvcxuz55cv3niiaaf8pv1/carts`,{
        data: {
            productId: e.target.getAttribute('data-id'),
            quantity: 1,
        }
    })
    .then((res) => {
        console.log(res.data);
    })
    .catch((err) => {
        console.log(err);
    })
})