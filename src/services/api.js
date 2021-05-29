import axios from 'axios';

// pegando a api backend
const api = axios.create({
	baseURL: 'https://notes-annotations.herokuapp.com/'
})

export default api;