import React from "react";
import { Link } from "react-router-dom";
import Hero from "../assets/hero.jpeg";
import question_mark from "../assets/question_mark.svg";
import LanguageSwitcher from "../languageSwitcher";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <>
      <section className="home-hero" data-translate="message">
        <div className="home-hero__content" data-translate="message">
          <p className="home-hero__headline" data-translate="message">
            Sustainable <br /> farming for better tomorrow
          </p>

          <Link
            to="/login"
            className="home-hero__cta"
            data-translate="message"
          >
            Get Started Today
          </Link>
        </div>

        <div className="home-hero__illustration" data-translate="message">
          <img src={Hero} alt="Farmers standing in a field" className="home-hero__image" data-translate="message" />
        </div>
      </section>

      <section className="home-offerings" data-translate="message">
        <h2 className="home-offerings__title" data-translate="message">
          What We Provide:
        </h2>

        <div className="home-offerings__grid" data-translate="message">
          <article className="home-card" data-translate="message">
            <div className="home-card__title" data-translate="message">
              <img
                src={question_mark}
                alt="question mark icon"
                className="home-card__icon"
                data-translate="message"
              />
              Environmental protection
            </div>
            <p className="home-card__body" data-translate="message">
              By minimizing over-fertilization, the app reduces the risk of runoff and water pollution,
              helping to prevent eutrophication and protect aquatic ecosystems.
            </p>
          </article>

          <article className="home-card" data-translate="message">
            <div className="home-card__title" data-translate="message">
              <img
                src={question_mark}
                alt="question mark icon"
                className="home-card__icon"
                data-translate="message"
              />
              Increased Agricultural Productivity
            </div>
            <p className="home-card__body" data-translate="message">
              Optimized fertilizer usage ensures healthy crop growth, leading to improved yields and
              higher income for farmers, thus promoting economic sustainability.
            </p>
          </article>

          <article className="home-card" data-translate="message">
            <div className="home-card__title" data-translate="message">
              <img
                src={question_mark}
                alt="question mark icon"
                className="home-card__icon"
                data-translate="message"
              />
              Community Building
            </div>
            <p className="home-card__body" data-translate="message">
              The community page fosters collaboration and knowledge exchange among farmers, building
              resilience and strengthening social ties within agricultural communities.
            </p>
          </article>

          <article className="home-card" data-translate="message">
            <div className="home-card__title" data-translate="message">
              <img
                src={question_mark}
                alt="question mark icon"
                className="home-card__icon"
                data-translate="message"
              />
              Cost Efficiency for Farmers
            </div>
            <p className="home-card__body" data-translate="message">
              By accurately predicting the appropriate amount and type of fertilizer, the app helps
              farmers reduce unnecessary expenses, lowering their operational costs while maintaining
              high productivity.
            </p>
          </article>
        </div>
      </section>

      <div className="home-language-switcher" data-translate="message">
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default Home;
