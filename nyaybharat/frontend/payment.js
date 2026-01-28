const BACKEND_URL = "https://naiyebharat.onrender.com";
const RAZORPAY_KEY_ID = "RAZORPAY_KEY_ID"; // public key
const AMOUNT = 799; // change price

async function startPayment() {
  const form = document.getElementById("consultForm");

  if (!form) {
    alert("Consultation form not found ❌");
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = Object.fromEntries(new FormData(form).entries());

  try {
    // 1) Create Order
    const orderRes = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: AMOUNT, formData }),
    });

    const orderData = await orderRes.json();

    if (!orderData.success) {
      alert(orderData.message || "Order creation failed ❌");
      return;
    }

    // 2) Open Razorpay
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "NyayBharat",
      description: "Consultation Booking",
      order_id: orderData.order_id,

      handler: async function (response) {
        // 3) Verify Payment
        const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ response, formData, amount: AMOUNT }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          alert("Payment Successful ✅ Details submitted!");
          form.reset();
        } else {
          alert(verifyData.message || "Payment verification failed ❌");
        }
      },

      prefill: {
        name: formData.name || "",
        email: formData.email || "",
        contact: formData.phone || "",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Something went wrong ❌ Please try again.");
  }
}

// Make it available to HTML onclick
window.startPayment = startPayment;
