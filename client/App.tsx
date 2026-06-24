import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import Recommendations from './components/Recommendations'; 


const App = () => {
    return(
        <div>
            <Recommendations />
        </div>
    );
};

createRoot(document.querySelector('#root')!).render(<App />); 

export default App; 