function addToCart(product_id, cartId) {
  fetch(`/api/cart/${cartId}/${product_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        //alert('Product added to cart');
        Toastify({
          text: "Product added to cart",
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function () {}, // Callback after click
        }).showToast();
      } else {
        //alert('Failed to add product to cart')
        Toastify({
          text: "Failed to add product to cart",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "linear-gradient(to right, #FF0000, #000000)",
          },
          onClick: function () {},
        }).showToast();
      }
    })
    .catch((error) => {
      Toastify({
        text: "Failed to add product to cart",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #0000FF, #000000)",
        },
        onClick: function () {},
      }).showToast();
    });
}
