import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, AlertCircle, RefreshCw } from 'lucide-react';

export default function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.cancelOrder(id);
      if (res.success) {
        alert('Order has been cancelled successfully!');
        // Reload
        const reloadRes = await api.getMyOrders();
        if (reloadRes.success) setOrders(reloadRes.data);
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-10 bg-charcoal w-1/4 rounded"></div>
        {[1, 2].map(i => (
          <div key={i} className="h-44 bg-charcoal rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">My Purchase Logs</h1>
        <p className="text-xs text-gray-400 mt-1">Review, track transit updates, or manage existing invoices.</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-gray-800 space-y-4">
          <div className="flex justify-center text-gray-600">
            <Package size={48} />
          </div>
          <p className="text-sm text-gray-400">You haven't placed any orders yet.</p>
          <Link 
            to="/shop" 
            className="inline-block gold-gradient-bg text-charcoal-dark font-bold px-6 py-2.5 rounded-full text-xs hover:scale-105 transition-transform"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
              
              {/* Order Info Bar */}
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-850 pb-4 text-xs">
                <div>
                  <span className="text-gray-500 block">Order ID</span>
                  <span className="text-white font-semibold">#{order.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Placed On</span>
                  <span className="text-white font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Amount</span>
                  <span className="text-gold font-bold">₹{parseFloat(order.totalAmount).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Tracking Code</span>
                  <span className="text-white font-mono">{order.trackingNumber || 'Awaiting dispatch'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Transit Status</span>
                  <span className={`font-semibold uppercase ${order.orderStatus === 'Delivered' ? 'text-green-500' : order.orderStatus === 'Cancelled' ? 'text-red-500' : 'text-amber-500'}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Status Visual Tracking Progress Bar */}
              {order.orderStatus !== 'Cancelled' && (
                <div className="py-2">
                  <div className="relative flex justify-between text-[10px] font-semibold uppercase text-gray-500">
                    {['Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                      const statuses = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
                      const activeIdx = statuses.indexOf(order.orderStatus);
                      const stepIdx = statuses.indexOf(step);
                      const isDone = activeIdx >= stepIdx;

                      return (
                        <div key={step} className="flex flex-col items-center z-10">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] border font-bold ${isDone ? 'bg-gold text-charcoal-dark border-gold' : 'bg-charcoal text-gray-600 border-gray-800'}`}>
                            {idx + 1}
                          </span>
                          <span className={`mt-1.5 ${isDone ? 'text-gold' : 'text-gray-600'}`}>{step}</span>
                        </div>
                      );
                    })}
                    <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-gray-800 z-0"></div>
                  </div>
                </div>
              )}

              {/* Order Items Details list */}
              <div className="space-y-3 pt-2">
                {order.OrderItems && order.OrderItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.Product ? item.Product.images[0] : '/assets/royal-red-bangles.jpg'} 
                        alt="Product item" 
                        className="w-10 h-10 object-cover rounded-md border border-gray-850" 
                      />
                      <div>
                        <p className="text-white font-medium">{item.Product ? item.Product.name : 'Hallmarked Design'}</p>
                        <p className="text-[10px] text-gray-500">Purity: {item.Product ? item.Product.purity : '22K'} | Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-white">₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Cancel order block if confirmed or packed */}
              {(order.orderStatus === 'Confirmed' || order.orderStatus === 'Packed') && (
                <div className="flex justify-end pt-3 border-t border-gray-850">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 focus:outline-none border border-red-500/20 px-4 py-1.5 rounded-lg hover:bg-red-500/5 transition-colors"
                  >
                    <AlertCircle size={12} /> Cancel Order
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
