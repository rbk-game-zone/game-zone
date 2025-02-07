import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

interface HomeContextType {
	games: any[];
	setGames: (games: any[]) => void;
	fetchGameByCategory: (category: string | number) => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [games, setGames] = useState<any[]>([]);

	const fetchGameByCategory = async (category: string | number) => {
		try {
			const response = await axios.get(`http://localhost:8000/api/category/${category}`);
			setGames(response.data);
		} catch (error) {
			console.error("Error fetching games by category:", error);
		}
	};

	return (
		<HomeContext.Provider value={{ games, setGames, fetchGameByCategory }}>
			{children}
		</HomeContext.Provider>
	);
};

export const useHome = () => {
	const context = useContext(HomeContext);
	if (context === undefined) {
		throw new Error('useHome must be used within a HomeProvider');
	}
	return context;
};