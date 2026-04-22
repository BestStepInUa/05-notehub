import css from './SearchBox.module.css'

interface SearchBoxProps {
	onSearch: (searchQuery: string) => void
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
	return (
		<input
			className={css.input}
			type='text'
			placeholder='Search posts'
			onChange={(e) => onSearch(e.target.value)}
		/>
	)
}

