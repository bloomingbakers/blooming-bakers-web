import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiArrowLeft, FiUploadCloud, FiImage } from 'react-icons/fi';
import useProductStore from '../../stores/useProductStore';
import useAdminStore from '../../stores/useAdminStore';
import Loader from '../../components/Loader';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', discountPrice: '', category: 'cakes', images: [''], stock: '', isVeg: true, isEggless: false, weight: '', servings: '', ingredients: '', isFeatured: false, isBestseller: false, tags: '' };

export default function AdminProducts() {
  const { products, loading, fetchProducts } = useProductStore();
  const { createProduct, updateProduct, deleteProduct } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchProducts({ limit: 100 }); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, discountPrice: p.discountPrice || '', images: p.images?.length ? p.images : [''], tags: p.tags?.join(', ') || '' });
    setEditId(p._id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Image upload handler
  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fullUrl = `http://localhost:5000${data.imageUrl}`;
      setForm(f => ({ ...f, images: [fullUrl] }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || 0, stock: Number(form.stock), images: form.images.filter(Boolean), tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags };
      if (editId) {
        await updateProduct(editId, data);
        toast.success('Product updated!');
      } else {
        await createProduct(data);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts({ limit: 100 });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); toast.success('Deleted!'); fetchProducts({ limit: 100 }); } catch { toast.error('Failed'); }
  };

  if (loading && products.length === 0) return <div className="pt-24"><Loader /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-mocha hover:text-primary-500 mb-2"><FiArrowLeft /> Back to Dashboard</Link>
            <h1 className="section-heading !text-left">Manage Products</h1>
            <p className="text-mocha mt-1">{products.length} products total</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus /> Add Product</button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/50 border-b border-primary-50">
                  <th className="text-left px-4 py-3 font-semibold text-accent-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-accent-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-accent-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-accent-600">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-accent-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-accent-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-primary-50/50 hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || '/images/cake.png'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                          <p className="text-xs text-mocha">⭐ {p.ratings} ({p.numReviews})</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">₹{p.discountPrice || p.price}</span>
                      {p.discountPrice > 0 && <span className="text-xs text-mocha line-through ml-1">₹{p.price}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock <= 5 ? 'text-red-500' : 'text-sage'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {p.isFeatured && <span className="badge bg-primary-100 text-primary-600 text-[10px]">Featured</span>}
                        {p.isBestseller && <span className="badge bg-amber-100 text-amber-700 text-[10px]">Best</span>}
                        {p.isEggless && <span className="badge bg-green-100 text-green-700 text-[10px]">Eggless</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={15} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 z-50" />
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed left-4 right-4 top-4 bottom-4 md:left-[calc(50%-350px)] md:right-[calc(50%-350px)] md:top-[5vh] md:bottom-[5vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
                {/* Fixed Header */}
                <div className="bg-white border-b border-primary-50 px-6 py-4 flex items-center justify-between shrink-0 rounded-t-2xl">
                  <h2 className="font-display text-xl font-semibold text-accent-600">{editId ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-primary-50 rounded-full"><FiX size={20} /></button>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Product Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[80px]" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Price (₹) *</label>
                        <input name="price" type="number" value={form.price} onChange={handleChange} className="input-field" required min="0" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Discount Price (₹)</label>
                        <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className="input-field" min="0" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Category *</label>
                        <select name="category" value={form.category} onChange={handleChange} className="input-field">
                          {['cakes', 'brownies', 'pastries', 'cupcakes', 'cookies', 'breads', 'beverages'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Stock *</label>
                        <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-field" required min="0" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Weight</label>
                        <input name="weight" value={form.weight} onChange={handleChange} className="input-field" placeholder="e.g. 500g, 1 kg" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Servings</label>
                        <input name="servings" value={form.servings} onChange={handleChange} className="input-field" placeholder="e.g. 4-6" />
                      </div>

                      {/* Image Upload */}
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-accent-600 mb-2 block">Product Image</label>
                        {form.images[0] && (
                          <div className="mb-3 relative inline-block">
                            <img src={form.images[0]} alt="Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-primary-100" />
                            <button type="button" onClick={() => setForm(f => ({ ...f, images: [''] }))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                          </div>
                        )}
                        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-primary-200 hover:border-primary-400 hover:bg-primary-50/50'}`}>
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /><p className="text-sm text-mocha">Uploading...</p></div>
                          ) : (
                            <div className="flex flex-col items-center gap-2"><FiUploadCloud size={32} className="text-primary-400" /><p className="text-sm font-medium text-accent-600">Drag & drop image here, or click to browse</p><p className="text-xs text-mocha">JPG, PNG, WebP • Max 5MB</p></div>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-mocha mb-1">Or paste image URL:</p>
                          <input value={form.images[0]} onChange={(e) => setForm(f => ({ ...f, images: [e.target.value] }))} className="input-field text-sm" placeholder="https://example.com/image.jpg" />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Ingredients</label>
                        <input name="ingredients" value={form.ingredients} onChange={handleChange} className="input-field" placeholder="Comma separated" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-accent-600 mb-1 block">Tags</label>
                        <input name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="chocolate, premium, bestseller" />
                      </div>
                      <div className="sm:col-span-2 flex flex-wrap gap-5">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} className="rounded" /><span className="text-sm">Vegetarian</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isEggless" checked={form.isEggless} onChange={handleChange} className="rounded" /><span className="text-sm">Eggless</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="rounded" /><span className="text-sm">Featured</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isBestseller" checked={form.isBestseller} onChange={handleChange} className="rounded" /><span className="text-sm">Bestseller</span></label>
                      </div>
                    </div>
                </div>

                {/* Fixed Bottom Buttons - ALWAYS VISIBLE */}
                <div className="px-6 py-4 border-t-2 border-primary-100 flex gap-3 shrink-0 bg-white rounded-b-2xl">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="button" disabled={saving} onClick={handleSubmit} className="btn-primary flex-1 text-base font-bold">{saving ? 'Saving...' : editId ? '✓ Save Changes' : '+ Add Product'}</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
