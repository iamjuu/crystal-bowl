"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { useCart } from "@/stores/useCart";
import Image from "next/image";
import toast from "react-hot-toast";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string[];
  isSet?: boolean;
  numberOfSets?: number;
  relativeproduct?: boolean;
};

type DeliveryMethod = "Air Express";

// Calculate shipping based on total bowl count
// Pattern repeats every 7 bowls:
// 1 Bowl: $65
// 2-3 Bowls: $111
// 4-7 Bowls: $155
// 8 Bowls (8+0): $65 (same as 1)
// 9-10 Bowls (8+1 to 8+2): $111 (same as 2-3)
// 11-14 Bowls (8+3 to 8+6): $155 (same as 4-7)
// 15 Bowls (8+7, wraps to 1): $65
// And so on...
const calculateShippingByBowlCount = (bowlCount: number): number => {
  if (bowlCount <= 0) return 0;
  
  // Get the remainder when divided by 7 (pattern repeats every 7 bowls)
  const remainder = bowlCount % 7;
  
  if (remainder === 1) {
    // 1, 8, 15, 22, etc.
    return 65;
  } else if (remainder === 2 || remainder === 3) {
    // 2-3, 9-10, 16-17, 23-24, etc.
    return 111;
  } else {
    // 4-7, 11-14, 18-21, 25-28, etc. (remainder 0 means 7, 14, 21, etc.)
    return 155;
  }
};

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: cartItems, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  
  // Check if it's instant buy or cart
  const isInstantBuy = searchParams?.get("type") === "instant";
  const productId = searchParams?.get("productId");
  const quantity = parseInt(searchParams?.get("quantity") || "1");
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod] = useState<DeliveryMethod>("Air Express"); // Only Air Express available
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    comments: "",
  });

  useEffect(() => {
    fetchUser();
    if (isInstantBuy && productId) {
      fetchProduct(productId);
    } else {
      fetchCartProducts();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setUser(data.data);
        // Only set name and phone by default (not address)
        setFormData((prev) => ({
          ...prev,
          fullName: data.data.name || "",
          phone: data.data.phone || "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  // Handle checkbox toggle for using profile address
  const handleUseProfileAddress = (checked: boolean) => {
    setUseProfileAddress(checked);
    
    if (checked && user && user.address) {
      // Fill address from profile
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
        street: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        postalCode: user.address.zipCode || "",
        country: user.address.country || "",
      }));
    } else {
      // Clear address fields (keep name and phone)
      setFormData((prev) => ({
        ...prev,
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      }));
    }
  };

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setItems([
          {
            _id: data.data._id,
            name: data.data.name,
            price: data.data.price,
            quantity: quantity,
            imageUrl: data.data.imageUrl,
            isSet: data.data.isSet || false,
            numberOfSets: data.data.numberOfSets || 0,
            relativeproduct: data.data.relativeproduct || false,
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product");
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartProducts = async () => {
    try {
      // Fetch product details for each cart item to get isSet, numberOfSets, and relativeproduct
      const productPromises = cartItems.map(async (cartItem): Promise<CartItem | null> => {
        const response = await fetch(`/api/products/${cartItem.id}`);
        const data = await response.json();
        if (data.success) {
          return {
            _id: data.data._id,
            name: data.data.name,
            price: data.data.price,
            quantity: cartItem.quantity,
            imageUrl: Array.isArray(data.data.imageUrl) ? data.data.imageUrl : [],
            isSet: data.data.isSet || false,
            numberOfSets: data.data.numberOfSets || 0,
            relativeproduct: data.data.relativeproduct || false,
          } as CartItem;
        }
        return null;
      });

      const fetchedItems = await Promise.all(productPromises);
      const validItems = fetchedItems.filter((item): item is CartItem => item !== null);
      setItems(validItems);
    } catch (error) {
      console.error("Failed to fetch cart products:", error);
      toast.error("Failed to load cart items");
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateDeliveryCharges = () => {
    // Count total bowls, excluding universal products (relativeproduct = true)
    let totalBowls = 0;
    const breakdown: string[] = [];

    items.forEach((item) => {
      // Skip universal products - no delivery charge
      if (item.relativeproduct) {
        return;
      }

      let bowlsFromItem = 0;
      
      if (item.isSet && item.numberOfSets) {
        // If it's a set, count numberOfSets bowls per quantity
        bowlsFromItem = item.numberOfSets * item.quantity;
      } else {
        // If it's a single piece, count 1 bowl per quantity
        bowlsFromItem = item.quantity;
      }

      totalBowls += bowlsFromItem;
      
      if (bowlsFromItem > 0) {
        if (item.isSet) {
          breakdown.push(`${item.quantity} set${item.quantity > 1 ? "s" : ""} (${bowlsFromItem} bowl${bowlsFromItem > 1 ? "s" : ""})`);
        } else {
          breakdown.push(`${item.quantity} piece${item.quantity > 1 ? "s" : ""} (${bowlsFromItem} bowl${bowlsFromItem > 1 ? "s" : ""})`);
        }
      }
    });

    // Calculate shipping based on total bowl count
    const total = calculateShippingByBowlCount(totalBowls);

    // Create breakdown string
    let breakdownText = "";
    if (totalBowls === 0) {
      breakdownText = "No delivery charge (universal products only)";
    } else {
      breakdownText = `${totalBowls} bowl${totalBowls > 1 ? "s" : ""} = $${total}`;
      if (breakdown.length > 0) {
        breakdownText += ` (${breakdown.join(", ")})`;
      }
    }

    return {
      method: deliveryMethod,
      breakdown: breakdownText,
      total,
    };
  };

  const productTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharges = calculateDeliveryCharges();
  const totalAmount = productTotal + deliveryCharges.total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("No items to order");
      return;
    }

    setSubmitting(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            isSet: item.isSet,
          })),
          productTotal,
          deliveryCharges,
          amount: totalAmount,
          shippingAddress: formData,
          customerComments: formData.comments,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Redirect to Stripe payment
      const orderId = orderData.data._id;
      router.push(`/payment/checkout?orderId=${orderId}`);
      
      // Clear cart if not instant buy
      if (!isInstantBuy) {
        clearCart();
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.message || "Failed to create order");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2]">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
            <p className="text-[#1C3163]">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-normal text-[#1C3163] mb-8">
          Order Confirmation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Order Form */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-[22px] font-medium text-[#1C3163] mb-6">Delivery Details</h2>
            
            {/* Checkbox for using profile address */}
            {user && user.address && (user.address.street || user.address.city) && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useProfileAddress}
                    onChange={(e) => handleUseProfileAddress(e.target.checked)}
                    className="mt-1 w-5 h-5 text-[#1C3163] border-gray-300 rounded focus:ring-[#1C3163] focus:ring-2"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-[#1C3163]">
                      Use my saved address from profile
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {user.address.street && `${user.address.street}, `}
                      {user.address.city && `${user.address.city}, `}
                      {user.address.state} {user.address.zipCode}
                    </p>
                  </div>
                </label>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C3163] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C3163] mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C3163] mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C3163] mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C3163] mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C3163] mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C3163] mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C3163] mb-1">
                  Delivery Method
                </label>
                <div className="p-3 border border-zinc-300 rounded-md bg-zinc-50">
                  <div className="font-medium text-[#1C3163]">Air Economy</div>
                  <div className="text-sm text-zinc-600 mt-1">
                    1 Bowl: $65 • 2-3 Bowls: $111 • 4-7 Bowls: $155
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C3163] mb-1">
                  Comments / Questions (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Any questions or special instructions for your order?"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3163]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1C3163] text-white py-3 rounded-md font-medium hover:bg-[#152747] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : "Proceed to Payment"}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-lg h-fit sticky top-4">
            <h2 className="text-[22px] font-medium text-[#1C3163] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  {item.imageUrl && item.imageUrl[0] && (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl[0].startsWith("data:") ? item.imageUrl[0] : `data:image/jpeg;base64,${item.imageUrl[0]}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#1C3163]">{item.name}</p>
                    <p className="text-sm text-zinc-600">
                      Qty: {item.quantity} {item.isSet ? "(Set)" : "(Piece)"}
                    </p>
                    <p className="text-sm font-medium text-[#1C3163]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Product Total:</span>
                <span className="font-medium text-[#1C3163]">${productTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Delivery (Air Economy):</span>
                <span className="font-medium text-[#1C3163]">${deliveryCharges.total}</span>
              </div>

              <div className="text-xs text-zinc-500 italic pl-4">
                {deliveryCharges.breakdown}
              </div>

              <div className="border-t border-zinc-200 pt-2 mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-[#1C3163]">Total (SGD):</span>
                  <span className="text-[#1C3163]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2]">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
            <p className="text-[#1C3163]">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}

