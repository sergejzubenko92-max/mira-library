const firebaseConfig = {
    apiKey: "AIzaSyCRPdx041EYeDIYsajLaoret1h9jAMEo2w",
    authDomain: "mirea-library.firebaseapp.com",
    projectId: "mirea-library",
    storageBucket: "mira-library.firebasestorage.app",
    messagingSenderId: "101297063992",
    appId: "1:101297063992:web:02a83bf2ab606cbd103ecd",
    measurementId: "G-5428DR6GXX"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const appId = 'mira-library';
function getUsersRef() {
    return db.collection('artifacts').doc(appId).collection('public').doc('data').collection('users');
}
function getBooksRef() {
    return db.collection('artifacts').doc(appId).collection('public').doc('data').collection('books');
}
function getHistoryRef() {
    return db.collection('artifacts').doc(appId).collection('public').doc('data').collection('global_history');
}
window.firebaseInitPromise = (async function() {
    try {
        await auth.signInAnonymously();
        console.log("Успешное подключение к Firestore.");
        
        await seedDatabaseIfNeeded();
    } catch (error) {
        console.error("Ошибка при инициализации сетевого подключения к СУБД:", error);
    }
})();
async function seedDatabaseIfNeeded() {
    const booksCheck = await getBooksRef().limit(1).get();
    if (booksCheck.empty) {
        console.log("Сетевая база данных пуста. Запускается генерация структуры и тестовых записей");
        const defaultBooks = [
            { id: 1, author: 'Пушкин', title: 'Капитанская дочка', genre: 'Классика', available: 5, total: 5, status: 'Доступна' },
            { id: 2, author: 'Достоевский', title: 'Преступление и наказание', genre: 'Роман', available: 0, total: 3, status: 'Нет в наличии' },
            { id: 3, author: 'Толстой', title: 'Война и мир', genre: 'Эпос', available: 2, total: 2, status: 'Доступна' },
            { id: 4, author: 'Оруэлл', title: '1984', genre: 'Антиутопия', available: 1, total: 2, status: 'Доступна' },
            { id: 5, author: 'Булгаков', title: 'Мастер и Маргарита', genre: 'Роман', available: 3, total: 3, status: 'Доступна' },
            { id: 6, author: 'Роулинг', title: 'Гарри Поттер', genre: 'Фэнтези', available: 4, total: 4, status: 'Доступна' },
            { id: 7, author: 'Толкин', title: 'Властелин колец', genre: 'Фэнтези', available: 2, total: 2, status: 'Доступна' },
            { id: 8, author: 'Чехов', title: 'Вишнёвый сад', genre: 'Пьеса', available: 6, total: 6, status: 'Доступна' },
            { id: 9, author: 'Гоголь', title: 'Мёртвые души', genre: 'Поэма', available: 3, total: 3, status: 'Доступна' },
            { id: 10, author: 'Тургенев', title: 'Отцы и дети', genre: 'Роман', available: 0, total: 1, status: 'Нет в наличии' },
            { id: 11, author: 'Хаксли', title: 'О дивный новый мир', genre: 'Антиутопия', available: 2, total: 2, status: 'Доступна' },
            { id: 12, author: 'Кафка', title: 'Процесс', genre: 'Абсурдизм', available: 1, total: 1, status: 'Доступна' },
            { id: 13, author: 'Маркес', title: 'Сто лет одиночества', genre: 'Магический реализм', available: 2, total: 2, status: 'Доступна' },
            { id: 14, author: 'Камю', title: 'Посторонний', genre: 'Экзистенциализм', available: 0, total: 1, status: 'Нет в наличии' },
            { id: 15, author: 'Сапковский', title: 'Ведьмак', genre: 'Фэнтези', available: 3, total: 3, status: 'Доступна' },
            { id: 16, author: 'Мартин', title: 'Игра престолов', genre: 'Фэнтези', available: 1, total: 1, status: 'Доступна' },
            { id: 17, author: 'Толстой', title: 'Анна Каренина', genre: 'Роман', available: 4, total: 4, status: 'Доступна' },
            { id: 18, author: 'Достоевский', title: 'Идиот', genre: 'Роман', available: 2, total: 2, status: 'Доступна' }
        ];
        for (var i = 0; i < defaultBooks.length; i++) {
            var book = defaultBooks[i];
            await getBooksRef().doc(book.id.toString()).set(book);
        }
        const defaultUsers = [
            { login: 'admin', password: '123', fio: 'Администратор Библиотеки', ticket: '00000', role: 'librarian', fine: '0 руб', taken: [], history: [] },
            { 
                login: 'ivanov', password: '123', fio: 'Иванов Иван Иванович', ticket: '100001', role: 'user', fine: '666 руб', 
                taken: [
                    { days: '7 дней', date: '01.04.2026', book: '1984' },
                    { days: '14 дней', date: '28.03.2026', book: 'Мастер и Маргарита' }
                ], 
                history: [
                    { type: 'Взял', date: '01.04.2026', book: '1984' },
                    { type: 'Вернул', date: '25.03.2026', book: 'Анна Каренина' },
                    { type: 'Взял', date: '20.03.2026', book: 'Гарри Поттер' },
                    { type: 'Вернул', date: '10.03.2026', book: 'Мёртвые души' }
                ] 
            },
            { 
                login: 'petrov', password: '123', fio: 'Петров Пётр Петрович', ticket: '100002', role: 'user', fine: '0', 
                taken: [
                    { days: '14 дней', date: '05.04.2026', book: 'Мастер и Маргарита' }
                ], 
                history: [
                    { type: 'Взял', date: '05.04.2026', book: 'Мастер и Маргарита' },
                    { type: 'Вернул', date: '01.03.2026', book: 'Капитанская дочка' }
                ] 
            },
            { 
                login: 'sidorova', password: '123', fio: 'Сидорова Анна Сергеевна', ticket: '100003', role: 'user', fine: '120 руб', 
                taken: [
                    { days: '7 дней', date: '10.04.2026', book: 'Гарри Поттер' }
                ], 
                history: [
                    { type: 'Взял', date: '10.04.2026', book: 'Гарри Поттер' },
                    { type: 'Вернул', date: '15.03.2026', book: '1984' }
                ] 
            }
        ];
        for (var j = 0; j < defaultUsers.length; j++) {
            var user = defaultUsers[j];
            await getUsersRef().doc(user.login).set(user);
        }
        const sampleTypes = ['Взял', 'Вернул'];
        const sampleBooks = ['1984', 'Мастер и Маргарита', 'Вишнёвый сад', 'Гарри Поттер', 'Капитанская дочка'];
        const sampleUsers = [
            { ticket: '100001', name: 'Иванов Иван Иванович' },
            { ticket: '100002', name: 'Петров Пётр Петрович' },
            { ticket: '100003', name: 'Сидорова Анна Сергеевна' }
        ];
        for (var k=1;k<=105;k++) {
            const rUser = sampleUsers[k % sampleUsers.length];
            const rBook = sampleBooks[k % sampleBooks.length];
            const rType = sampleTypes[k % sampleTypes.length];
            var isOverdue = false;
            if (rType === 'Вернул') {
                if (k%8 === 0) {
                    isOverdue = true;
                }
            }           
            await getHistoryRef().doc(k.toString()).set({
                ticket: rUser.ticket,
                name: rUser.name,
                book: rBook,
                type: rType,
                date: '12.05.2026',
                isOverdue: isOverdue
            });
        }
        console.log("Наполнение базы данныз завершено.");
    }
}
