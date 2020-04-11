import axios from 'axios'

export default async function ({ store }) {
  const book = await axios.get('https://librivox.org/api/feed/audiobooks/?title=' + store.state.bookTitle);
  store.dispatch('setBook', book.data.books[0]);
}
