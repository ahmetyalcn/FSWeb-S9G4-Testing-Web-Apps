import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />);
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />);
    expect(screen.getByRole('heading'));
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
    const nameInp = screen.getByPlaceholderText("İlhan");
    userEvent.type(nameInp, "asd");
    expect(screen.getByText("Hata: ad en az 5 karakter olmalıdır."));
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const err = await screen.findAllByTestId("error");
    expect(err).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);
    const nameInp = screen.getByPlaceholderText("İlhan");
    const surnameInp = screen.getByPlaceholderText("Mansız");
    const button = screen.getByRole("button");
    userEvent.type(nameInp, "asdde");
    userEvent.type(surnameInp, "asdde");
    fireEvent.click(button);
    const err = await screen.findAllByTestId("error");
    expect(err).toHaveLength(1);

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const emailInp = screen.getByLabelText("Email*");
    userEvent.type(emailInp, "asd@asd");
    expect(screen.getByText(/email geçerli bir email adresi olmalıdır./i));
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const surnameInp = screen.getByPlaceholderText("Mansız");
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText(/soyad gereklidir./i));
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />);
    const nameInp = screen.getByPlaceholderText("İlhan");
    const surnameInp = screen.getByPlaceholderText("Mansız");
    const emailInp = screen.getByLabelText("Email*");

    userEvent.type(nameInp, "asd1@asd.com");
    userEvent.type(surnameInp, "asd2@asd.com");
    userEvent.type(emailInp, "asd3@asd.com");

    const button = screen.getByRole("button");
    fireEvent.click(button);
    const message = screen.queryByTestId("messageDisplay");
    expect(message).not.toBeInTheDocument();

});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);
    const nameInp = screen.getByPlaceholderText("İlhan");
    const surnameInp = screen.getByPlaceholderText("Mansız");
    const emailInp = screen.getByLabelText("Email*");
    const messageInp = screen.getByLabelText("Mesaj");

    userEvent.type(nameInp, "asd1@asd.com");
    userEvent.type(surnameInp, "asd2@asd.com");
    userEvent.type(emailInp, "asd3@asd.com");
    userEvent.type(messageInp, "asd4@asd.com");

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText(/asd1@asd.com/i)).toBeInTheDocument();
    expect(screen.getByText(/asd2@asd.com/i)).toBeInTheDocument();
    expect(screen.getByText(/asd3@asd.com/i)).toBeInTheDocument();
    expect(screen.getByText(/asd4@asd.com/i)).toBeInTheDocument();
});