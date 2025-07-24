export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('logueado');
    localStorage.removeItem('rol'); // si guardaste el rol
}
