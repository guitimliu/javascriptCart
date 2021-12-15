const productWrap = document.querySelector('.productWrap');

function init() {
    renderProduct();
    myCart();
}
init();

function renderProduct() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/guitimliu/products`)
    .then((res) => {
        let productList = res.data.products;
        let str = '';
        productList.forEach((item) => {
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
}

productWrap.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') !== 'addCardBtn') {
        return;
    }
    console.log(e.target.getAttribute('data-id'));
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/guitimliu/carts`,{
        data: {
            productId: e.target.getAttribute('data-id'),
            quantity: 1,
        }
    })
    .then((res) => {
        console.log(res.data);
        myCart();
    })
    .catch((err) => {
        console.log(err);
    })
})

function myCart() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/guitimliu/carts
    `)
        .then((res) => {
            let orderList = res.data.carts;
            const cartList = document.querySelector('.cartList');
            // console.log(cartList);
            let str = '';
            let allPrice = 0;
            // console.log(orderList);
            orderList.forEach((item) => {
                str += `
                    <tr>
                        <td>
                            <div class="cardItem-title">
                                <img src="${item.product.images}" alt="">
                                <p>${item.product.title}</p>
                            </div>
                        </td>
                        <td>${item.product.price}</td>
                        <td>${item.quantity}</td>
                        <td>${item.product.price * item.quantity}</td>
                        <td class="discardBtn">
                            <a href="#" class="material-icons">
                                clear
                            </a>
                        </td>
                    </tr>
                `;
                allPrice += item.product.price * item.quantity;
            })
            str += `
                <tr>
                    <td>
                        <a href="#" class="discardAllBtn">刪除所有品項</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>總金額</p>
                    </td>
                    <td>NT$${allPrice}</td>
                </tr>
            `;
            cartList.innerHTML = str;
        })
        .catch((err) => {
            console.log(err);
        })
}