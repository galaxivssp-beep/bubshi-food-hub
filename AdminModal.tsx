import React, { useState, useEffect } from 'react';
import { FoodItem, FirebaseConnectionInfo, FoodOrder, OrderStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  addFoodToFirestore,
  updateFoodInFirestore,
  deleteFoodFromFirestore,
  seedStationKadavuMenu,
  TARGET_PROJECT_ID,
  FOODS_COLLECTION,
  ORDERS_COLLECTION,
  ADMIN_EMAIL,
  auth,
  signInAdminWithGoogle,
  signOutAdmin,
  onAdminAuthStateChanged,
  subscribeOrders,
  updateOrderStatus,
  deleteOrderFromFirestore,
} from '../services/firebase';
import { User } from 'firebase/auth';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Database,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  ShoppingBag,
  Clock,
  Phone,
  User as UserIcon,
  MapPin,
  CheckCircle2,
  Filter,
  LogOut,
  Utensils,
  ChevronDown,
} from 'lucide-react';
import { CATEGORIES } from '../data/defaultFoods';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  connectionInfo: FirebaseConnectionInfo;
  onRetestConnection: () => void;
  onOpenSetupGuide: () => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Completed',
  'Cancelled',
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  foods,
  connectionInfo,
  onRetestConnection,
  onOpenSetupGuide,
}) => {
  const { lang, t } = useLanguage();
  const isMl = lang === 'ml';

  // Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(() => {
    return auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'orders' | 'menu'
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'menu'>('orders');

  // Orders State
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Menu Form State for Add / Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameMl, setNameMl] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Fish Fry & Specials');
  const [description, setDescription] = useState('');
  const [descriptionMl, setDescriptionMl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAdminAuthStateChanged((user, isAdmin) => {
      setCurrentUser(user);
      setIsAuthorizedAdmin(isAdmin);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Orders collection when authenticated
  useEffect(() => {
    if (!isOpen || !isAuthorizedAdmin) return;

    setOrdersLoading(true);
    const unsubscribe = subscribeOrders(
      (data) => {
        setOrders(data);
        setOrdersLoading(false);
        setOrdersError(null);
      },
      (err) => {
        setOrdersError(err);
        setOrdersLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, isAuthorizedAdmin]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await signInAdminWithGoogle();
      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setAuthError(
          `Logged in as ${user.email}, but only ${ADMIN_EMAIL} is authorized to access administrative management.`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAuthError(`Sign-in failed: ${msg}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setCurrentUser(null);
    setIsAuthorizedAdmin(false);
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setNameMl('');
    setPrice('');
    setCategory('Fish Fry & Specials');
    setDescription('');
    setDescriptionMl('');
    setImageUrl('');
    setIsAvailable(true);
    setIsSpecial(false);
    setErrorMessage(null);
  };

  const startEdit = (food: FoodItem) => {
    setIsEditing(true);
    setEditId(food.id);
    setName(food.name);
    setNameMl(food.nameMl || '');
    setPrice(food.price.toString());
    setCategory(food.category || 'Fish Fry & Specials');
    setDescription(food.description || '');
    setDescriptionMl(food.descriptionMl || '');
    setImageUrl(food.imageUrl || '');
    setIsAvailable(food.isAvailable !== false);
    setIsSpecial(Boolean(food.isSpecial));
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setErrorMessage(isMl ? 'പേരും വിലയും നിർബന്ധമാണ്.' : 'Name and price are required.');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage(isMl ? 'ശരിയായ വില നൽകുക.' : 'Please enter a valid price.');
      return;
    }

    setActionLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const payload: Omit<FoodItem, 'id'> = {
        name: name.trim(),
        nameMl: nameMl.trim() || undefined,
        price: numPrice,
        category: category || 'Fish Fry & Specials',
        description: description.trim() || undefined,
        descriptionMl: descriptionMl.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        isAvailable,
        isSpecial,
      };

      if (isEditing && editId) {
        await updateFoodInFirestore(editId, payload);
        setStatusMessage(isMl ? 'വിഭവം മാറ്റിയെഴുതി!' : 'Food item updated in Firestore successfully!');
      } else {
        await addFoodToFirestore(payload);
        setStatusMessage(isMl ? 'പുതിയ വിഭവം ഫയർസ്റ്റോറിൽ ചേർത്തു!' : 'Food item added to Firestore collection "foods"!');
      }

      resetForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Failed to save: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    const confirmText = isMl
      ? `"${itemName}" എന്ന വിഭവം ഡിലീറ്റ് ചെയ്യണോ?`
      : `Delete "${itemName}" from Firestore?`;
    if (!window.confirm(confirmText)) return;

    setActionLoading(true);
    try {
      await deleteFoodFromFirestore(id);
      setStatusMessage(isMl ? 'വിഭവം ഡിലീറ്റ് ചെയ്തു.' : 'Item deleted from Firestore.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Delete error: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAvailable = async (food: FoodItem) => {
    try {
      await updateFoodInFirestore(food.id, {
        isAvailable: !food.isAvailable,
      });
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleToggleSpecial = async (food: FoodItem) => {
    try {
      await updateFoodInFirestore(food.id, {
        isSpecial: !food.isSpecial,
      });
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderDocId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderDocId);
    try {
      await updateOrderStatus(orderDocId, newStatus);
    } catch (err: unknown) {
      console.error('Failed to update status:', err);
      alert('Failed to update status: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderDocId: string, orderId: string) => {
    if (!window.confirm(`Delete order ${orderId} permanently from Firestore?`)) return;
    try {
      await deleteOrderFromFirestore(orderDocId);
    } catch (err: unknown) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSeedMenu = async () => {
    const confirmMsg = isMl
      ? 'സ്റ്റേഷൻ കടവ് പ്രഭാത മീൻ വിഭവങ്ങൾ ഫയർസ്റ്റോറിലേക്ക് ചേർക്കണോ?'
      : 'Seed Station Kadavu specialty food items into your Firestore "foods" collection?';
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const count = await seedStationKadavuMenu();
      setStatusMessage(
        isMl
          ? `${count} വിഭവങ്ങൾ ഫയർസ്റ്റോറിലേക്ക് വിജയകരമായി ചേർത്തു!`
          : `Successfully seeded ${count} dishes to Firestore bubshi-food-hub-5b8ee!`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Failed to seed: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Preparing':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Ready':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-amber-950 to-neutral-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  BUBSHI FOOD HUB — {t('adminPortal')}
                </h2>
                {isAuthorizedAdmin && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Authorized
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Firebase Project: <span className="font-mono">{TARGET_PROJECT_ID}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-xs text-amber-200 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                title="Sign out of Firebase Auth"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {!isAuthorizedAdmin ? (
            /* REQUIREMENT 2: Secure Firebase Authentication */
            <div className="max-w-md mx-auto py-10 text-center space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-9 h-9" />
              </div>

              <div>
                <h3 className="font-extrabold text-xl text-gray-950">
                  {t('adminLogin')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-sm mx-auto">
                  Sign in with your authorized administrator Google account to access customer orders and menu controls.
                </p>
                <div className="mt-2 text-xs font-mono bg-gray-100 text-gray-800 p-2 rounded-xl inline-block">
                  Authorized Admin: <strong className="text-amber-900">{ADMIN_EMAIL}</strong>
                </div>
              </div>

              {currentUser && !isAuthorizedAdmin && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs text-left">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Unauthorized Account</span>
                  </div>
                  <p className="mt-0.5">
                    You are currently signed in as <strong>{currentUser.email}</strong>. This account does not have administrator privileges. Please switch to <strong>{ADMIN_EMAIL}</strong>.
                  </p>
                </div>
              )}

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl text-xs text-left">
                  <span className="font-bold">Error: </span>
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full max-w-xs mx-auto py-3 px-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-gray-300 shadow-md flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {authLoading ? (
                  <span className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>

              <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500">
                Protected by Firebase Authentication & restrictive Firestore Rules
              </div>
            </div>
          ) : (
            /* Authenticated Admin Management Interface */
            <>
              {/* Authenticated user badge and tabs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-900 text-white p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-emerald-400 block leading-tight">
                      Authenticated Administrator
                    </span>
                    <span className="text-[11px] text-neutral-300 font-mono truncate block">
                      {currentUser?.email}
                    </span>
                  </div>
                </div>

                {/* Sub-tabs: Orders vs Menu */}
                <div className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeAdminTab === 'orders'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Orders ({orders.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('menu')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeAdminTab === 'menu'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Menu Items ({foods.length})</span>
                  </button>
                </div>
              </div>

              {/* Status / Error Alerts */}
              {statusMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs flex items-center justify-between">
                  <span className="font-medium">{statusMessage}</span>
                  <button onClick={() => setStatusMessage(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl text-xs flex items-center justify-between">
                  <span className="font-medium">{errorMessage}</span>
                  <button onClick={() => setErrorMessage(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TAB 1: ORDER MANAGEMENT */}
              {activeAdminTab === 'orders' && (
                <div className="space-y-4">
                  {/* Orders filter & header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                        <span>Customer Order History</span>
                        <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                          Live from Firestore
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Collection: <span className="font-mono text-gray-700">{ORDERS_COLLECTION}</span> • Persistent across page reloads
                      </p>
                    </div>

                    {/* Status filter chips */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                      {['all', ...ORDER_STATUSES].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                            statusFilter === st
                              ? 'bg-amber-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {st === 'all' ? 'All Orders' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="py-12 text-center text-gray-500 text-xs flex flex-col items-center gap-2">
                      <span className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                      <span>Loading orders from Firestore...</span>
                    </div>
                  ) : ordersError ? (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs">
                      <strong>Failed to load orders:</strong> {ordersError}
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="py-12 bg-gray-50 border border-gray-200 rounded-3xl text-center p-6">
                      <div className="text-3xl mb-2">📋</div>
                      <h4 className="font-bold text-sm text-gray-800">No Orders in this Status</h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                        New orders placed through the cart will automatically save to Firestore and appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((order) => {
                        const dateFormatted = new Date(order.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        });

                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs hover:shadow-md transition-shadow space-y-3"
                          >
                            {/* Order Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-sm text-amber-950 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                                  {order.orderId}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{dateFormatted}</span>
                                </span>
                                <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                  {order.orderType}
                                </span>
                              </div>

                              {/* Status Dropdown */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Status:</span>
                                <select
                                  value={order.status}
                                  disabled={updatingOrderId === order.id}
                                  onChange={(e) =>
                                    order.id &&
                                    handleStatusChange(order.id, e.target.value as OrderStatus)
                                  }
                                  className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-800 ${getStatusBadgeClass(
                                    order.status
                                  )}`}
                                >
                                  {ORDER_STATUSES.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>

                                {order.id && (
                                  <button
                                    onClick={() => handleDeleteOrder(order.id!, order.orderId)}
                                    className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Customer & Address Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-gray-800">
                                <UserIcon className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                                <strong className="text-gray-950">{order.customerName}</strong>
                                <span className="text-gray-500">•</span>
                                <span className="font-mono">{order.phoneNumber}</span>
                              </div>

                              {order.deliveryAddress && (
                                <div className="flex items-center gap-1.5 text-gray-700 sm:justify-end">
                                  <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                                  <span className="truncate">{order.deliveryAddress}</span>
                                </div>
                              )}
                            </div>

                            {/* Items List */}
                            <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 space-y-1.5 text-xs">
                              <div className="font-semibold text-gray-600 text-[11px] uppercase tracking-wider mb-1">
                                Ordered Items
                              </div>
                              {order.items.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-gray-800"
                                >
                                  <span>
                                    {it.quantity} x <strong>{it.name}</strong>
                                  </span>
                                  <span className="font-mono font-semibold">₹{it.total}</span>
                                </div>
                              ))}
                            </div>

                            {/* Notes & Total */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              {order.notes ? (
                                <p className="text-xs text-amber-900 italic bg-amber-50 px-2 py-0.5 rounded-md">
                                  Note: "{order.notes}"
                                </p>
                              ) : <span />}

                              <div className="text-right">
                                <span className="text-xs text-gray-500 mr-2">Grand Total:</span>
                                <span className="text-base font-black text-amber-950">
                                  ₹{order.grandTotal}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MENU MANAGEMENT */}
              {activeAdminTab === 'menu' && (
                <div className="space-y-5">
                  {/* Quick Actions (Seed Menu) */}
                  <div className="p-3.5 bg-neutral-50 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t('seedDatabase')}</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {t('seedDatabaseDesc')} (Ayala, Karimeen, Mathi, Neymeen, Meals, Biriyani)
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleSeedMenu}
                      className="px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isMl ? 'മെനു ചേർക്കുക' : 'Seed Station Kadavu Menu'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Form */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                        {isEditing ? <Edit2 className="w-4 h-4 text-amber-800" /> : <Plus className="w-4 h-4 text-amber-800" />}
                        <span>{isEditing ? t('editDish') : t('addNewDish')}</span>
                      </h3>
                      {isEditing && (
                        <button
                          onClick={resetForm}
                          className="text-xs text-gray-500 hover:text-gray-800 underline"
                        >
                          {t('cancel')}
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveItem} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Name EN */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            {t('dishNameEn')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Ayala Fry (Mackerel)"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                          />
                        </div>

                        {/* Name ML */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            {t('dishNameMl')}
                          </label>
                          <input
                            type="text"
                            value={nameMl}
                            onChange={(e) => setNameMl(e.target.value)}
                            placeholder="ഉദാ: അയല വറുത്തത്"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Price */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            {t('dishPrice')} *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step="any"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 120"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            {t('dishCategory')}
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none bg-white"
                          >
                            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.en} ({c.ml})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-gray-500" />
                          <span>{t('dishImageUrl')}</span>
                        </label>
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                        />
                      </div>

                      {/* Descriptions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            {t('dishDescriptionEn')}
                          </label>
                          <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ingredients and culinary notes..."
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            {t('dishDescriptionMl')}
                          </label>
                          <textarea
                            rows={2}
                            value={descriptionMl}
                            onChange={(e) => setDescriptionMl(e.target.value)}
                            placeholder="രുചിക്കൂട്ട് വിവരണം..."
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="flex flex-wrap gap-4 pt-1">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="w-4 h-4 text-amber-800 rounded-md focus:ring-amber-800"
                          />
                          <span>{t('isAvailable')}</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSpecial}
                            onChange={(e) => setIsSpecial(e.target.checked)}
                            className="w-4 h-4 text-red-600 rounded-md focus:ring-red-600"
                          />
                          <span className="text-red-700">{t('isSpecial')}</span>
                        </label>
                      </div>

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{actionLoading ? 'Saving...' : t('saveDish')}</span>
                      </button>
                    </form>
                  </div>

                  {/* Existing Menu Items List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-gray-900">
                        Existing Menu Items ({foods.length})
                      </h3>
                      <span className="text-xs text-gray-500">
                        Firestore Collection: foods
                      </span>
                    </div>

                    <div className="space-y-2">
                      {foods.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={food.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=120&q=80'}
                              alt={food.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-neutral-200"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                                {food.name}
                              </h4>
                              {food.nameMl && (
                                <p className="text-[11px] text-amber-800 font-medium truncate">
                                  {food.nameMl}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-extrabold text-xs text-gray-950">
                                  ₹{food.price}
                                </span>
                                <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded-md border border-gray-200">
                                  {food.category || 'General'}
                                </span>
                                {food.isSpecial && (
                                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-md">
                                    Special
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Toggle Special */}
                            <button
                              onClick={() => handleToggleSpecial(food)}
                              title="Toggle Today's Special"
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                food.isSpecial
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-200 text-gray-600 hover:bg-red-50'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            {/* Toggle Availability */}
                            <button
                              onClick={() => handleToggleAvailable(food)}
                              title="Toggle Available"
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                food.isAvailable !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-neutral-300 text-neutral-700'
                              }`}
                            >
                              {food.isAvailable !== false ? 'In Stock' : 'Sold Out'}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => startEdit(food)}
                              className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(food.id, food.name)}
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
