import * as Yup from 'yup'
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createNote } from '@/services/noteService'

import css from './NoteForm.module.css'

const ValidationCreateNoteFormSchema = Yup.object().shape({
	title: Yup.string()
		.min(3, 'Title must be at least 3 characters')
		.max(50, 'Title must be at most 50 characters')
		.required('Title is required'),
	content: Yup.string().max(500, 'Content must be at most 500 characters'),
	tag: Yup.string()
		.oneOf(
			['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
			'Tag must be one of: Todo, Work, Personal, Meeting, Shopping',
		)
		.required('Tag is required'),
})

interface NoteFormProps {
	onClose: () => void
}

export default function NoteForm({ onClose }: NoteFormProps) {
	interface FormData {
		title: string
		content?: string
		tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping'
	}
	const initialValues: FormData = {
		title: '',
		content: '',
		tag: 'Todo',
	}

	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: createNote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'], exact: false })
			onClose()
		},
	})

	const handleSubmit = (values: FormData, actions: FormikHelpers<FormData>) => {
		mutation.mutate({
			...values,
			content: values.content || '',
		})
		actions.resetForm()
	}

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={ValidationCreateNoteFormSchema}
		>
			<Form className={css.form}>
				<div className={css.formGroup}>
					<label htmlFor='title'>Title</label>
					<Field id='title' type='text' name='title' className={css.input} />
					<ErrorMessage name='title' component='span' className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor='content'>Content</label>
					<Field id='content' as='textarea' name='content' rows='8' className={css.textarea} />
					<ErrorMessage name='content' component='span' className={css.error} />
				</div>

				<div className={css.formGroup}>
					<label htmlFor='tag'>Tag</label>
					<Field id='tag' as='select' name='tag' className={css.input}>
						<option value=''>Select a tag</option>
						<option value='Todo'>Todo</option>
						<option value='Work'>Work</option>
						<option value='Personal'>Personal</option>
						<option value='Meeting'>Meeting</option>
						<option value='Shopping'>Shopping</option>
					</Field>
					<ErrorMessage name='tag' component='span' className={css.error} />
				</div>

				<div className={css.actions}>
					<button type='button' className={css.cancelButton} onClick={onClose}>
						Cancel
					</button>
					<button type='submit' className={css.submitButton} disabled={mutation.isPending}>
						Create note
					</button>
				</div>
			</Form>
		</Formik>
	)
}
