"use client";

import { useState, useEffect } from 'react';
import { Book, addBook, getBooks } from '../../utils/books-supabase';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    completed_at: new Date().toISOString().split('T')[0],
    notes: '',
    category: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const data = await getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newBook.title || !newBook.completed_at) return;

    try {
      await addBook(newBook);
      setNewBook({
        title: '',
        completed_at: new Date().toISOString().split('T')[0],
        notes: '',
        category: ''
      });
      loadBooks();
      setError(null);
    } catch (err) {
      setError('Failed to add book');
      console.error(err);
    }
  }

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main className="space-y-12">
          {/* Motivational Reminder */}
          <div className="p-6 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm border border-[#D47341]/20">
            <p className="text-xl text-center font-medium text-white">
              <span className="text-[#D47341]">Books are the greatest way to learn</span>
              <br />
              <span className="text-gray-300">Devour bookshelves</span>
            </p>
          </div>

          {/* Add Book Section */}
          <section className="space-y-6 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h1 className="text-4xl font-bold tracking-tight text-white">Add Book</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-lg text-[#D47341] mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label htmlFor="completed_at" className="block text-lg text-[#D47341] mb-2">Completion Date</label>
                <input
                  type="date"
                  id="completed_at"
                  value={newBook.completed_at}
                  onChange={(e) => setNewBook(prev => ({ ...prev, completed_at: e.target.value }))}
                  className="w-full p-3 rounded bg-black/30 text-white border border-[#D47341]/20"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-lg text-[#D47341] mb-2">Category</label>
                <input
                  type="text"
                  id="category"
                  value={newBook.category}
                  onChange={(e) => setNewBook(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                  placeholder="e.g., Product, Technology, Business"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-lg text-[#D47341] mb-2">Key Learnings</label>
                <textarea
                  id="notes"
                  value={newBook.notes}
                  onChange={(e) => setNewBook(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full h-32 p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                  placeholder="What were your main takeaways from this book?"
                />
              </div>

              {error && (
                <div className="text-red-500 bg-red-500/10 p-4 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
              >
                Add Book
              </button>
            </form>
          </section>

          {/* Books List Section */}
          <section className="space-y-6 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h2 className="text-4xl font-bold tracking-tight text-white">Your Books</h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map(book => (
                <div
                  key={book.id}
                  className="p-6 rounded-lg bg-black/30 border border-[#D47341]/20 space-y-4"
                >
                  <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                  {book.category && (
                    <div className="inline-block px-3 py-1 rounded-full bg-[#D47341]/20 text-[#D47341] text-sm">
                      {book.category}
                    </div>
                  )}
                  <div className="text-gray-400 text-sm">
                    Completed: {new Date(book.completed_at).toLocaleDateString()}
                  </div>
                  {book.notes && (
                    <p className="text-gray-300 text-sm">
                      {book.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
} 