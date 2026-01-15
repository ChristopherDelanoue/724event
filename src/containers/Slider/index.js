import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const byDateDesc = data?.focus.sort((evtA, evtB) =>
      new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  useEffect(() => {
    if (!byDateDesc || byDateDesc.length === 0) return undefined; // ← Ajouté undefined
    if (isPaused) return undefined; // ← Ajouté undefined

    const timer = setTimeout(() => {
      setIndex(index < byDateDesc.length - 1 ? index + 1 : 0);
    }, 5000);

    return () => clearTimeout(timer);
  }, [index, byDateDesc, isPaused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused]);

  return (
      <div className="SlideCardList">
        {byDateDesc?.map((event, idx) => (
            <div
                key={event.title}
                className={`SlideCard SlideCard--${
                    index === idx ? "display" : "hide"
                }`}
            >
              <img src={event.cover} alt="forum" />
              <div className="SlideCard__descriptionContainer">
                <div className="SlideCard__description">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div>{getMonth(new Date(event.date))}</div>
                </div>
              </div>
            </div>
        ))}

        <div className="SlideCard__paginationContainer">
          <div className="SlideCard__pagination">
            {byDateDesc?.map((evt) => (
                <input
                    key={evt.title} // ← Enlevé radioIdx
                    type="radio"
                    name="radio-button"
                    checked={index === byDateDesc.indexOf(evt)} // ← Utilisé indexOf à la place
                    onChange={() => setIndex(byDateDesc.indexOf(evt))} // ← Pareil ici
                />
            ))}
          </div>
        </div>
      </div>
  );
};

export default Slider;