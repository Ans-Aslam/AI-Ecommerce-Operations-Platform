import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8000/api/v1";

function App() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workflowRuns, setWorkflowRuns] = useState([]);
  const [workflowErrors, setWorkflowErrors] = useState([]);
  const [abandonedCheckouts, setAbandonedCheckouts] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [automationActions, setAutomationActions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailLoading, setProductDetailLoading] = useState(false);
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [checkoutDetailLoading, setCheckoutDetailLoading] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundDetailLoading, setRefundDetailLoading] = useState(false);
  const [selectedWorkflowRun, setSelectedWorkflowRun] = useState(null);
  const [workflowRunDetailLoading, setWorkflowRunDetailLoading] = useState(false);
  const [selectedWorkflowError, setSelectedWorkflowError] = useState(null);
  const [workflowErrorDetailLoading, setWorkflowErrorDetailLoading] = useState(false);
  const [selectedAutomationAction, setSelectedAutomationAction] = useState(null);
  const [automationActionDetailLoading, setAutomationActionDetailLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [workflowRunFilter, setWorkflowRunFilter] = useState("all");
  const [refundFilter, setRefundFilter] = useState("all");
  const [checkoutFilter, setCheckoutFilter] = useState("all");
  const [automationActionFilter, setAutomationActionFilter] = useState("all");

  async function loadCheckoutDetails(checkoutId) {
  setCheckoutDetailLoading(true);

  try {
    const response = await fetch(
      `${API_BASE}/abandoned-checkouts/${checkoutId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load checkout details.");
    }

    const data = await response.json();
    setSelectedCheckout(data);
  } catch (error) {
    console.error("Checkout details error:", error);
  } finally {
    setCheckoutDetailLoading(false);
  }
}

async function loadRefundDetails(refundId) {
  setRefundDetailLoading(true);

  try {
    const response = await fetch(
      `${API_BASE}/refund-requests/${refundId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load refund details.");
    }

    const data = await response.json();
    setSelectedRefund(data);
  } catch (error) {
    console.error("Refund details error:", error);
  } finally {
    setRefundDetailLoading(false);
  }
}

async function loadWorkflowRunDetails(runId) {
  setWorkflowRunDetailLoading(true);

  try {
    const response = await fetch(
      `${API_BASE}/workflow-runs/${runId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load workflow run details.");
    }

    const data = await response.json();
    setSelectedWorkflowRun(data);
  } catch (error) {
    console.error("Workflow run details error:", error);
  } finally {
    setWorkflowRunDetailLoading(false);
  }
}

async function loadWorkflowErrorDetails(errorId) {
  setWorkflowErrorDetailLoading(true);

  try {
    const response = await fetch(
      `${API_BASE}/workflow-errors/${errorId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load workflow error details.");
    }

    const data = await response.json();
    setSelectedWorkflowError(data);
  } catch (error) {
    console.error("Workflow error details:", error);
  } finally {
    setWorkflowErrorDetailLoading(false);
  }
}

async function loadAutomationActionDetails(actionId) {
  setAutomationActionDetailLoading(true);

  try {
    const response = await fetch(
      `${API_BASE}/automation-actions/${actionId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load automation action details.");
    }

    const data = await response.json();
    setSelectedAutomationAction(data);
  } catch (error) {
    console.error("Automation action details:", error);
  } finally {
    setAutomationActionDetailLoading(false);
  }
}

  async function loadProductDetails(productId) {
  setProductDetailLoading(true);

  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);

    if (!response.ok) {
      throw new Error("Failed to load product details.");
    }

    const data = await response.json();
    setSelectedProduct(data);
  } catch (error) {
    console.error("Product details error:", error);
  } finally {
    setProductDetailLoading(false);
  }
}

  async function loadCustomerDetails(customerId) {
  setCustomerDetailLoading(true);

  try {
    const response = await fetch(`${API_BASE}/customers/${customerId}`);

    if (!response.ok) {
      throw new Error("Failed to load customer details.");
    }

    const data = await response.json();
    setSelectedCustomer(data);
  } catch (error) {
    console.error("Customer details error:", error);
  } finally {
    setCustomerDetailLoading(false);
  }
}

  async function loadOrderDetails(orderId) {
  setOrderDetailLoading(true);

  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}`);

    if (!response.ok) {
      throw new Error("Failed to load order details.");
    }

    const data = await response.json();
    setSelectedOrder(data);
  } catch (error) {
    console.error("Order details error:", error);
  } finally {
    setOrderDetailLoading(false);
  }
}

  async function loadDashboard(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [
        customersRes,
        productsRes,
        inventoryRes,
        ordersRes,
        workflowRunsRes,
        workflowErrorsRes,
        abandonedCheckoutsRes,
        refundRequestsRes,
        automationActionsRes,
      ] = await Promise.all([
        fetch(`${API_BASE}/customers`),
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/inventory`),
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/workflow-runs`),
        fetch(`${API_BASE}/workflow-errors`),
        fetch(`${API_BASE}/abandoned-checkouts`),
        fetch(`${API_BASE}/refund-requests`),
        fetch(`${API_BASE}/automation-actions`),
      ]);

      const responses = [
        customersRes,
        productsRes,
        inventoryRes,
        ordersRes,
        workflowRunsRes,
        workflowErrorsRes,
        abandonedCheckoutsRes,
        refundRequestsRes,
        automationActionsRes,
      ];

      if (responses.some((response) => !response.ok)) {
        throw new Error("One or more API requests failed.");
      }

      const [
        customersData,
        productsData,
        inventoryData,
        ordersData,
        workflowRunsData,
        workflowErrorsData,
        abandonedCheckoutsData,
        refundRequestsData,
        automationActionsData,
      ] = await Promise.all(responses.map((response) => response.json()));

      setCustomers(customersData.customers || []);
      setProducts(productsData.products || []);
      setInventory(inventoryData.inventory || []);
      setOrders(ordersData.orders || []);
      setWorkflowRuns(workflowRunsData.workflow_runs || []);
      setWorkflowErrors(workflowErrorsData.workflow_errors || []);
      setAbandonedCheckouts(abandonedCheckoutsData.checkouts || []);
      setRefundRequests(refundRequestsData.refund_requests || []);
      setAutomationActions(
        automationActionsData.automation_actions || []
      );

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const lowStockCount = inventory.filter(
    (item) => item.inventory_status === "low_stock"
  ).length;

  const failedRuns = workflowRuns.filter(
    (run) => run.status === "failed"
  ).length;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCustomers = customers.filter((customer) =>
    `${customer.first_name || ""} ${customer.last_name || ""} ${customer.email || ""}`
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const filteredProducts = products.filter((product) =>
    `${product.title || ""} ${product.sku || ""} ${product.shopify_product_id || ""}`
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const filteredOrders = orders.filter((order) =>
    `${order.shopify_order_id || ""} ${order.first_name || ""} ${order.last_name || ""} ${order.email || ""}`
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const filteredCheckouts = abandonedCheckouts.filter((checkout) => {
    const matchesSearch =
      `${checkout.first_name || ""} ${checkout.last_name || ""} ${checkout.customer_email || ""} ${checkout.shopify_checkout_id || ""}`
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus =
      checkoutFilter === "all" ||
      checkout.recovery_status === checkoutFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredRefunds = refundRequests.filter((refund) => {
    const matchesSearch =
      `${refund.shopify_order_id || ""} ${refund.refund_type || ""} ${refund.reason || ""} ${refund.status || ""}`
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus =
      refundFilter === "all" ||
      refund.status === refundFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      `${item.title || ""} ${item.sku || ""} ${item.inventory_status || ""}`
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus =
      inventoryFilter === "all" ||
      item.inventory_status === inventoryFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredWorkflowRuns = workflowRuns.filter((run) => {
    const matchesSearch =
      `${run.workflow_name || ""} ${run.trigger_type || ""} ${run.status || ""}`
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus =
      workflowRunFilter === "all" ||
      run.status === workflowRunFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredWorkflowErrors = workflowErrors.filter((item) =>
    `${item.workflow_name || ""} ${item.error_type || ""} ${item.error_message || ""} ${item.node_name || ""}`
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const filteredAutomationActions = automationActions.filter((action) => {
    const matchesSearch =
      `${action.action_type || ""} ${action.target_type || ""} ${action.provider || ""} ${action.status || ""}`
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesStatus =
      automationActionFilter === "all" ||
      action.status === automationActionFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>AI E-Commerce Operations Platform</h1>
          <p>Operations Control Center</p>
        </div>

        <div className="topbar-actions">
          <div className="api-status">
            <span className="status-dot"></span>
            API Online
          </div>

          <button
            className="refresh-button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </header>

      <main className="dashboard">
        <div className="dashboard-meta">
          <div>
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleString()}`
              : "Loading dashboard..."}
          </div>

          {error && <div className="dashboard-error">{error}</div>}
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search customers, products, orders, workflows..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </button>
          )}
        </div>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Customers</span>
            <strong>{loading ? "..." : customers.length}</strong>
          </div>

          <div className="stat-card">
            <span>Products</span>
            <strong>{loading ? "..." : products.length}</strong>
          </div>

          <div className="stat-card">
            <span>Low Stock</span>
            <strong>{loading ? "..." : lowStockCount}</strong>
          </div>

          <div className="stat-card">
            <span>Workflow Runs</span>
            <strong>{loading ? "..." : workflowRuns.length}</strong>
          </div>

          <div className="stat-card">
            <span>Failed Runs</span>
            <strong>{loading ? "..." : failedRuns}</strong>
          </div>

          <div className="stat-card">
            <span>Open Errors</span>
            <strong>{loading ? "..." : workflowErrors.length}</strong>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Inventory Monitoring</h2>

              <div className="panel-controls">
                <select
                  value={inventoryFilter}
                  onChange={(event) =>
                    setInventoryFilter(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="healthy">Healthy</option>
                  <option value="low_stock">Low Stock</option>
                </select>

                <span>{filteredInventory.length} products</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Reorder</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-cell">
                        No matching inventory records found.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.sku}</td>
                        <td>{item.available_quantity}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.inventory_status === "low_stock"
                                ? "warning"
                                : "success"
                            }`}
                          >
                            {item.inventory_status}
                          </span>
                        </td>
                        <td>
                          {item.reorder_recommended ? "Recommended" : "No"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Workflow Runs</h2>

              <div className="panel-controls">
                <select
                  value={workflowRunFilter}
                  onChange={(event) =>
                    setWorkflowRunFilter(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>

                <span>{filteredWorkflowRuns.length} runs</span>
              </div>
            </div>

            <div className="workflow-list">
              {filteredWorkflowRuns.length === 0 ? (
                <p className="empty">
                  No matching workflow runs found.
                </p>
              ) : (
                filteredWorkflowRuns.map((run) => (
               <div
                  className="workflow-item clickable-row"
                  key={run.id}
                  onClick={() => loadWorkflowRunDetails(run.id)}
                 >
                  <div>
                    <strong>{run.workflow_name}</strong>
                    <small>{run.trigger_type}</small>
                  </div>

                  <span
                    className={`badge ${
                      run.status === "success" ? "success" : "danger"
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Recent Orders</h2>
              <span>{filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Financial</th>
                    <th>Fulfillment</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-cell">
                        No matching orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="clickable-row"
                        onClick={() => loadOrderDetails(order.shopify_order_id)}
                      >
                        <td>{order.shopify_order_id}</td>
                        <td>{order.first_name} {order.last_name}</td>
                        <td>{order.currency} {order.total_price}</td>
                        <td>
                          <span className="badge success">
                            {order.financial_status || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="badge success">
                            {order.fulfillment_status || "Unfulfilled"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Workflow Errors</h2>
              <span>{filteredWorkflowErrors.length} open</span>
            </div>

            <div className="error-list">
              {filteredWorkflowErrors.length === 0 ? (
                <p className="empty">No matching workflow errors found.</p>
              ) : (
                filteredWorkflowErrors.map((error) => (
                  <div
                    className="error-item clickable-row"
                    key={error.id}
                    onClick={() => loadWorkflowErrorDetails(error.id)}
                  >
                    <strong>{error.workflow_name}</strong>
                    <span>{error.error_type}</span>
                    <small>{error.error_message}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Abandoned Checkouts</h2>

              <div className="panel-controls">
                <select
                  value={checkoutFilter}
                  onChange={(event) =>
                    setCheckoutFilter(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="recovered">Recovered</option>
                </select>

                <span>{filteredCheckouts.length} pending</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Attempts</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCheckouts.length === 0 ? (
                    <tr>
                      <td colSpan="5">No abandoned checkouts.</td>
                    </tr>
                  ) : (
                    filteredCheckouts.map((checkout) => (
                     <tr
                       key={checkout.id}
                       className="clickable-row"
                       onClick={() =>
                       loadCheckoutDetails(checkout.shopify_checkout_id)
                      }
                    >
                        <td>
                          {checkout.first_name} {checkout.last_name}
                        </td>
                        <td>{checkout.customer_email}</td>
                        <td>${checkout.total_price}</td>
                        <td>
                          <span className="badge warning">
                            {checkout.recovery_status}
                          </span>
                        </td>
                        <td>{checkout.recovery_attempts}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Refund Requests</h2>

              <div className="panel-controls">
                <select
                  value={refundFilter}
                  onChange={(event) =>
                    setRefundFilter(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="processed">Processed</option>
                </select>

                <span>
                  {filteredRefunds.length}{" "}
                  {filteredRefunds.length === 1 ? "request" : "requests"}
                </span>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {refundRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5">No refund requests.</td>
                    </tr>
                  ) : (
                    filteredRefunds.map((refund) => (
                     <tr
                       key={refund.id}
                       className="clickable-row"
                       onClick={() => loadRefundDetails(refund.id)}
                       >
                        <td>{refund.shopify_order_id}</td>
                        <td>{refund.refund_type}</td>
                        <td>${refund.requested_amount}</td>
                        <td>{refund.reason}</td>
                        <td>
                          <span className="badge warning">
                            {refund.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Customers</h2>
              <span>{filteredCustomers.length} {filteredCustomers.length === 1 ? "customer" : "customers"}</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spend</th>
                    <th>Segment</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="5">No customers found.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
 		     <tr
                        key={customer.id}
                        className="clickable-row"
                        onClick={() => loadCustomerDetails(customer.id)}
                          >
                        <td>
                          {customer.first_name || ""}{" "}
                          {customer.last_name || ""}
                        </td>
                        <td>{customer.email || "N/A"}</td>
                        <td>{customer.total_orders}</td>
                        <td>
                          {customer.total_spend
                            ? `$${customer.total_spend}`
                            : "$0.00"}
                        </td>
                        <td>
                          <span className="badge success">
                            {customer.segment || "Unsegmented"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Products</h2>
              <span>{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Inventory</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5">No products found.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                     <tr
                        key={product.id}
                        className="clickable-row"
                        onClick={() => loadProductDetails(product.shopify_product_id)}
                         >
                        <td>{product.title}</td>
                        <td>{product.sku}</td>
                        <td>
                          {product.price
                            ? `$${product.price}`
                            : "$0.00"}
                        </td>
                        <td>{product.inventory_quantity}</td>
                        <td>
                          <span className="badge success">
                            {product.inventory_status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel automation-actions-panel">
            <div className="panel-header">
              <h2>Automation Actions</h2>

              <div className="panel-controls">
                <select
                  value={automationActionFilter}
                  onChange={(event) =>
                    setAutomationActionFilter(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>

                <span>{filteredAutomationActions.length} actions</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Provider</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAutomationActions.length === 0 ? (
                    <tr>
                      <td colSpan="4">No automation actions.</td>
                    </tr>
                  ) : (
                    filteredAutomationActions.map((action) => (
                     <tr
                       key={action.id}
                       className="clickable-row"
                       onClick={() => loadAutomationActionDetails(action.id)}
                       >
                        <td>{action.action_type}</td>
                        <td>{action.target_type}</td>
                        <td>{action.provider}</td>
                        <td>
                          <span className="badge success">
                            {action.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
{selectedAutomationAction && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedAutomationAction(null)}
  >
    <div
      className="order-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Automation Action Details</h2>
          <p>{selectedAutomationAction.action_type}</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedAutomationAction(null)}
        >
          X
        </button>
      </div>

      {automationActionDetailLoading ? (
        <div className="modal-loading">
          Loading action details...
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <div>
              <span>Action ID</span>
              <strong>{selectedAutomationAction.id}</strong>
            </div>

            <div>
              <span>Workflow Run ID</span>
              <strong>
                {selectedAutomationAction.workflow_run_id}
              </strong>
            </div>

            <div>
              <span>Action Type</span>
              <strong>
                {selectedAutomationAction.action_type}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {selectedAutomationAction.status}
              </strong>
            </div>

            <div>
              <span>Target Type</span>
              <strong>
                {selectedAutomationAction.target_type}
              </strong>
            </div>

            <div>
              <span>Target ID</span>
              <strong>
                {selectedAutomationAction.target_id}
              </strong>
            </div>

            <div>
              <span>Provider</span>
              <strong>
                {selectedAutomationAction.provider || "N/A"}
              </strong>
            </div>

            <div>
              <span>Error</span>
              <strong>
                {selectedAutomationAction.error_message || "None"}
              </strong>
            </div>
          </div>

          <div className="financial-summary">
            <div>
              <span>Request Data</span>
              <strong>
                {selectedAutomationAction.request_data
                  ? JSON.stringify(
                      selectedAutomationAction.request_data
                    )
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Response Data</span>
              <strong>
                {selectedAutomationAction.response_data
                  ? JSON.stringify(
                      selectedAutomationAction.response_data
                    )
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Created At</span>
              <strong>
                {selectedAutomationAction.created_at
                  ? new Date(
                      selectedAutomationAction.created_at
                    ).toLocaleString()
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Completed At</span>
              <strong>
                {selectedAutomationAction.completed_at
                  ? new Date(
                      selectedAutomationAction.completed_at
                    ).toLocaleString()
                  : "Not completed"}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
{selectedWorkflowError && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedWorkflowError(null)}
  >
    <div
      className="order-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Workflow Error Details</h2>
          <p>{selectedWorkflowError.workflow_name}</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedWorkflowError(null)}
        >
          X
        </button>
      </div>

      {workflowErrorDetailLoading ? (
        <div className="modal-loading">
          Loading error details...
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <div>
              <span>Error ID</span>
              <strong>{selectedWorkflowError.id}</strong>
            </div>

            <div>
              <span>Workflow Run ID</span>
              <strong>
                {selectedWorkflowError.workflow_run_id}
              </strong>
            </div>

            <div>
              <span>Workflow</span>
              <strong>
                {selectedWorkflowError.workflow_name}
              </strong>
            </div>

            <div>
              <span>Error Type</span>
              <strong>
                {selectedWorkflowError.error_type}
              </strong>
            </div>

            <div>
              <span>Node</span>
              <strong>
                {selectedWorkflowError.node_name || "N/A"}
              </strong>
            </div>

            <div>
              <span>Retry Count</span>
              <strong>
                {selectedWorkflowError.retry_count}
              </strong>
            </div>

            <div>
              <span>Retryable</span>
              <strong>
                {selectedWorkflowError.error_data?.retryable
                  ? "Yes"
                  : "No"}
              </strong>
            </div>

            <div>
              <span>Resolved</span>
              <strong>
                {selectedWorkflowError.resolved
                  ? "Yes"
                  : "No"}
              </strong>
            </div>
          </div>

          <div className="financial-summary">
            <div>
              <span>Error Message</span>
              <strong>
                {selectedWorkflowError.error_message}
              </strong>
            </div>

            <div>
              <span>Provider</span>
              <strong>
                {selectedWorkflowError.error_data?.provider ||
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>Created At</span>
              <strong>
                {selectedWorkflowError.created_at
                  ? new Date(
                      selectedWorkflowError.created_at
                    ).toLocaleString()
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Resolved At</span>
              <strong>
                {selectedWorkflowError.resolved_at
                  ? new Date(
                      selectedWorkflowError.resolved_at
                    ).toLocaleString()
                  : "Not resolved"}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
{selectedWorkflowRun && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedWorkflowRun(null)}
  >
    <div
      className="order-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Workflow Run Details</h2>
          <p>{selectedWorkflowRun.workflow_name}</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedWorkflowRun(null)}
        >
          X
        </button>
      </div>

      {workflowRunDetailLoading ? (
        <div className="modal-loading">
          Loading workflow details...
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <div>
              <span>Run ID</span>
              <strong>{selectedWorkflowRun.id}</strong>
            </div>

            <div>
              <span>Workflow</span>
              <strong>
                {selectedWorkflowRun.workflow_name}
              </strong>
            </div>

            <div>
              <span>Trigger Type</span>
              <strong>
                {selectedWorkflowRun.trigger_type}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {selectedWorkflowRun.status}
              </strong>
            </div>

            <div>
              <span>Started At</span>
              <strong>
                {selectedWorkflowRun.started_at
                  ? new Date(
                      selectedWorkflowRun.started_at
                    ).toLocaleString()
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Finished At</span>
              <strong>
                {selectedWorkflowRun.finished_at
                  ? new Date(
                      selectedWorkflowRun.finished_at
                    ).toLocaleString()
                  : "Still running"}
              </strong>
            </div>

            <div>
              <span>Duration</span>
              <strong>
                {selectedWorkflowRun.started_at &&
                selectedWorkflowRun.finished_at
                  ? `${Math.round(
                      (new Date(
                        selectedWorkflowRun.finished_at
                      ) -
                        new Date(
                          selectedWorkflowRun.started_at
                        )) /
                        1000
                    )} seconds`
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Execution Result</span>
              <strong>
                {selectedWorkflowRun.status === "success"
                  ? "Completed successfully"
                  : "Execution failed"}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
{selectedRefund && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedRefund(null)}
  >
    <div
      className="order-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Refund Request Details</h2>
          <p>
            {selectedRefund.shopify_order_id}
          </p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedRefund(null)}
        >
          X
        </button>
      </div>

      {refundDetailLoading ? (
        <div className="modal-loading">
          Loading refund details...
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <div>
              <span>Refund Request ID</span>
              <strong>{selectedRefund.id}</strong>
            </div>

            <div>
              <span>Shopify Order ID</span>
              <strong>
                {selectedRefund.shopify_order_id}
              </strong>
            </div>

            <div>
              <span>Order ID</span>
              <strong>
                {selectedRefund.order_id}
              </strong>
            </div>

            <div>
              <span>Refund Type</span>
              <strong>
                {selectedRefund.refund_type}
              </strong>
            </div>

            <div>
              <span>Requested Amount</span>
              <strong>
                ${selectedRefund.requested_amount}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {selectedRefund.status}
              </strong>
            </div>

            <div>
              <span>Requested By</span>
              <strong>
                {selectedRefund.requested_by || "N/A"}
              </strong>
            </div>

            <div>
              <span>Approved By</span>
              <strong>
                {selectedRefund.approved_by || "Not approved"}
              </strong>
            </div>
          </div>

          <div className="financial-summary">
            <div>
              <span>Reason</span>
              <strong>
                {selectedRefund.reason || "N/A"}
              </strong>
            </div>

            <div>
              <span>Approval Required</span>
              <strong>
                {selectedRefund.metadata?.approval_required
                  ? "Yes"
                  : "No"}
              </strong>
            </div>

            <div>
              <span>Requested At</span>
              <strong>
                {selectedRefund.requested_at
                  ? new Date(
                      selectedRefund.requested_at
                    ).toLocaleString()
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>Approved At</span>
              <strong>
                {selectedRefund.approved_at
                  ? new Date(
                      selectedRefund.approved_at
                    ).toLocaleString()
                  : "Not approved"}
              </strong>
            </div>
          </div>

          <div className="order-dates">
            <div>
              <span>Processed At</span>
              <strong>
                {selectedRefund.processed_at
                  ? new Date(
                      selectedRefund.processed_at
                    ).toLocaleString()
                  : "Not processed"}
              </strong>
            </div>

            <div>
              <span>Source</span>
              <strong>
                {selectedRefund.metadata?.source || "N/A"}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
{selectedCheckout && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedCheckout(null)}
  >
    <div
      className="order-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Abandoned Checkout Details</h2>
          <p>{selectedCheckout.shopify_checkout_id}</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedCheckout(null)}
        >
          X
        </button>
      </div>

      {checkoutDetailLoading ? (
        <div className="modal-loading">
          Loading checkout details...
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <div>
              <span>Checkout ID</span>
              <strong>
                {selectedCheckout.shopify_checkout_id}
              </strong>
            </div>

            <div>
              <span>Customer</span>
              <strong>
                {selectedCheckout.first_name || ""}{" "}
                {selectedCheckout.last_name || ""}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {selectedCheckout.customer_email || "N/A"}
              </strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {selectedCheckout.phone || "N/A"}
              </strong>
            </div>

            <div>
              <span>Total</span>
              <strong>
                ${selectedCheckout.total_price}
              </strong>
            </div>

            <div>
              <span>Recovery Status</span>
              <strong>
                {selectedCheckout.recovery_status}
              </strong>
            </div>

            <div>
              <span>Recovery Attempts</span>
              <strong>
                {selectedCheckout.recovery_attempts}
              </strong>
            </div>

            <div>
              <span>Customer ID</span>
              <strong>
                {selectedCheckout.shopify_customer_id}
              </strong>
            </div>
          </div>

          <div className="financial-summary">
            <div>
              <span>Last Recovery</span>
              <strong>
                {selectedCheckout.last_recovery_at
                  ? new Date(
                      selectedCheckout.last_recovery_at
                    ).toLocaleString()
                  : "Never"}
              </strong>
            </div>

            <div>
              <span>Recovered At</span>
              <strong>
                {selectedCheckout.recovered_at
                  ? new Date(
                      selectedCheckout.recovered_at
                    ).toLocaleString()
                  : "Not recovered"}
              </strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {new Date(
                  selectedCheckout.created_at
                ).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Updated</span>
              <strong>
                {new Date(
                  selectedCheckout.updated_at
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
{selectedProduct && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedProduct(null)}
  >
    <div
      className="order-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Product Details</h2>
          <p>{selectedProduct.title}</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedProduct(null)}
        >
          X
        </button>
      </div>

      {productDetailLoading ? (
        <div className="modal-loading">
          Loading product details...
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <div>
              <span>Product ID</span>
              <strong>{selectedProduct.id}</strong>
            </div>

            <div>
              <span>Shopify Product ID</span>
              <strong>
                {selectedProduct.shopify_product_id}
              </strong>
            </div>

            <div>
              <span>Variant ID</span>
              <strong>
                {selectedProduct.shopify_variant_id || "N/A"}
              </strong>
            </div>

            <div>
              <span>Product Name</span>
              <strong>{selectedProduct.title}</strong>
            </div>

            <div>
              <span>SKU</span>
              <strong>{selectedProduct.sku}</strong>
            </div>

            <div>
              <span>Price</span>
              <strong>${selectedProduct.price}</strong>
            </div>

            <div>
              <span>Inventory Quantity</span>
              <strong>
                {selectedProduct.inventory_quantity}
              </strong>
            </div>

            <div>
              <span>Inventory Status</span>
              <strong>
                {selectedProduct.inventory_status || "N/A"}
              </strong>
            </div>
          </div>

          <div className="financial-summary">
            <div>
              <span>Reorder Threshold</span>
              <strong>
                {selectedProduct.reorder_threshold}
              </strong>
            </div>

            <div>
              <span>Reorder Quantity</span>
              <strong>
                {selectedProduct.reorder_quantity}
              </strong>
            </div>

            <div>
              <span>Current Inventory</span>
              <strong>
                {selectedProduct.inventory_quantity}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {selectedProduct.inventory_status || "Active"}
              </strong>
            </div>
          </div>

          <div className="order-dates">
            <div>
              <span>Created</span>
              <strong>
                {new Date(
                  selectedProduct.created_at
                ).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Last Updated</span>
              <strong>
                {new Date(
                  selectedProduct.updated_at
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
{selectedCustomer && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedCustomer(null)}
  >
    <div
      className="order-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Customer Details</h2>
          <p>
            {selectedCustomer.first_name || ""}{" "}
            {selectedCustomer.last_name || ""}
          </p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedCustomer(null)}
        >
          X
        </button>
      </div>

      {customerDetailLoading ? (
        <div className="modal-loading">
          Loading customer details...
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <div>
              <span>Customer ID</span>
              <strong>{selectedCustomer.id}</strong>
            </div>

            <div>
              <span>Shopify Customer ID</span>
              <strong>
                {selectedCustomer.shopify_customer_id}
              </strong>
            </div>

            <div>
              <span>First Name</span>
              <strong>
                {selectedCustomer.first_name || "N/A"}
              </strong>
            </div>

            <div>
              <span>Last Name</span>
              <strong>
                {selectedCustomer.last_name || "N/A"}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {selectedCustomer.email || "N/A"}
              </strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {selectedCustomer.phone || "N/A"}
              </strong>
            </div>

            <div>
              <span>Segment</span>
              <strong>
                {selectedCustomer.segment || "Unsegmented"}
              </strong>
            </div>

            <div>
              <span>Total Orders</span>
              <strong>
                {selectedCustomer.total_orders}
              </strong>
            </div>
          </div>

          <div className="financial-summary">
            <div>
              <span>Total Spend</span>
              <strong>
                ${selectedCustomer.total_spend}
              </strong>
            </div>

            <div>
              <span>Average Order Value</span>
              <strong>
                ${selectedCustomer.average_order_value}
              </strong>
            </div>

            <div>
              <span>Last Purchase</span>
              <strong>
                {selectedCustomer.last_purchase_at
                  ? new Date(
                      selectedCustomer.last_purchase_at
                    ).toLocaleString()
                  : "No purchase"}
              </strong>
            </div>

            <div>
              <span>Segment</span>
              <strong>
                {selectedCustomer.segment || "Unsegmented"}
              </strong>
            </div>
          </div>

          <div className="order-dates">
            <div>
              <span>Customer Created</span>
              <strong>
                {new Date(
                  selectedCustomer.created_at
                ).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Last Updated</span>
              <strong>
                {new Date(
                  selectedCustomer.updated_at
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
      {selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Order Details</h2>
                <p>
                  {selectedOrder.order?.shopify_order_number ||
                    selectedOrder.order?.shopify_order_id}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                X
              </button>
            </div>

            {orderDetailLoading ? (
              <div className="modal-loading">
                Loading order details...
              </div>
            ) : (
              <>
                <div className="detail-grid">
                  <div>
                    <span>Order ID</span>
                    <strong>
                      {selectedOrder.order?.shopify_order_id}
                    </strong>
                  </div>

                  <div>
                    <span>Order Number</span>
                    <strong>
                      {selectedOrder.order?.shopify_order_number}
                    </strong>
                  </div>

                  <div>
                    <span>Customer</span>
                    <strong>
                      {selectedOrder.order?.first_name || ""}{" "}
                      {selectedOrder.order?.last_name || ""}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {selectedOrder.order?.email || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Financial Status</span>
                    <strong>
                      {selectedOrder.order?.financial_status || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Fulfillment Status</span>
                    <strong>
                      {selectedOrder.order?.fulfillment_status ||
                        "Unfulfilled"}
                    </strong>
                  </div>

                  <div>
                    <span>Currency</span>
                    <strong>
                      {selectedOrder.order?.currency}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      {selectedOrder.order?.currency}{" "}
                      {selectedOrder.order?.total_price}
                    </strong>
                  </div>
                </div>

                <div className="financial-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {selectedOrder.order?.subtotal_price}
                    </strong>
                  </div>

                  <div>
                    <span>Tax</span>
                    <strong>
                      {selectedOrder.order?.total_tax}
                    </strong>
                  </div>

                  <div>
                    <span>Shipping</span>
                    <strong>
                      {selectedOrder.order?.total_shipping}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      {selectedOrder.order?.total_price}
                    </strong>
                  </div>
                </div>

                <div className="order-items-section">
                  <div className="panel-header">
                    <h3>Order Items</h3>
                    <span>
                      {selectedOrder.item_count || 0} items
                    </span>
                  </div>

                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Variant</th>
                          <th>SKU</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(selectedOrder.items || []).length === 0 ? (
                          <tr>
                            <td colSpan="6">
                              No order items found.
                            </td>
                          </tr>
                        ) : (
                          selectedOrder.items.map((item) => (
                            <tr key={item.id}>
                              <td>{item.product_title}</td>
                              <td>
                                {item.variant_title || "Default"}
                              </td>
                              <td>{item.sku || "N/A"}</td>
                              <td>{item.quantity}</td>
                              <td>{item.unit_price}</td>
                              <td>{item.total_price}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="order-dates">
                  <div>
                    <span>Created</span>
                    <strong>
                      {selectedOrder.order?.created_at
                        ? new Date(
                            selectedOrder.order.created_at
                          ).toLocaleString()
                        : "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Updated</span>
                    <strong>
                      {selectedOrder.order?.updated_at
                        ? new Date(
                            selectedOrder.order.updated_at
                          ).toLocaleString()
                        : "N/A"}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

export default App;

































