// import Modal from '../Modal/Modal'
// import PostList from '../PostList/PostList'
// import SearchBox from '../SearchBox/SearchBox'
// import Pagination from '../Pagination/Pagination'

import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { useDebouncedCallback } from 'use-debounce'

import css from './App.module.css'
import NoteList from '../NoteList'
import { fetchNotes } from '@/services/noteService'
import Pagination from '../Pagination'
import Modal from '../Modal'
import NoteForm from '../NoteForm'
import type { Note } from '@/types/note'
import SearchBox from '../SearchBox'
import { useDebouncedCallback } from 'use-debounce'

// import { useQuery } from '@tanstack/react-query'
// import { useState } from 'react'
// import { fetchPosts } from '../../services/postService'
// import { useDebouncedCallback } from 'use-debounce'
// import CreatePostForm from '../CreatePostForm/CreatePostForm'
// import EditPostForm from '../EditPostForm/EditPostForm'
// import { Post } from '../../types/post'

export default function App() {
	const [currentPage, setCurrentPage] = useState(1)
	const [searchQuery, setSearchQuery] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	// const [isCreatePost, setIsCreatePost] = useState(false)

	const queryClient = useQueryClient()
	const { data } = useQuery<{ notes: Note[]; totalPages: number }, Error>({
		queryKey: ['notes', searchQuery, currentPage],
		queryFn: () => fetchNotes(searchQuery, currentPage),
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnMount: false,
		placeholderData: (previousData, previousQuery) => {
			const previousQueryValue = previousQuery?.queryKey[1]

			return previousQueryValue === searchQuery ? previousData : undefined
		},
	})

	const notes = data?.notes || []
	const totalPages = data?.totalPages ? data.totalPages : 0

	useEffect(() => {
		if (!data) return

		if (currentPage < totalPages) {
			queryClient.prefetchQuery({
				queryKey: ['notes', searchQuery, currentPage + 1],
				queryFn: () => fetchNotes(searchQuery, currentPage + 1),
			})
		}

		if (currentPage > 1) {
			queryClient.prefetchQuery({
				queryKey: ['notes', searchQuery, currentPage - 1],
				queryFn: () => fetchNotes(searchQuery, currentPage - 1),
			})
		}
	}, [currentPage, data, queryClient, searchQuery, totalPages])

	const handleSearch = useDebouncedCallback((searchQuery: string) => {
		setSearchQuery(searchQuery)
		setCurrentPage(1)
	}, 300)

	return (
		<div className={css.app}>
			<header className={css.toolbar}>
				<SearchBox onSearch={handleSearch} />
				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				)}
				<button
					className={css.button}
					onClick={() => {
						setIsModalOpen(true)
					}}
				>
					Create note +
				</button>
			</header>
			{isModalOpen && (
				<Modal onClose={() => setIsModalOpen(false)}>
					<NoteForm onClose={() => setIsModalOpen(false)} />
				</Modal>
			)}
			{notes.length > 0 && <NoteList notes={notes} />}
		</div>
	)
}

