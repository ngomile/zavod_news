import {
    AUTH_URL
} from '@/lib/config';


export const loginUser = async (username: string, password: string) => {
    const url = `${AUTH_URL}login/`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.status == 'success') {
            localStorage.setItem('access', responseData.data.access);
            localStorage.setItem('refresh', responseData.data.refresh);
            localStorage.setItem('user', JSON.stringify(responseData.data.user));

            window.location.assign('/');
        } else {
            // Managed error
            const error = responseData.message;
            window.location.href = `/login?error=${error}`;
        }
    } else {
        // Unmanaged error
        const errorData = response.statusText;
        window.location.href = `/login?error=${errorData}: ${url}`;
    }
};

export const registerUser = async (username: string, email: string, password: string) => {
    const url = `${AUTH_URL}register/`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    if (response.ok) {
        window.location.href = '/login';
    } else {
        const errorData = response.statusText;
        window.location.href = `/login?error=${errorData}: ${url}`;
    }
}

export const getUser = () => {
    let userData;

    try {
        getAuthToken();

        const userInStorage = localStorage.getItem('user');
        userData = JSON.parse(
            userInStorage ?? ''
        );
    } catch(error) {
        console.log(error);
    }

    return userData ?? undefined;
}

export const getAuthToken = () => {
    const token = localStorage.getItem('access');

    if (!token) {
        throw new Error("User is not logged in. There is no token stored.");
    }

    return token;
}

export const logoutUser = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');

    window.location.href = '/login/';
}
