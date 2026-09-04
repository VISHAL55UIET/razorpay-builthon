import { useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL.replace("/api", "");

function PaymentButton({
    paymentId,
    amount,
    customerName,
    customerEmail
}) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            // 1. Create Razorpay Order
            const response = await axios.post(
                `${BACKEND_URL}/api/payments/${paymentId}/razorpay-order`
            );

            const order = response.data;

            console.log("Razorpay Order:", order);

            // 2. Check Razorpay Checkout
            if (!window.Razorpay) {
                alert(
                    "Razorpay Checkout is not loaded. Please check index.html."
                );
                return;
            }

            // 3. Razorpay Checkout Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: order.amount,

                currency: order.currency,

                name: "AI Revenue Recovery",

                description: "Payment Recovery",

                order_id: order.orderId,

                prefill: {
                    name: customerName || "",
                    email: customerEmail || ""
                },

                notes: {
                    payment_id: order.paymentId
                },

                theme: {
                    color: "#3399cc"
                },

                method: {
                    card: true,
                    netbanking: true,
                    wallet: true,
                    upi: true
                },

                // 4. Payment Success Handler
                handler: async function (paymentResponse) {

                    console.log(
                        "Razorpay Payment Response:",
                        paymentResponse
                    );

                    try {

                        // 5. Verify payment with backend
                        const verifyResponse = await axios.post(
                            `${BACKEND_URL}/api/payments/${paymentId}/razorpay-verify`,
                            {
                                razorpayOrderId:
                                    paymentResponse.razorpay_order_id,

                                razorpayPaymentId:
                                    paymentResponse.razorpay_payment_id,

                                razorpaySignature:
                                    paymentResponse.razorpay_signature
                            }
                        );

                        console.log(
                            "Verification Response:",
                            verifyResponse.data
                        );

                        if (
                            verifyResponse.data &&
                            verifyResponse.data.status === "RECOVERED"
                        ) {

                            console.log(
                                "Payment recovered successfully."
                            );

                            /*
                             * Send success event to Payments.jsx
                             * so it can show the custom success toast.
                             */
                            window.dispatchEvent(
                                new CustomEvent(
                                    "payment-recovered",
                                    {
                                        detail: {
                                            paymentId:
                                                verifyResponse.data.paymentId ||
                                                paymentId,

                                            amount:
                                                verifyResponse.data.amount ||
                                                amount
                                        }
                                    }
                                )
                            );

                            /*
                             * Give backend/database a moment to finish
                             * before refreshing the payments list.
                             */
                            setTimeout(() => {
                                window.location.reload();
                            }, 800);

                        } else {

                            alert(
                                "Payment verification failed."
                            );

                        }

                    } catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );

                        if (error.response) {

                            console.error(
                                "Verification backend response:",
                                error.response.data
                            );

                        }

                        alert(
                            "Payment completed but verification failed."
                        );

                    }
                },

                // 6. Checkout closed
                modal: {
                    ondismiss: function () {

                        console.log(
                            "Razorpay Checkout closed."
                        );

                    }
                }
            };

            // 7. Open Razorpay
            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.error(
                "Unable to create Razorpay order:",
                error
            );

            if (error.response) {

                console.error(
                    "Backend response:",
                    error.response.data
                );

            }

            alert(
                "Unable to start payment. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    const displayAmount =
        amount != null
            ? Number(amount).toLocaleString("en-IN")
            : "";

    return (
        <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: loading
                    ? "#9ca3af"
                    : "#3399cc",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading
                    ? "not-allowed"
                    : "pointer"
            }}
        >
            {loading
                ? "Starting Payment..."
                : `Pay ₹${displayAmount}`}
        </button>
    );
}

export default PaymentButton;