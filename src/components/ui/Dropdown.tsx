import React, { FC, useEffect, useRef, useReducer } from 'react';
import { Check, ChevronUp } from 'lucide-react';
import './Dropdown.scss'; // Import the SCSS file

export interface Option {
	label: string;
	value: string;
}

export interface DropdownProps<T = string> {
	isMulti?: boolean;
	initialOptions: Option[];
	setSelectedOptions: React.Dispatch<React.SetStateAction<T[]>>;
	selectedOptions: T[];
}

interface DropdownState {
	inputValue: string;
	isOpen: boolean;
	options: Option[];
}

const initialState: DropdownState = {
	inputValue: '',
	isOpen: false,
	options: [],
};

enum ActionType {
	SetOpen = 'TOGGLE_OPEN',
	SetInputValue = 'SET_INPUT_VALUE',
	AddOption = 'ADD_OPTION',
	SetClose = 'TOGGLE_CLOSE',
}

type Action =
	| { type: ActionType.SetOpen }
	| { type: ActionType.SetInputValue; value: string }
	| { type: ActionType.AddOption; option: Option }
	| { type: ActionType.SetClose };

const dropdownReducer = (
	state: DropdownState,
	action: Action
): DropdownState => {
	switch (action.type) {
		case ActionType.SetOpen:
			return { ...state, isOpen: true };
		case ActionType.SetInputValue:
			return { ...state, inputValue: action.value };
		case ActionType.AddOption:
			return { ...state, options: [...state.options, action.option] };
		case ActionType.SetClose:
			return { ...state, isOpen: false };
		default:
			return state;
	}
};

const Dropdown: FC<DropdownProps> = ({
	initialOptions,
	selectedOptions,
	setSelectedOptions,
	isMulti = true,
}) => {
	const [state, dispatch] = useReducer(dropdownReducer, {
		...initialState,
		options: initialOptions,
	});
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				dispatch({ type: ActionType.SetClose });
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [wrapperRef]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: ActionType.SetInputValue, value: event.target.value });
	};

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && state.inputValue) {
			const newOption = { label: state.inputValue, value: state.inputValue };
			dispatch({ type: ActionType.AddOption, option: newOption });
			dispatch({ type: ActionType.SetInputValue, value: '' });
		}
	};

	const handleOptionClick = (option: Option) => {
		if (!isMulti) {
			setSelectedOptions([option.value]);
			return;
		}
		if (selectedOptions.find((opt) => opt === option.value)) {
			setSelectedOptions((selected) =>
				selected.filter((opt) => opt !== option.value)
			);
			return;
		}
		setSelectedOptions((pre) => [...pre, option.value]);
	};

	return (
		<div
			onClick={() => dispatch({ type: ActionType.SetOpen })}
			ref={wrapperRef}
			className={`dropdown ${state.isOpen ? 'dropdown--open' : ''}`}
		>
			<label htmlFor="dropdown-input" className="dropdown__label">
				{selectedOptions.map((selected) => (
					<span className="dropdown__selected" key={`selected_${selected}`}>
						{selected}
					</span>
				))}
				<input
					autoFocus
					type="text"
					className="dropdown__input"
					id="dropdown-input"
					value={state.inputValue}
					onChange={handleInputChange}
					onKeyDown={handleInputKeyDown}
				/>
			</label>
			<div className="dropdown__indicator">
				<ChevronUp className={`dropdown__indicator--${state.isOpen ? 'open' : 'close'}`} />
			</div>
			<ul
				className={`dropdown__options ${
					state.isOpen ? 'dropdown__options--visible' : ''
				}`}
				role="listbox"
				aria-multiselectable={isMulti}
			>
				{state.options.map((opt) => {
					const isSelected = !!selectedOptions.find(
						(selected) => selected === opt.value
					);
					return (
						<li
							key={opt.value}
							className={`dropdown__option ${
								isSelected ? 'dropdown__option--selected' : ''
							}`}
							onClick={() => handleOptionClick(opt)}
							role="option"
							aria-selected={isSelected}
						>
							{opt.label}
							{isSelected && <Check />}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Dropdown;
