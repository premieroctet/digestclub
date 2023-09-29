'use client';

import message from '@/messages/en';
import Button from '../Button';
import { AiOutlineRobot } from '@react-icons/all-files/ai/AiOutlineRobot';
import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';

const DigestGuessTitle = ({
  handleGuess,
  lastDigestTitles,
}: {
  handleGuess: (value: string) => void;
  lastDigestTitles: string[];
}) => {
  const [guessedTitle, setGuessedTitle] = useState<string>();
  const { isLoading, append } = useChat({
    onFinish: (message) => {
      setGuessedTitle(message.content);
      handleGuess(message.content);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          'dg-storedGuess',
          JSON.stringify({
            lastTitles: lastDigestTitles.join(';'),
            guess: message.content,
          })
        );
      }
    },
  });
  const prompt = `
  Here is a list of document titles sorted from oldest to most recent, separared by ; signs : ${lastDigestTitles
    .reverse()
    .join(';')} 
  Just guess the next document title. Don't add any other sentence in your response.
  `;

  const handleClick = () => {
    if (!guessedTitle) {
      append({ content: prompt, role: 'user' });
    } else {
      handleGuess(guessedTitle);
    }
  };

  // If we already have a guess check it before allowing to make a new one
  useEffect(() => {
    if (window.localStorage.getItem('dg-storedGuess')) {
      const { lastTitles, guess } = JSON.parse(
        window.localStorage.getItem('dg-storedGuess') ?? ''
      );
      if (lastTitles === lastDigestTitles.join(';') && guess) {
        setGuessedTitle(guess);
      } else {
        window.localStorage.removeItem('dg-storedGuess');
      }
    }
  }, []);

  if (!lastDigestTitles?.length) return null;

  return (
    <Button variant="outline" onClick={handleClick} isLoading={isLoading}>
      <div className="flex items-center">
        {message.digests.team_page.guess_title}
        <AiOutlineRobot className="w-4 h-4 ml-2" />
      </div>
    </Button>
  );
};

export default DigestGuessTitle;
