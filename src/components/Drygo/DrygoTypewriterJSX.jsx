import { useEffect, useState } from "react";

const DrygoTypewriter = () => {
  const phrases = ["Drygo", "drygo.dev", "Drykoso", "xDrygo", "@eldrygo"];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const currentPhrase = phrases[index];
    const typingSpeed = isDeleting ? 100 : 150;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text.length + 1 === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1000); // pausa antes de borrar
        }
      } else {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <h1 className="text-center text-[#fdbaff]/90 text-md sm:text-3xl max-w-2xl mx-auto font-mono">
      {text}
      <span
        className={`inline-block ml-0.5 w-[1ch] scale-80 sm:scale-100 ${
          blink ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      >
        |
      </span>
    </h1>
  );
};

export default DrygoTypewriter;
