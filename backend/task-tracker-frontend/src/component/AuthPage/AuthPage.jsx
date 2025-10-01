import {useState} from "react";
import './AuthPage.css';
import {useAuth} from "../../provider/AuthProvider.jsx";

function AuthPage() {
    const [isLoginMode, setIsLoginMode] = useState(false)
    const [identifier, setIdentifier] = useState('');
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isBlankUsername, setIsBlankUsername] = useState(false);
    const [isBlankPassword, setIsBlankPassword] = useState(false);
    const [isBlankEmail, setIsBlankEmail] = useState(false);

    function validateRegistration(username, email, password) {
        let isInvalid = false;
        if (!username || username.trim() === '') {
            setIsBlankUsername(true);
            isInvalid = true;
        }
        if (!email || email.trim() === '') {
            setIsBlankEmail(true);
            isInvalid = true;
        }
        if (!password || password.trim() === '') {
            setIsBlankPassword(true);
            isInvalid = true;
        }

        if (isInvalid) {
            return;
        }

        register(username, email, password);
        setIsBlankUsername(false);
        setIsBlankEmail(false);
        setIsBlankPassword(false);
    }

    function validateLogin(identifier, password) {
        let isInvalid = false;
        if (!identifier || identifier.trim() === '') {
            setIsBlankUsername(true);
            isInvalid = true;
        }
        if (!password || password.trim() === '') {
            setIsBlankPassword(true);
            isInvalid = true;
        }

        if (isInvalid) {
            return;
        }

        login(identifier, password);
        setIsBlankUsername(false);
        setIsBlankEmail(false);
        setIsBlankPassword(false);
    }

    const {login, register} = useAuth();

    return (
        <div>
            {isLoginMode ?
                (<div className='register-form-container'>
                    <div className='register-form-content'>
                        <h3>Войти</h3>
                        <label>Имя или email</label>
                        {isBlankUsername ? <div className='error-message'>Поле не должно быть пустым</div> :
                            <div></div>}
                        <input required
                               onChange={(e) => setUsername(e.target.value)}/>
                        <label>Пароль</label> {isBlankPassword ?
                        <div className='error-message'>Пароль не должен быть пустым</div> : <div></div>}
                        <input type='password' required
                               onChange={(e) => setPassword(e.target.value)}/>
                        <div className="button-container">
                            <button className='register-button'
                                    onClick={() => validateLogin(username, password)}>Войти
                            </button>
                        </div>
                        <div>
                            <button onClick={() => setIsLoginMode(false)}>Нет аккаунта? Загерестрироваться</button>
                        </div>
                    </div>
                </div>) :
                (<div className='register-form-container'>
                    <div className='register-form-content'>
                        <h3>Регистрация</h3>
                        <label>Имя</label>
                        {isBlankUsername ? <div className='error-message'>Имя не должно быть пустым</div> : <div></div>}
                        <input required onChange={(e) => setUsername(e.target.value)}/>
                        <label>Email</label>
                        {isBlankEmail ? <div className='error-message'>Email не должен быть пустым</div> : <div></div>}
                        <input required onChange={(e) => setEmail(e.target.value)}/>
                        <label>Пароль</label>
                        {isBlankPassword ? <div className='error-message'>Пароль не должен быть пустым</div> :
                            <div></div>}
                        <input type='password' required onChange={(e) => setPassword(e.target.value)}/>
                        <div className="button-container">
                            <button className='register-button'
                                    onClick={() => validateRegistration(username, email, password)}>Зарегистрироваться
                            </button>
                        </div>
                        <div>
                            <button onClick={() => setIsLoginMode(true)}>Уже зарегистрированы? Войти</button>
                        </div>
                    </div>
                </div>)
            }
        </div>
    );
}

export default AuthPage;