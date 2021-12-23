const orderTable = document.querySelector('.orderTable');
// console.log(orderTable);
const discardAllBtn = document.querySelector('.discardAllBtn');
// console.log(discardAllBtn);
let productRevenue = {};

function init() {
    showOrderList();
}
init();

function showOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': `${api_key}`
        }
    })
        .then((res) => {
            // console.log(res.data.orders);
            let data = res.data.orders;
            let str = ``;

            data.forEach((item, index) => {

                let orderItemStr = '';
                item.products.forEach((productItem) => {
                    orderItemStr += `${productItem.title} * ${productItem.quantity}<br>`

                    if (productRevenue[productItem.title] === undefined) {
                        productRevenue[productItem.title] = 0;
                    }
                    productRevenue[productItem.title] += productItem.price * productItem.quantity;
                })

                let orderState = '';
                if (item.paid === true) {
                    orderState = '已處理';
                } else {
                    orderState = '未處理';
                }

                let orderStamp = new Date(item.createdAt * 1000);
                // console.log();

                str += `
                <tr>
                    <td>${item.id}</td>
                    <td>
                        <p>${item.user.name}</p>
                        <p>${item.user.tel}</p>
                    </td>
                    <td>
                        ${item.user.address}
                    </td>
                    <td>
                        ${item.user.email}
                    </td>
                    <td>
                        <p>${orderItemStr}</p>
                    </td>
                    <td>
                        ${orderStamp.getFullYear()}/${orderStamp.getMonth()+1}/${orderStamp.getDate()}
                    </td>
                    <td>
                        <a class="orderStatus" href="#" data-id="${item.id}" data-state="${item.paid}">${orderState}</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
                    </td>
                </tr>
                `;
            })

            // console.log(productRevenue);

            let productRevenueName = Object.keys(productRevenue);

            let chartData = [];

            productRevenueName.forEach((item, index) => {
                chartData.push([
                    item, productRevenue[item]
                ]);

            })

            chartData.sort((itemA, itemB) => {
                return itemB[1] - itemA[1];
            })

            if (chartData.length > 3) {
                let otherTotal = 0;
                chartData.forEach((item, index) => {
                    if (index > 2) {
                        otherTotal += item[1];
                    }
                })
                chartData.splice(3, chartData.length - 3);
                chartData.push(['其它', otherTotal])
            }

            // console.log(chartData);

            chart(chartData);

            orderTable.innerHTML = str;
        })
        .catch((err) => {
            console.log(err);
        })
}

function deleteOrder(orderID) {

    if (orderID === 'all') {
        orderID = '';
    }

    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderID}`, {
        headers: {
            'Authorization': `${api_key}`
        }
    })
        .then((res) => {
            if (res.data.status === true) {
                showOrderList();
                alert(`已將訂單刪除`);
            }
        })
        .catch((err) => {
            console.log(err.response);
        })
}

orderTable.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.getAttribute('class') === 'delSingleOrder-Btn') {
        deleteOrder(e.target.getAttribute('data-id'));
    }

    if (e.target.getAttribute('class') === 'orderStatus') {
        changeState(e.target.getAttribute('data-id'), e.target.getAttribute('data-state'));
    }

})

discardAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    deleteOrder('all');
})

function changeState(id, paid) {

    if (paid === 'true') {
        paid = false;
    } else if (paid === 'false') {
        paid = true;
    }

    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
            data: {
                id, paid
            }
        }, {
            headers: {
                'Authorization': `${api_key}`
            }
    })
        .then((res) => {
            if (res.data.status === true) {
                showOrderList();
            }
            alert('已變更商品狀態');
        })
        .catch((err) => {
            console.log(err.response);
        })
}

function chart(data) {
    let chart = c3.generate({
        bindto: "#chart",
        data: {
            columns: data,
            type: 'donut'
        }
    });
}