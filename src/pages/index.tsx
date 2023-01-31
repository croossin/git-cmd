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
      <main>
        <div className="bg-white">
          <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
            <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:py-40 lg:px-8">
              <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
                <div
                  className="absolute inset-y-0 right-1/2 -z-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36"
                  aria-hidden="true"
                />
                <div className="shadow-lg md:rounded-3xl w-screen max-w-6xl">
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
