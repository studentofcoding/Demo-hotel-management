import { Dispatch,SetStateAction,createContext } from "react";

type ThemeContextType = {
    darkTheme: boolean;
    setDarkTheme: Dispatch<SetStateAction<boolean>>;
};

const ThemeContext = createContext<ThemeContextType>({
    darkTheme: false,           //default value
    setDarkTheme: () => null,   //initial value
});

export default ThemeContext;