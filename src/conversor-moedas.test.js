import { render, screen, fireEvent } from '@testing-library/react';
import ConversorMoedas from './conversor-moedas';
import React from 'react';
import axiosMock from 'axios';
import '@testing-library/jest-dom/extend-expect'

describe('conversor de moedas', () => {

  beforeEach(() => {
    render(<ConversorMoedas />);
  })

  it('Deve renderizar o componente sem erros', () => {
    const element = screen.getByTestId('conversor')
    expect(element).toBeInTheDocument();
  });

  it('Deve simular conversao de moedas', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { success: true, rates: { BRL: 4.564292, USD: 1.101049}}
    });
    fireEvent.click(screen.getByTestId('btn-converter'));
    const modal = await screen.findByTestId('modal');
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(modal).toHaveTextContent('1 BRL = 0.24 USD');
  });

})

