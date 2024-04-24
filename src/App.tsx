import { useState } from 'react';
import './App.css';

/// NOTE: we could use barrel import OR setup typescript configs for cleaner imports
// but due to nature of the assignment being isolated, there was no need for any of those options
import Dropdown, { type Option } from './components/ui/Dropdown';

const initialOptions: Option[] = [
	{ value: 'education', label: 'Education 🎓' },
	{ value: 'science', label: 'Yeeeah, science! 👩‍🔬' },
	{ value: 'art', label: 'Art 🎨' },
	{ value: 'sport', label: 'Sport ⚽' },
	{ value: 'games', label: 'Games 🎮' },
	{ value: 'health', label: 'Health 🏥' },
];

function App() {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	return (
		<main className="App">
			<Dropdown
				initialOptions={initialOptions}
				selectedOptions={selectedOptions}
				setSelectedOptions={setSelectedOptions}
			/>
		</main>
	);
}

export default App;
