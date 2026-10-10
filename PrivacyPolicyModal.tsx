import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DISPLAY_PHONE, WHATSAPP_PHONE } from '../context/CartContext';
import { X, Shield, Lock, Eye, Trash2, Mail, Phone, MapPin } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-amber-950 to-neutral-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/30 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {isMl ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy'}
              </h2>
              <p className="text-xs text-amber-200/80">
                BUBSHI FOOD HUB • Google Play Store Compliance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div className="text-[11px] text-gray-500 font-medium">
            Last Updated: October 2026 | Effective for BUBSHI FOOD HUB (Android App & Web)
          </div>

          <section className="space-y-1">
            <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-800" />
              <span>1. Information We Collect</span>
            </h3>
            <p>
              When you place a food order at BUBSHI FOOD HUB, we collect the necessary details to prepare and deliver your meal:
            </p>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-gray-600">
              <li><strong>Customer Name:</strong> To identify your parcel or table.</li>
              <li><strong>Phone / WhatsApp Number:</strong> To confirm order status and communicate delivery details.</li>
              <li><strong>Delivery Address:</strong> Required only if you select home delivery around Station Kadavu, Kerala.</li>
              <li><strong>Order History:</strong> Ordered dishes, quantities, and receipt amounts.</li>
            </ul>
          </section>

          <section className="space-y-1">
            <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-800" />
              <span>2. How Your Data Is Stored & Protected</span>
            </h3>
            <p>
              Orders are securely transmitted using encrypted connections (HTTPS) and stored in Google Cloud Firebase Firestore (Project: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">bubshi-food-hub-5b8ee</code>).
            </p>
            <p className="text-gray-600">
              Database security rules strictly block public or third-party access to customer orders. Only verified restaurant management can access the administrative order log.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-1.5">
              <span>💬</span>
              <span>3. WhatsApp Integration</span>
            </h3>
            <p>
              When placing an order, our application formats an itemized summary and opens your WhatsApp application to send it directly to BUBSHI FOOD HUB at <strong className="font-mono text-emerald-800">+91 9975587563</strong>. We do not sell or share your contact number with any marketing third parties.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-amber-800" />
              <span>4. Data Retention & Your Rights</span>
            </h3>
            <p>
              You have the right to request deletion of your order records or phone number from our system at any time by contacting us directly via WhatsApp or phone.
            </p>
          </section>

          <section className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-xs text-amber-950">5. Contact Information</h4>
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Station Kadavu Morning Fish Market, Kerala, India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Phone / WhatsApp: <strong className="font-mono">+91 9975587563</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Email: <strong className="font-mono">galaxi.vssp@gmail.com</strong></span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
