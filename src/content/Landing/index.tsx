import React from 'react';

const SpiralAnimation: React.FC = () => {
    if(localStorage.getItem('userid') && localStorage.getItem('username'))
        window.location.href = '/MyScripts';
    return (
        <>
            <style>{`
                @font-face {
                    font-family: 'Hello';
                    src: url('hello.woff2') format('woff2');
                }

                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Hello', sans-serif;
                    background-color: white;
                    color: #1976d2;
                    margin: 0;
                }

                .container {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: white;
                    margin-top: -80px;
                    height: 100vh;
                }

                .spiral {
                    display: inline-block;
                    animation: pulse 6s infinite 3s;
                    font-size: 5rem;
                }

                .spiral span {
                    display: inline-block;
                    opacity: 0;
                    animation: appear 0.5s forwards;
                }

                .spiral span:nth-child(1) { animation-delay: 0s; }
                .spiral span:nth-child(2) { animation-delay: 0.5s; }
                .spiral span:nth-child(3) { animation-delay: 1s; }
                .spiral span:nth-child(4) { animation-delay: 1.5s; }
                .spiral span:nth-child(5) { animation-delay: 2s; }
                .spiral span:nth-child(6) { animation-delay: 2.5s; }

                @keyframes appear {
                    to {
                        opacity: 1;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .login-btn {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    border: none;
                    background-color: lightgrey;
                    color: black;
                    font-family: Copperplate;
                    font-size: 1.5rem;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                    opacity: 0; 
                    animation: fadeIn 1s forwards 4s; 
                }

                .login-btn:hover {
                    background-color: #ddd;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
            <div className="container">
                <div className="spiral">
                    <span>S</span>
                    <span>p</span>
                    <span>i</span>
                    <span>r</span>
                    <span>a</span>
                    <span>l</span>
                </div>
                <br /><br />
                <button className="login-btn" onClick={() => window.location.href = '/Login'} >Login</button>
                <button className="login-btn" onClick={() => window.location.href = '/CreateAccount'} >Create Account</button>

            </div>

        </>
    );
}

export default SpiralAnimation;
