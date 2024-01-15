import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import path
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContextProvider } from './Context/AppContext';
import { SearchContextProvider } from './Context/SearchContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>                            
      <QueryClientProvider client={queryClient}>           {/*for better understanding https://www.youtube.com/watch?v=YdBy9-0pER4&t=30s at 2.11.00*/}
        <AppContextProvider>
          <SearchContextProvider>
            <App />
          </SearchContextProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  // Handle the case where the 'root' element is not found
  console.error("Root element not found");
}

