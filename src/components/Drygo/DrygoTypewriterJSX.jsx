import { useEffect, useState } from "react";

const DrygoTypewriter = () => {
  const phrases = [
    "Drygo",
    "drygo.dev",
    "Drykoso",
    "xDrygo",
    "@eldrygo",
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const currentPhrase = phrases[index];
    // más lento al escribir y al borrar
    let typingSpeed = isDeleting ? 100 : 150; 

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text === currentPhrase) {
          setIsDeleting(true);
        }
      } else {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    // pausa más larga cuando termina de escribir
    }, text === currentPhrase && !isDeleting ? 2500 : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 600); // también más lento el cursor
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <h1 className="text-balance md:text-5xl text-white/90 max-w-xl mx-auto">
      {text}
      <span className="inline-block w-[0.5ch]">{blink ? "_" : " "}</span>
    </h1>
  );
};

export default DrygoTypewriter;
