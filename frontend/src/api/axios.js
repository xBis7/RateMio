import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8080/RateMio',
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    }
});