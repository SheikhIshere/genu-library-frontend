'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { books, auth } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [visibility, setVisibility] = useState('public');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast('Cover image must be less than 1MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast('Cover must be an image', 'error');
        return;
      }
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast('PDF must be less than 25MB', 'error');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast('Book file must be a PDF', 'error');
        return;
      }
      setBookFile(file);
    }
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      toast('Title and author are required', 'error');
      return;
    }
    if (!bookFile) {
      toast('PDF file is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('visibility', visibility);
      tags.forEach((tag) => formData.append('tag', tag));
      if (cover) formData.append('cover_page', cover);
      formData.append('book_file', bookFile);

      await books.create(formData);
      toast('Book published to the Guild!', 'success');
      router.push('/books');
    } catch {
      toast('Failed to publish book', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-body-small text-sm text-text-muted">
          <a className="hover:text-primary transition-colors flex items-center gap-1" href="/">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </a>
          <span className="text-text-muted/50 font-mono text-xs">/</span>
          <a className="hover:text-primary transition-colors" href="/books">Books</a>
          <span className="text-text-muted/50 font-mono text-xs">/</span>
          <span className="text-primary font-medium">Upload New</span>
        </nav>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-text-primary">Publish New Treatise</h1>
            <p className="font-body text-text-secondary mt-2">Share your knowledge with the Guild archives</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label htmlFor="title" className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Title <span className="text-error">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div>
                <label htmlFor="author" className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Author <span className="text-error">*</span>
                </label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Author name"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Price (Tokens)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">🪙</span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-surface-container-low border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Visibility
                </label>
                <div className="flex gap-3">
                  {['public', 'private', 'unlisted'].map((v) => (
                    <label key={v} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value={v}
                        checked={visibility === v}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="sr-only peer"
                      />
                      <span className="font-body-small text-sm capitalize peer-checked:text-text-on-accent peer-checked:bg-primary peer-checked:border-primary text-text-secondary peer-hover:text-text-primary">
                        {v}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="description" className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Describe your treatise..."
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 bg-surface-container-low border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Add a tag (press Enter)"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-primary-container text-text-on-accent rounded-lg font-medium hover:bg-primary-hover transition-colors">
                    Add
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-surface-container border border-border flex-shrink-0">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <span className="material-symbols-outlined text-[32px]">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="sr-only"
                      id="cover-upload"
                    />
                    <label htmlFor="cover-upload" className="cursor-pointer px-4 py-2 bg-surface-container-low border border-border rounded-lg text-text-secondary hover:border-primary hover:text-text-primary transition-all">
                      {cover ? 'Change Cover' : 'Choose Cover Image'}
                    </label>
                    <p className="font-caption text-caption text-text-muted mt-1">Max 1MB · JPG, PNG, WebP</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block font-body-small text-sm font-medium text-text-primary mb-2">
                  Book PDF <span className="text-error">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-surface-container border border-border flex items-center justify-center flex-shrink-0">
                    {bookFile ? (
                      <span className="material-symbols-outlined text-primary text-[28px]">picture_as_pdf</span>
                    ) : (
                      <span className="material-symbols-outlined text-text-muted text-[28px]">cloud_upload</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleBookFileChange}
                      className="sr-only"
                      id="book-upload"
                    />
                    <label htmlFor="book-upload" className="cursor-pointer px-4 py-3 bg-surface-container-low border border-border rounded-lg text-text-secondary hover:border-primary hover:text-text-primary transition-all w-full text-center block">
                      {bookFile ? `Selected: ${bookFile.name}` : 'Choose PDF File'}
                    </label>
                    <p className="font-caption text-caption text-text-muted mt-1">Max 25MB · PDF only</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-surface-container border border-border text-text-secondary rounded-lg font-medium hover:border-border-hover hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-container text-text-on-accent rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                    Publish to Guild
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}