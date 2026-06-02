'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header, BlogCard, SearchBar } from '@/components'
import { getUserPosts, deletePost } from '@/lib/postService'
import { ProgressBar } from '@/components/ui'
import { Button } from '@/components/ui'
import { Modal } from '@/components'
import { useFolders } from '@/contexts/FolderContext'
import { useGuest } from '@/contexts/GuestContext'
import { useSettings } from '@/contexts/SettingsContext'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, postId: null, message: '', onConfirm: null })

  const { activeFolder } = useFolders()
  const { isGuest, guestPosts, hydrated, deleteGuestPost, exitGuestMode } = useGuest()
  const { settings } = useSettings()

  useEffect(() => {
    if (!hydrated) return
    const fetchBlogs = async () => {
      try {
        const data = await getUserPosts()
        setBlogs(Array.isArray(data) ? data : [])
      } catch {
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }
    if (isGuest) { setLoading(false); return; }
    fetchBlogs()
  }, [isGuest, hydrated])

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-black/90">
      <div className="w-64">
        <ProgressBar height="h-2" size="lg" />
      </div>
    </div>
  )

  const allBlogs = isGuest ? guestPosts : blogs

  const matchesSearch = (blog) => {
    const term = searchTerm.toLowerCase().replace(/^#/, '')
    const titleMatch = blog?.title?.toLowerCase().includes(term)
    const hashtagMatch = blog?.content?.toLowerCase().split(/\s+/).some(w => w.startsWith('#') && w.slice(1).includes(term))
    return titleMatch || hashtagMatch
  }

  const sorted = [...allBlogs].sort((a, b) =>
    settings.sortOrder === 'oldest'
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  )
  const filtered = sorted.filter(b => matchesSearch(b))

  const handleDeleteClick = (id) => {
    if (!settings.confirmDelete) {
      if (isGuest) { deleteGuestPost(id); return; }
      deletePost(id).then(() => setBlogs(prev => prev.filter(b => b._id !== id))).catch(() => alert('Failed to delete post'));
      return;
    }
    setModal({
      open: true,
      postId: id,
      message: 'Are you sure you want to delete this post?',
      onConfirm: async () => {
        try {
          if (isGuest) {
            deleteGuestPost(id)
          } else {
            await deletePost(id)
            setBlogs(prev => prev.filter(b => b._id !== id))
          }
        } catch {
          alert('Failed to delete post')
        }
        setModal({ open: false, postId: null, message: '', onConfirm: null })
      }
    })
  }

  const closeModal = () => setModal({ open: false, postId: null, message: '', onConfirm: null })

  return (
    <div className="min-h-screen bg-white dark:bg-black/90">  
      <Header />
      <SearchBar setSearchTerm={setSearchTerm} />
      <section className="home px-4 py-6">
        {filtered.length > 0 ? (
          <>
            {filtered.map(blog => blog && <BlogCard key={blog._id} blog={blog} onDelete={handleDeleteClick} />)}
            <div className="flex justify-center my-8">
              <Button variant="special">
                <Link href="/create">+ Add Jot</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <Button variant="special" className="mt-40">
              <Link href="/create">CREATE NEW JOT</Link>
            </Button>
          </div>
        )}
      </section>

      {modal.open && (
        <Modal
          open={modal.open}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={closeModal}
        />
      )}
    </div>
  )
}
