// 商品列表
const productWrap = document.querySelector('.productWrap');
// 個人購物車清單
const cartList = document.querySelector('.cartList');
// 篩選商品分類
const productSelect = document.querySelector('.productSelect');

// 初始化
function init() {
    getProductData();
    myCart();
}
init();

// 取得 API 商品資料
function getProductData(select = '全部') {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then((res) => {
        let data = res.data.products;

        // 依商品分類篩選顯示商品
        if (select !== '全部') {
            data = res.data.products.filter(item => select === item.category);
        }

        renderProducts(data);
    })
    .catch(() => {
        // console.log(err);
    })
}

// 渲染商品列表
function renderProducts(data) {
    let str = '';
    data.forEach((item) => {
        str += `
        <li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}" alt="">
            <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">${item.origin_price}</del>
            <p class="nowPrice">${item.price}</p>
        </li>
        `;
    })
    productWrap.innerHTML = str;
}

// 篩選商品分類
productSelect.addEventListener('change', (e) => {
    e.preventDefault();
    getProductData(e.target.value);
})

productWrap.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.getAttribute('class') !== 'addCardBtn') {
        return;
    }
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
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
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts
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
                            <a href="#" class="material-icons" data-btn="removeItem" data-id="${item.id}">
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

cartList.addEventListener('click', (e) => {
    e.preventDefault();
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
    e.preventDefault();
    // console.log(e.target.getAttribute('data-id'));
    axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts
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

    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${itemID}`)
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

orderInfoBtn.addEventListener('click', (e) => {

    // 取消預設行為，避免因 form 表單跳轉
    e.preventDefault();
    const fieldName = document.querySelectorAll(`.orderInfo-message`);
    const fields = document.querySelectorAll('.orderInfo-formGroup input, .orderInfo-formGroup select');
    let unfilled = 0;
    let sendData = {};

    fields.forEach((item, index) => {
        // console.log(item.getAttribute('name'));

        if (item.value == '') {
            // console.log(`未填寫`);
            // console.log(fieldName[index]);
            fieldName[index].setAttribute('style', 'display: block;');
            unfilled++;
        } else {
            // console.log(`有填寫`);
            sendData[item.getAttribute('id')] = item.value;
            fieldName[index].setAttribute('style', 'display: none;');
        }
    })

    // console.log(sendData);

    if (unfilled > 0) {
        unfilled = 0;
        return;
    } else {
        sendOrderData(sendData);
    }
})

function sendOrderData(data) {
    console.log(data);
    console.log(`傳送訂單資料`);
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
        "data": {
          "user": {
            "name": data.customerName,
            "tel": data.customerPhone,
            "email": data.customerEmail,
            "address": data.customerAddress,
            "payment": data.tradeWay
          }
        }
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        if (err.response.status === 400) {
            alert(err.response.data.message);
        }
    })
}