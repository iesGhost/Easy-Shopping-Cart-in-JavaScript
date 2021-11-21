
let buttons_add = document.querySelectorAll('.cart--btn-add');

buttons_add.forEach(function(element){
  element.addEventListener('click', event => {
    let product = element.closest('.cart--parent');
    let productId = product.getAttribute('data-id');

    let productObject = {};
    productObject = {
      'productCategory': product.getAttribute('data-category'),
      'productName': product.getAttribute('data-name'),
      'productSlug': product.getAttribute('data-slug'),
      'productPrice': product.getAttribute('data-price'),
      'productOldPrice': product.getAttribute('data-oldPrice'),
      'productQuantity': product.getAttribute('data-quantity'),
      'productArticul': product.getAttribute('data-articul'),
      'productPhoto': product.querySelector('.product--photo').getAttribute('src'),
      'productId': productId,
    };

    //localStorage.clear();

    //Добавление в корзину
    addToCart(productObject);

    renderCart();
  });
});

function addToCart(productObject){
  let newCart = {};
  let cart = getAllCart();

  //If such a product has already been added
  if(chekProductInCart(productObject.productId)){

    //Add quantity to the product that already exists
    cart[productObject.productId].productQuantity = Number(cart[productObject.productId].productQuantity)+1;

  }else{
    //Adding a new product to the existing ones
    cart[productObject.productId] = productObject;
  }

  //Overwrite the cart
  localStorage.setItem('cart', JSON.stringify(cart));
}

function deleteProductInCart(productId){
  let cart = getAllCart();
  
  //If there is such a product in the basket
  if(chekProductInCart(productId)){

    delete cart[productId];

    //Overwrite the cart
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
}

function updateQuantityCart(productObject){
   let cart = getAllCart();
  //If such a product has already been added
  if(chekProductInCart(productObject.productId)){

    //Add quantity to the product that already exists
    cart[productObject.productId].productQuantity = productObject.productQuantity;
  }

  //Overwrite the cart
  localStorage.setItem('cart', JSON.stringify(cart));

  renderCart();
}

//Get current cart
function getAllCart(){
  try {
    var cart = JSON.parse(localStorage.cart);
    return cart;
  } catch (e) {
    return {};
  }
}

//Check if there is such a product in the basket
function chekProductInCart(productId){
  const cart = getAllCart();
 
  if(cart[productId]) return true;
  return false;
}

//Basket render
function renderCart(){
  let cart = getAllCart();

  let cartHtml = '';
  let totalSum = 0;
  let totalDiscount = 0;

  for (const [key, value] of Object.entries(cart)) {
    cartHtml += '<div class="cart__product cart--product" data-id="' + value.productId + '">'
    cartHtml += '<div class="cart__product_delete cart__product--delete"><span>+</span></div>'
    cartHtml += '<div class="cart__product_col cart__product_col-l">';
    cartHtml += '<img class="cart__product_photo" src="' + value.productPhoto + '">';
    cartHtml += '</div>';
    cartHtml += '<div class="cart__product_col cart__product_col-r">';
    cartHtml += '<div class="cart__product_category"> Артикул: ' + value.productArticul + '</div>';
    cartHtml += '<div class="cart__product_name">' + '<a href="' + value.productSlug + '">'+ value.productName +'</a>' + '</div>';
    cartHtml += '<div class="cart__product_price">';
    cartHtml += '<div class="cart__product_mainPrice"> $' + value.productPrice + '</div>';
    cartHtml += '<div class="cart__product_oldPrice"> $' + value.productOldPrice + '</div>';
    cartHtml += '</div>';
    cartHtml += '<div class="quantity cart__quantity--parent cart__quantity"><input type="number" min="1" class="quantity--btn" step="1" value="'+ value.productQuantity +'"><div class="quantity-nav"><div class="quantity-button quantity-up quantity--up">+</div><div class="quantity-button quantity-down quantity--down">-</div></div></div>';
    cartHtml += '<div class="cart__product_total">= $' + value.productPrice*value.productQuantity + '</div>';
    cartHtml += '</div>';
    cartHtml += '</div>';

    totalSum += value.productPrice*value.productQuantity;
    totalDiscount += Math.abs((value.productPrice-value.productOldPrice)*value.productQuantity);
  }

  cartHtml += '<div class="cart__info">';
  cartHtml += '<div class="cart__info_item">Итого: <div class="cart__total_sum">$' + totalSum + '</div></div>';
  cartHtml += '<div class="cart__info_item cart__info_item-discount">Cкидка: <div class="cart__total_discount">$' + totalDiscount + '</div></div>';
  cartHtml += '</div>';

  document.querySelector('.cart--insert').innerHTML = cartHtml;

  actionChangeCart();
}

function actionChangeCart(){
  let changeAllProductsInCart = document.querySelectorAll('.cart--product');

  changeAllProductsInCart.forEach(function(element){

      let productId = element.getAttribute('data-id');

      let quantityUp = element.querySelector('.quantity--up');
      let quantityDown = element.querySelector('.quantity--down');
      let inputNumber = element.querySelector('.quantity--btn');
      
      //------Quantity up
      quantityUp.addEventListener('click', event => {
        let productQuantity = +inputNumber.value+1;
  
        element.querySelector('.quantity--btn').value = productQuantity;

        let productObject = {
          'productQuantity': productQuantity,
          'productId': productId,
        };

        updateQuantityCart(productObject);
      });

      //------Quantity down
      quantityDown.addEventListener('click', event => {
        let productQuantity = +inputNumber.value-1;
        if(productQuantity <= 0) productQuantity = 1;

        element.querySelector('.quantity--btn').value = productQuantity;

        let productObject = {
          'productQuantity': productQuantity,
          'productId': productId,
        };

        updateQuantityCart(productObject);
      });

      //------Quantity input change
      inputNumber.addEventListener('change', event => {
        let productQuantity = +inputNumber.value;
        if(productQuantity <= 0) productQuantity = 1;

        let productObject = {
          'productQuantity': productQuantity,
          'productId': productId,
        };

        updateQuantityCart(productObject);
      });

      //------Delete product in cart
      element.querySelector('.cart__product--delete').addEventListener('click', event => {
        deleteProductInCart(productId);
      });
  });
}

renderCart();