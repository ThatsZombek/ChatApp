// Importujemy wymagane moduły
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

// Tworzymy instancję aplikacji Express
const app = express();

// Middleware do obsługi JSON i CORS
app.use(express.json()); // Automatyczne parsowanie JSON w żądaniach
app.use(cors()); // Zezwolenie na zapytania z innych domen
app.use(bodyParser.json());

// Prosta baza danych w pamięci serwera
let users = [
    {username: 'admin', password: 'password'},
    {username: 'admin2', password: 'admin2'},
    {username: 'joker', password: 'joker'}
]; // Lista użytkowników, którzy mogą się zalogować
let messages = []; // Lista wiadomości w czacie

// Endpoint do logowania
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if(user) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    
    } else {
        res.status(401).json({ message: 'Nieprawidłowe dane' });
    }
})

// Endpoint do wysyłania wiadomości
// Użytkownik wysyła swoje imię i treść wiadomości
app.post('/messages', (req, res) => {
    const { name, message } = req.body; // Oczekujemy obiektu { name: "imię", message: "treść wiadomości" }

    if (!name || !message) {
        // Sprawdzamy, czy imię i treść wiadomości zostały podane
        return res.status(400).send({ error: 'Imię i treść wiadomości są wymagane' });
    }

    // Tworzymy nową wiadomość z datą wysłania
    const newMessage = { name, message, timestamp: new Date() };

    // Dodajemy wiadomość do listy wiadomości
    messages.push(newMessage);

    // Wysyłamy odpowiedź z dodaną wiadomością
    res.status(200).send(newMessage);
});

// Endpoint do pobierania wszystkich wiadomości
// Klient pobiera listę wszystkich wiadomości z czatu
app.get('/messages', (req, res) => {
    res.status(200).send(messages); // Wysyłamy listę wiadomości jako odpowiedź
});

// Endpoint do usuwania wiadomości
// Użytkownik może usunąć wiadomość, jeśli jego imię zgadza się z nadawcą wiadomości
app.delete('/messages', (req, res) => {
    const { name, timestamp } = req.body;
    console.log('Otrzymano żądanie usunięcia:', { name, timestamp });

    if (!name || !timestamp) {
        return res.status(400).send({ error: 'Imię i znacznik czasu są wymagane' });
    }

    const initialLength = messages.length;

    // Porównujemy timestamp jako stringi ISO
    messages = messages.filter(
        msg => !(msg.name === name && new Date(msg.timestamp).toISOString() === timestamp)
    );

    console.log('Pozostałe wiadomości:', messages);

    if (messages.length === initialLength) {
        return res.status(404).send({ error: 'Nie znaleziono wiadomości lub brak autoryzacji' });
    }

    res.status(200).send({ message: 'Wiadomość została pomyślnie usunięta' });
});

// Uruchomienie serwera
const PORT = 3000; // Ustawiamy port, na którym będzie działał serwer
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serwer działa na http://localhost:${PORT}`); // Informujemy, że serwer działa
});
