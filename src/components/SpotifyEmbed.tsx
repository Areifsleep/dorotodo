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
  "https://open.spotify.com/embed/album/72sG7hFVmyFlxg9e7PfV0K?utm_source=generator";
const QUOTES: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
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
          {/* Fixed height container for iframe */}
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
              placeholder="Enter Spotify album link"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-2 bg-white/60 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            />
            <Button
              onClick={handleEmbedChange}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
            >
              Play Album
            </Button>
          </div>

          {/* Fixed height container for quote */}
          <div className="p-6 bg-pink2-300 backdrop-blur-sm rounded-xl w-full">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink2-300 rounded-lg flex-shrink-0">
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
