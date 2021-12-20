// 商品列表
const productWrap = document.querySelector('.productWrap');
// 個人購物車清單
const cartList = document.querySelector('.cartList');

// 初始化
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
        myCart();
        alert(`已經商品加入購物車`);
    })
    .catch((err) => {
        // console.log(err);
    })
})

function myCart() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/guitimliu/carts
    `)
        .then((res) => {
            let orderList = res.data.carts;
            let str = '';
            let allPrice = 0;
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
                        <td><input type="number" value="${item.quantity}" class="itemQuantity" min="1" data-id="${item.id}"></td>
                        <td>${item.product.price * item.quantity}</td>
                        <td class="discardBtn">
                            <a href="javascript:void();" class="material-icons" data-btn="removeItem" data-id="${item.id}">
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
                        <a href="javascript:void();" class="discardAllBtn">刪除所有品項</a>
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

cartList.addEventListener('click', (e) => {
    if (e.target.nodeName !== 'A') {
        return;
    }

    if (e.target.getAttribute('data-btn') === 'removeItem') {
        removeCart(e.target.getAttribute('data-id'));
        return;
    }

    if (e.target.getAttribute('class') === 'discardAllBtn') {
        removeCart('discardAllBtn');
        return;
    }
})

cartList.addEventListener('change', (e) => {
    // console.log(e.target.getAttribute('data-id'));
    axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/guitimliu/carts
    `, {
        data: {
            "id": e.target.getAttribute('data-id'),
            "quantity": parseInt(e.target.value)
        }
    })
    .then(() => {
        // console.log(res);
        myCart();
    })
    .catch((err) => {
        console.log(err);
    })
})

function removeCart(itemID) {
    if (itemID === 'discardAllBtn') {
        itemID = '';
    }

    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/guitimliu/carts/${itemID}`)
    .then((res) => {
        myCart();
        if (itemID === '') {
            alert(res.data.message);
        } else {
            alert(`已將一筆商品刪除`);
        }
    })
    .catch((err) => {
        // console.log(Promise.reject(err));
        if (err.response.status === 400) {
            alert(err.response.data.message);
        }
    })
}

const orderInfoBtn = document.querySelector('.orderInfo-btn');
// console.log(orderInfoBtn.value);
// orderInfoBtn.addEventListener('click', (e) => {
//     console.log(1);
// })