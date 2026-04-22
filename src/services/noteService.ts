import axios from 'axios'
import type { Note } from '@/types/note'

interface NotesResponse {
	notes: Note[]
	totalPages: number
}

const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL.replace(/\/$/, ''),
	params: {
		page: 1,
		perPage: 12,
		search: '',
	},
	headers: {
		Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
	},
})

export const fetchNotes = async (
	searchText: string,
	page: number,
): Promise<{ notes: Note[]; totalPages: number }> => {
	const {
		data: { notes, totalPages },
	} = await api.get<NotesResponse>('/notes', {
		params: {
			search: searchText,
			page: page,
		},
	})

	return { notes, totalPages }
}

export const deleteNote = async (id: string): Promise<Note> => {
	const { data } = await api.delete(`/notes/${id}`)

	return data
}

