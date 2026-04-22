import { useEffect } from 'react'

import css from './Modal.module.css'

interface ModalProps {
	onClose: () => void
	children: React.ReactNode
}

export default function Modal({ onClose, children }: ModalProps) {
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	useEffect(() => {
		const handleEscClick = (e: KeyboardEvent) => {
			if (e.code === 'Escape') {
				onClose()
			}
		}
		document.addEventListener('keydown', handleEscClick)
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleEscClick)
			document.body.style.overflow = ''
		}
	}, [onClose])
	return (
		<div className={css.backdrop} role='dialog' aria-modal='true' onClick={handleBackdropClick}>
			<div className={css.modal}>{children}</div>
		</div>
	)
}

