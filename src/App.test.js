import { render, screen } from '@testing-library/react';
import App from './App';
import { StoreProvider } from './Store';

test('renders HomeScreen correctly', () => {
  render(
    <StoreProvider>
      <App />
    </StoreProvider>
  );
  // Verifică dacă textul din HomeScreen este prezent
  const homeScreenText = screen.getByText(/Comanda & plateste aici/i);
  expect(homeScreenText).toBeInTheDocument();
});
