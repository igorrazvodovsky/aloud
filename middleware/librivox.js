import axios from 'axios'

export default async function ({ route, store }) {
  const book = await axios.get('https://librivox.org/api/feed/audiobooks/?title=Northanger%20Abbey');
  store.dispatch('setBook', book.data.books[0]);
}
