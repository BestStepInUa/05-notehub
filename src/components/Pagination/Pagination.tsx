import type { ComponentType } from 'react'
import * as ReactPaginateModule from 'react-paginate'

import type { ReactPaginateProps } from 'react-paginate'

import css from './Pagination.module.css'

const resolveReactPaginateComponent = (moduleValue: unknown): ComponentType<ReactPaginateProps> => {
	let candidate = moduleValue

	while (candidate && typeof candidate === 'object' && 'default' in candidate) {
		candidate = (candidate as { default: unknown }).default
	}

	if (typeof candidate !== 'function') {
		throw new Error('Failed to resolve react-paginate component export.')
	}

	return candidate as ComponentType<ReactPaginateProps>
}

const ReactPaginate = resolveReactPaginateComponent(ReactPaginateModule)

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
	return (
		<ReactPaginate
			pageCount={totalPages}
			pageRangeDisplayed={5}
			marginPagesDisplayed={1}
			onPageChange={({ selected }) => onPageChange(selected + 1)}
			forcePage={currentPage - 1}
			containerClassName={css.pagination}
			activeClassName={css.active}
			disabledClassName={css.disabled}
			nextLabel='→'
			previousLabel='←'
		/>
	)
}

