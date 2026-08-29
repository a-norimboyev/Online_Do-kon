import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  User,
  Phone,
  ShieldCheck,
  Check,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    regions,
    createOrder,
    activePromo
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [selectedRegionId, setSelectedRegionId] = useState('tashkent-city');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [deliveryType, setDeliveryType] = useState('standard'); // 'standard' | 'express' | 'pickup'
  const [paymentMethod, setPaymentMethod] = useState('Payme'); // 'Payme' | 'Click' | 'Uzum Pay' | 'Naqd pul (Yetkazilganda)'

  if (!isCheckoutOpen || cart.length === 0) return null;

  const currentRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  let deliveryPrice = currentRegion.deliveryPrice;
  if (deliveryType === 'express') {
    deliveryPrice += 20000;
  } else if (deliveryType === 'pickup') {
    deliveryPrice = 0;
  }

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + deliveryPrice);

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!customerName.trim() || phone.length < 9) {
      alert("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!");
      return;
    }

    createOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      region: currentRegion.name,
      address: deliveryType === 'pickup' ? "Markaziy tarqatish punkti (Toshkent, Amir Temur ko'chasi 14)" : address.trim(),
      comment: comment.trim(),
      items: cart,
      deliveryType,
      deliveryPrice,
      paymentMethod,
      subtotal: cartSubtotal,
      discountAmount,
      promoCode: activePromo ? activePromo.code : null,
      total: finalTotal
    });

    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Buyurtmani rasmiylashtirish va Yetkazib berish
              </h2>
              <p className="text-xs text-slate-400">
                Ma'lumotlaringizni to'ldiring va buyurtmani tasdiqlang
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>1. Xaridor ma'lumotlari</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  To'liq ismingiz *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masalan: Sardor Aliyev"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon raqamingiz *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery options & Address */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>2. Yetkazib berish manzili va xizmati</span>
            </h3>

            {/* Delivery type radio tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setDeliveryType('standard')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  deliveryType === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Standart kuryer
                  </span>
                  {deliveryType === 'standard' && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">{currentRegion.deliveryTime}</p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  +{currentRegion.deliveryPrice.toLocaleString()} so'm
                </p>
              </label>

              <label
                onClick={() => setDeliveryType('express')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  deliveryType === 'express'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tezkor (Express)
                  </span>
                  {deliveryType === 'express' && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">3 soat ichida yetkazish</p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  +{(currentRegion.deliveryPrice + 20000).toLocaleString()} so'm
                </p>
              </label>

              <label
                onClick={() => setDeliveryType('pickup')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Olib ketish punkti
                  </span>
                  {deliveryType === 'pickup' && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">Tarqatish markazidan</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  Bepul
                </p>
              </label>
            </div>

            {deliveryType !== 'pickup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Viloyat / Shahar
                  </label>
                  <select
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
                  >
                    {regions.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.name} (+{reg.deliveryPrice.toLocaleString()} so'm)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Aniq manzil (Ko'cha, uy, xonadon) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masalan: Navoiy ko'chasi 15-uy, 4-xonadon"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kuryer uchun qo'shimcha izoh (ixtiyoriy)
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Masalan: Domofon kodi #45, 2-podyezd"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>3. To'lov usulini tanlang</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Payme', 'Click', 'Uzum Pay', 'Naqd pul (Yetkazilganda)'].map((method) => (
                <label
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === method
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">{method}</span>
                  {paymentMethod === method && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary Calculation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Mahsulotlar ({cart.reduce((c, i) => c + i.quantity, 0)} dona):</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {cartSubtotal.toLocaleString()} so'm
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Chegirma ({activePromo?.code}):</span>
                <span>-{discountAmount.toLocaleString()} so'm</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Yetkazib berish xizmati:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {deliveryPrice > 0 ? `${deliveryPrice.toLocaleString()} so'm` : "Bepul"}
              </span>
            </div>

            <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Yakuniy to'lov:</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {finalTotal.toLocaleString()} so'm
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Buyurtmani tasdiqlash va rasmiylashtirish</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Buyurtma tasdiqlangandan so'ng kuryerimiz 10 daqiqa ichida siz bilan bog'lanadi.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
