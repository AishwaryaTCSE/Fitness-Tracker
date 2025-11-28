/* Code that renders homepage on the frontend */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.scss";
import logo from "../../components/titan-clear-logo.png";
import ROUTES from "../../routes";

/**
 * Returns a react component consisting of the Home page. Includes all logic relevant to the home page.
 * 
 * @returns a react component consisting of the Home page.
 */
const Home = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            navigate(ROUTES.REGISTER, { state: { email } });
        }
    };

    return (
        <div className="home">
            <header className="home__header">
                <div className="home__logo">
                    <img src={logo} alt="Titan Health Logo" />
                    <span>TITAN</span>
                </div>
                <Link to={ROUTES.LOGIN} className="home__signin-button">
                    Sign In
                </Link>
            </header>
            
            <main className="home__main">
                <div className="home__content">
                    <h1>Ready to level up your fitness and nutrition journey?</h1>
                    <h2>Sign up for free.</h2>
                    <p>Create your account below.</p>
                    
                    <form onSubmit={handleSubmit} className="home__form">
                        <div className="home__input-group">
                            <input
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="home__cta-button">
                                Get Started
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Home;
