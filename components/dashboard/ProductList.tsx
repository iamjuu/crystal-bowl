"use client";

import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";

type ProductListItem = {
  _id: string;
  name: string;
  price: number;
  createdAt: string;
  description?: string;
  imageUrl?: string[];
  videoUrl?: string;
};

type Props = {
  products: ProductListItem[];
  onRefresh: () => void;
};

const formatCurrency = (amount: number) => `₹${(amount / 100).toFixed(2)}`;

const getMainImageUrl = (product: ProductListItem) => {
  const img = product.imageUrl?.[0];
  if (!img) return "";
  if (img.startsWith("data:image")) return img;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `data:image/jpeg;base64,${img}`;
};

export default function ProductList({ products: initialProducts, onRefresh }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync products when prop changes
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete product");
      } else {
        setProducts(products.filter((p) => p._id !== id));
        onRefresh();
      }
    } catch {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditComplete = () => {
    setEditingId(null);
    onRefresh();
  };

  if (products.length === 0) {
    return (
      <div className="rounded-lg  p-10 text-center">
        <p className="text-zinc-400">There is no product</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-zinc-700 last:border-0">
                {editingId === product._id ? (
                  <td colSpan={4} className="px-6 py-4">
                    <ProductForm
                      productId={product._id}
                      initialData={{
                        name: product.name,
                        description: product.description,
                        price: (product.price / 100).toString(),
                        imageUrl: product.imageUrl || [],
                        videoUrl: product.videoUrl,
                      }}
                      onComplete={handleEditComplete}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getMainImageUrl(product) && (
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
                            <img
                              src={getMainImageUrl(product)}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{product.name}</p>
                            {product.videoUrl && (
                              <span className="text-xs text-zinc-500" title="Has video">
                                🎥
                              </span>
                            )}
                          </div>
                          {product.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(product.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(product._id)}
                          className="rounded-md border border-zinc-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="rounded-md border border-red-600 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/20 disabled:opacity-50"
                        >
                          {deletingId === product._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

