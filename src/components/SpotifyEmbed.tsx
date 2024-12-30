import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Quote, Music2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Quote {
  text: string;
  author: string;
}

const DEFAULT_SPOTIFY_EMBED =
  "https://open.spotify.com/embed/playlist/3CPZ8k5MEux8iIbsO8OD7Q?utm_source=generator";
const QUOTES: Quote[] = [
  {
    text: "If that's what you long for, just try to beg for it yourself, and the wounds you made would be the proof that you've tried.",
    author: "Tsukuyomi / Sing the Moon",
  },
  {
    text: "Because you will always regret, no matter how you live. So aplaud the present that you've gone so far to.",
    author: "Tsukuyomi / Sing the Moon",
  },
  {
    text: "We who move forward even if it's an undesirable future, Are still aiming for the best.",
    author: "Orangestar / Surges",
  },
  {
    text: "In times when you don't know anything anymore, know that warmer temperatures are out there.",
    author: "MIMI / Tsuki Michisirube",
  },
  {
    text: "\"It's hard for me\", It's alright if you can't say that. Even on cue you see, we're still living.",
    author: "MIMI / Tightly",
  },
  {
    text: "Say, Is the destination to where you were headed, dark? If it's just a shadow from a bright, bright light, Then",
    author: "HeavenzP / Even If You Assume That is Your Happiness",
  },
  {
    text: "You have desperately gulped down this breath already, so don't give up on the next act of exhaling",
    author: "HarryP / Eve of the Sun",
  },
];

const SpotifyEmbed: React.FC = () => {
  const [spotifyLink, setSpotifyLink] = useLocalStorage<string>(
    "spotify-embed-link",
    DEFAULT_SPOTIFY_EMBED
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [currentQuote, setCurrentQuote] = useState<Quote>(QUOTES[0]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setCurrentQuote(QUOTES[randomIndex]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleEmbedChange = () => {
    if (
      !inputValue.includes("https://open.spotify.com/album/") &&
      !inputValue.includes("https://open.spotify.com/playlist/")
    ) {
      setError("Please enter a valid Spotify album or playlist link.");
      return;
    }

    let embedLink = inputValue;

    if (inputValue.includes("/album/")) {
      embedLink = inputValue.replace("/album/", "/embed/album/");
    } else if (inputValue.includes("/playlist/")) {
      embedLink = inputValue.replace("/playlist/", "/embed/playlist/");
    }

    setSpotifyLink(embedLink);
    setInputValue("");
    setError("");
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-warp gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Music2 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xl">Spotify Player</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center">
          <div className="w-full h-[152px] mb-6 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
            )}
            <iframe
              src={spotifyLink}
              width="100%"
              height="152"
              allow="encrypted-media"
              className="rounded-lg shadow-lg"
              title="Spotify Embed"
              onLoad={handleIframeLoad}
            />
          </div>

          <div className="flex w-full flex-col sm:flex-row items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter Spotify album/playlist link"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-2 bg-white/60 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            />
            <Button
              onClick={handleEmbedChange}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
            >
              Play
            </Button>
          </div>

          <div className="p-6 bg-pink2-300 backdrop-blur-sm rounded-xl w-full">
            <div className="flex items-start gap-3">
              <div className="p-0 bg-pink2-300 rounded-lg flex-shrink-0">
                <Quote className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-700 italic font-medium">
                  {currentQuote.text}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  - {currentQuote.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyEmbed;
