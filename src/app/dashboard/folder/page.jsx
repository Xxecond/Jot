'use client'

import Link from 'next/link'
import { SearchBar } from '@/components'
import { useFolders } from '@/contexts/FolderContext'
import { Button } from '@/components/ui'

export default function FoldersPage() {
  const { folders } = useFolders()

  return (
    <div className="min-h-screen bg-white dark:bg-black/90">
      <SearchBar />
      <section className="px-4 py-6 max-w-4xl mx-auto">
        {folders.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {folders.map(folder => (
              <Link
                key={folder.id}
                href={`/dashboard/folder/${folder.id}`}
                className="flex flex-col items-center justify-center gap-2 bg-cyan-600 dark:bg-cyan-900 rounded-xl p-6 hover:bg-cyan-700 dark:hover:bg-cyan-800 transition-colors"
              >
                <span className="text-4xl">📁</span>
                <span className="text-white font-medium text-center break-words">{folder.name}</span>
                <span className="text-cyan-200 text-sm">{folder.postIds.length} jot{folder.postIds.length !== 1 ? 's' : ''}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-40 gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No folders yet</p>
            <Button variant="special">
              <Link href="/dashboard/home">Go to Home</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}


