// Seller Dashboard - Protected page for sellers
// Shows seller's products, stats, add/edit/delete products
// Redirects non-sellers to login
// TODO SUPABASE: No changes needed at launch

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Package, CheckCircle, Clock, XCircle, ArrowLeft, AlertTriangle, LogOut, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductsBySeller, addProduct, updateProduct, deleteProduct, getUserById, logoutUser } from '../db';
import { CATEGORIES } from '../config';
import { showToast } from '../components/Toast';
import type { Product, User } from '../data';

interface SellerDashboardProps {
  session: User | null;
  setSession: (user: User | null) => void;
}

export default function SellerDashboard({ session, setSession }: SellerDashboardProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Auth guard: redirect non-sellers
  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    if (session.role !== 'seller') {
      showToast('Access denied. Seller account required.', 'error');
      navigate('/login');
      return;
    }
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const loadProducts = async () => {
    if (!session) return;
    setLoading(true);
    const data = await getProductsBySeller(session.id);
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (product: Product) => {
    // Enforce: seller can only delete their own products
    if (product.seller_id !== session?.id) {
      showToast('You can only delete your own products', 'error');
      return;
    }
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await deleteProduct(product.id);
    setProducts(prev => prev.filter(p => p.id !== product.id));
    showToast('Product deleted', 'info');
  };

  const handleEdit = (product: Product) => {
    // Enforce: seller can only edit their own products
    if (product.seller_id !== session?.id) {
      showToast('You can only edit your own products', 'error');
      return;
    }
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    navigate('/');
  };

  const handleFormSubmit = async (productData: Partial<Product>) => {
    if (!session) return;

    if (editingProduct) {
      // Update existing
      const updated = await updateProduct(editingProduct.id, productData);
      if (updated) {
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        showToast('Product updated! Status reset to pending for re-approval.', 'success');
      }
    } else {
      // Add new
      const newProduct = await addProduct({
        seller_id: session.id,
        name: productData.name || '',
        price: productData.price || 0,
        category: productData.category || 'Fashion',
        description: productData.description || '',
        images: productData.images || [],
      });
      setProducts(prev => [...prev, newProduct]);
      showToast('Submitted for admin approval.', 'success');
    }
    handleFormClose();
  };

  // Stats
  const totalProducts = products.length;
  const approved = products.filter(p => p.status === 'approved').length;
  const pending = products.filter(p => p.status === 'pending').length;
  const rejected = products.filter(p => p.status === 'rejected').length;

  if (!session || session.role !== 'seller') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors" title="Back to marketplace">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-xs text-gray-500">Welcome, {session.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Store
            </Link>
            <button
              onClick={() => { setShowForm(true); setEditingProduct(null); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Pending verification banner */}
        {session.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Account Pending Verification</p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Your account is awaiting verification. Your products will show a Verified badge once approved by the admin.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Package className="w-6 h-6 text-secondary mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <CheckCircle className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold text-success">{approved}</p>
            <p className="text-xs text-gray-500">Approved</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">{pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <XCircle className="w-6 h-6 text-danger mx-auto mb-1" />
            <p className="text-2xl font-bold text-danger">{rejected}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
        </div>

        {/* Products list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Products</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">You haven't added any products yet.</p>
              <button
                onClick={() => { setShowForm(true); setEditingProduct(null); }}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">₦{product.price.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-gray-500 hover:text-secondary hover:bg-blue-50 rounded-lg transition-colors"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-2 text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {products.map(product => (
                  <div key={product.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500">{product.category} • ₦{product.price.toLocaleString()}</p>
                        <div className="mt-1.5">
                          <StatusBadge status={product.status} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-500 hover:text-secondary rounded-lg"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-gray-500 hover:text-danger rounded-lg"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config = {
    approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Approved' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' },
  }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: status };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Product Form Modal
function ProductForm({ product, onSubmit, onClose }: {
  product: Product | null;
  onSubmit: (data: Partial<Product>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || '');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState<string[]>(product?.images || ['']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!price || Number(price) <= 0) errs.price = 'Price must be greater than 0';
    if (!category) errs.category = 'Please select a category';
    if (!description.trim()) errs.description = 'Description is required';
    const validImages = images.filter(img => img.trim());
    if (validImages.length === 0) errs.images = 'At least one image URL is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      price: Number(price),
      category: category as Product['category'],
      description: description.trim(),
      images: images.filter(img => img.trim()),
    });
  };

  const addImageField = () => {
    if (images.length < 4) {
      setImages([...images, '']);
    }
  };

  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={product ? 'Edit product' : 'Add new product'}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Custom ABSU Hoodie"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-1 ${
                  errors.name ? 'border-danger focus:border-danger focus:ring-danger' : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
              />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦)
              </label>
              <input
                id="product-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 5000"
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-1 ${
                  errors.price ? 'border-danger focus:border-danger focus:ring-danger' : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
              />
              {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-1 bg-white ${
                  errors.category ? 'border-danger focus:border-danger focus:ring-danger' : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-danger mt-1">{errors.category}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="product-desc" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="product-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-1 resize-none ${
                  errors.description ? 'border-danger focus:border-danger focus:ring-danger' : 'border-gray-200 focus:border-primary focus:ring-primary'
                }`}
              />
              {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URLs
              </label>
              {images.map((img, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateImage(i, e.target.value)}
                    placeholder={`Image URL ${i + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="p-2 text-gray-400 hover:text-danger transition-colors"
                      aria-label={`Remove image ${i + 1}`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  + Add another image
                </button>
              )}
              {errors.images && <p className="text-xs text-danger mt-1">{errors.images}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                {product ? 'Update Product' : 'Submit for Approval'}
              </button>
            </div>

            {!product && (
              <p className="text-xs text-gray-500 text-center">
                ⏳ New products start as "pending" and will be reviewed by admin.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
