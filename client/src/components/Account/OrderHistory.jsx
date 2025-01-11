export const OrderHistory = ({ orders }) => {
  return (
    <div className="orders-container">
      <h2 className="text-3xl font-sf-heavy font-bold mb-4">Order History</h2>
      {orders?.orders?.length > 0 ? (
        orders.orders.map((order) => (
          <div key={order._id} className="order-item">
            <div>
              <p>
                <b className="text-md font-sf-light   text-neutral-600 mr-2.5 text-neutral">
                  Order ID:
                </b>{" "}
                {order._id}
              </p>
              <p>
                <b className="text-md font-sf-light   text-neutral-600 mr-2.5">
                  Total Amount:
                </b>{" "}
                ${order.totalAmount}
              </p>
              <p>
                <b className="text-md font-sf-light   text-neutral-600 mr-2.5">
                  Status:
                </b>{" "}
                {order.status}
              </p>
              <p>
                <b className="text-md font-sf-light   text-neutral-600 mr-2.5">
                  Payment Method:
                </b>{" "}
                {order.paymentMethod}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
};
