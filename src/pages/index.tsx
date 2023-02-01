import Head from "next/head";
import { useEffect, useRef, useState } from "react";

function TerminalRow({ value }: { value: string }) {
  return <div>{`> ${value}`}</div>;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputFocus();
  }, []);

  const setInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const generateCommand = async () => {
    setLoading(true);
    const temp = Object.assign({}, responses);
    temp[input] = "";
    setResponses(temp);
    setInput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setResponses((prev) => {
          const clone = Object.assign({}, prev);
          clone[input] = (clone[input] ?? "") + chunkValue;
          return clone;
        });
      }

      setLoading(false);
      setTimeout(() => {
        setInputFocus();
      }, 250);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>git.roo.app</title>
        <meta name="description" content="Always forget those git commands?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen -mb-8">
        <div className="bg-white">
          <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-10 md:pt-40">
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-center text-slate-900 sm:text-7xl ">
              Never{" "}
              <span className="relative whitespace-nowrap text-blue-600">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">forget</span>
              </span>{" "}
              those
              <br />
              git commands
            </h1>
            <div className="sm:mb-8 sm:flex sm:justify-center mt-4">
              <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                This demo is part of an article{" "}
                <a
                  href="https://roo.app/articles/git-cmd"
                  className="font-semibold text-blue-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:py-24 lg:px-8">
              <div className="ml-0 lg:ml-6">
                <div
                  className="absolute inset-y-0 right-1/2 -z-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36"
                  aria-hidden="true"
                />
                <div className="shadow-lg md:rounded-3xl max-w-6xl">
                  <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                    <div
                      className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36"
                      aria-hidden="true"
                    />
                    <div className="relative pt-8 sm:pt-16 md:p-16">
                      <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                        <div className="w-screen/2 overflow-hidden rounded-t-xl rounded-b-xl bg-gray-900">
                          <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                            <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                              <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 py-2 px-4 text-white">
                                roo.terminal
                              </div>
                              <div className="py-2 px-4">
                                Type any git command in plain english
                              </div>
                            </div>
                            <div></div>
                          </div>
                          <div className="px-6 pt-6 pb-14 min-h-[250px] md:min-h-[450px]">
                            <code className="text-white flex flex-col space-y-2">
                              <>
                                {Object.keys(responses).map((key) => {
                                  return (
                                    <div
                                      className="space-y-2"
                                      key={responses[key]}
                                    >
                                      <TerminalRow value={key} />
                                      <TerminalRow value={responses[key]} />
                                    </div>
                                  );
                                })}
                                {!loading && (
                                  <div className="flex flex-row">
                                    {">"}
                                    <form
                                      action="submit"
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        generateCommand();
                                      }}
                                      className="w-full"
                                    >
                                      <input
                                        ref={inputRef}
                                        className="bg-transparent focus:ring-0 focus:outline-none focus:ring-offset-0 pl-2 w-full"
                                        value={input}
                                        onChange={(e) =>
                                          setInput(e.target.value)
                                        }
                                      />
                                    </form>
                                  </div>
                                )}
                              </>
                            </code>
                          </div>
                        </div>
                      </div>
                      <div
                        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
          </div>
        </div>
      </main>
      <footer className="mx-auto text-center">
        <div className="text-slate-500">
          Made with 🖤{" "}
          <a href="https://roo.app" target="_blank" rel="noreferrer">
            roo.app
          </a>
        </div>
      </footer>
    </>
  );
}
