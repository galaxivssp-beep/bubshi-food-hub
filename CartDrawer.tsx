import React, { useState } from 'react';
import { useCart, WHATSAPP_PHONE } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { OrderDetails } from '../types';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, MapPin, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalCount, totalAmount, processOrderAndWhatsApp } = useCart();
  const { lang, t } = useLanguage();
  const isMl = lang === 'ml';

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderType, setOrderType] = useState<'takeaway' | 'delivery' | 'dinein'>('takeaway');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      alert(isMl ? 'ദയവായി നിങ്ങളുടെ പേര് നൽകുക.' : 'Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);
    setSavedOrderId(null);

    try {
      const details: OrderDetails = {
        customerName,
        phoneNumber: phoneNumber.trim() || 'WhatsApp Customer',
        orderType,
        deliveryAddress,
        notes,
      };

      const result = await processOrderAndWhatsApp(details, lang);
      setSavedOrderId(result.orderId);
      // Clean up cart after verified save
      clearCart();
    } catch (err: unknown) {
      console.error('Order placement error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setOrderError(
        isMl
          ? `ഓർഡർ ഫയർസ്റ്റോറിൽ സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല: ${msg}`
          : `Failed to save order to Firestore: ${msg}. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-amber-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-extrabold text-base leading-tight">
                {t('cart')} ({totalCount} {totalCount === 1 ? t('item') : t('items')})
              </h2>
              <span className="text-[11px] text-amber-200">
                BUBSHI FOOD HUB • WhatsApp: 9975587563
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-amber-200 hover:text-white p-1 text-xs flex items-center gap-1 transition-colors"
                title={t('clearCart')}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('clearCart')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-3xl mb-4 border border-amber-200">
              🐟
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {t('emptyCartTitle')}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xs mb-6">
              {t('emptyCartDesc')}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              {t('browseMenu')}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* List of items */}
            <div className="space-y-3">
              {cart.map((item) => {
                const title = isMl && item.food.nameMl ? item.food.nameMl : item.food.name;
                const itemTotal = item.food.price * item.quantity;

                return (
                  <div
                    key={item.food.id}
                    className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <img
                      src={item.food.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'}
                      alt={item.food.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-neutral-200"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                        {title}
                      </h4>
                      <p className="text-xs font-semibold text-amber-900 mt-0.5">
                        ₹{item.food.price} each
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-1.5 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-amber-800"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-amber-800"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-extrabold text-sm text-gray-950">
                          ₹{itemTotal}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.food.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleCheckout} className="space-y-3 pt-2 border-t border-gray-200">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                {t('customerDetails')}
              </h3>

              {/* Order Type Tabs */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  {t('orderType')}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                      orderType === 'takeaway'
                        ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                    }`}
                  >
                    📦 {t('takeaway')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                      orderType === 'delivery'
                        ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                    }`}
                  >
                    🛵 {t('delivery')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('dinein')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                      orderType === 'dinein'
                        ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                    }`}
                  >
                    🍽️ {t('dinein')}
                  </button>
                </div>
              </div>

              {/* Name input */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-amber-800" />
                  <span>{t('fullName')} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isMl ? 'നിങ്ങളുടെ പേര് നൽകുക' : 'e.g. Rahul / Anoop'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              {/* Phone input */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-800" />
                  <span>{t('phoneNumber')}</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={isMl ? '10 അക്ക മൊബൈൽ നമ്പർ' : '10-digit Mobile / WhatsApp'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              {/* Delivery Address (if delivery) */}
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-800" />
                    <span>{t('deliveryAddress')} *</span>
                  </label>
                  <textarea
                    rows={2}
                    required={orderType === 'delivery'}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={t('deliveryAddressPlaceholder')}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>
              )}

              {/* Special notes */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-amber-800" />
                  <span>{isMl ? 'നിർദ്ദേശങ്ങൾ (ഓപ്ഷണൽ)' : 'Special Instructions (Optional)'}</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              {/* Order total card */}
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 space-y-1.5 mt-2">
                <div className="flex justify-between text-xs text-gray-700">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-800 font-medium">
                  <span>{t('deliveryFee')}</span>
                  <span>{isMl ? 'ലൊക്കേഷൻ അനുസരിച്ച്' : 'As per distance'}</span>
                </div>
                <div className="border-t border-amber-200 pt-1.5 flex justify-between text-sm font-extrabold text-amber-950">
                  <span>{t('totalAmount')}</span>
                  <span className="text-base text-amber-900">₹{totalAmount}</span>
                </div>
              </div>

              {/* Error Banner */}
              {orderError && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Order Save Error</span>
                  </div>
                  <p>{orderError}</p>
                </div>
              )}

              {/* Order Confirmation Banner */}
              {savedOrderId && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Order Confirmed in Firestore!</span>
                  </div>
                  <p>Order ID: <strong className="font-mono">{savedOrderId}</strong></p>
                  <p className="text-[11px] text-emerald-700">Opening WhatsApp with your receipt...</p>
                </div>
              )}

              {/* WhatsApp Checkout Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-98 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isMl ? 'ഓർഡർ സേവ് ചെയ്യുന്നു...' : 'Saving Order to Firestore...'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">💬</span>
                    <span>{t('orderOnWhatsApp')}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center leading-tight">
                {t('orderViaWhatsAppNotice')}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
