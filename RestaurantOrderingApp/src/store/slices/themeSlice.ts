import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
  language: 'en' | 'tw' | 'fr';
}

const initialState: ThemeState = {
  isDarkMode: false,
  language: 'en',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'tw' | 'fr'>) => {
      state.language = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode, setLanguage } = themeSlice.actions;
export default themeSlice.reducer;