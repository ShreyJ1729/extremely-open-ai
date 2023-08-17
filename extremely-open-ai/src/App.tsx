import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [input, setInput] = React.useState("");
  const [inputCopy, setInputCopy] = React.useState("");
  const [output, setOutput] = React.useState("");

  const url =
    "https://shreyj1729--extremely-open-ai-run-query-dev.modal.run/?prompt=";

  const fetchData = async (message: string) => {
    try {
      const response = await fetch(url + message);
      if (!response.body) {
        throw new Error("ReadableStream not yet supported in this browser.");
      }
      const reader = response.body.getReader();

      let receivedData = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        receivedData += new TextDecoder().decode(value);
        setOutput(receivedData);
        console.log(output);
        const elem = document.getElementById("output");
        if (elem != null) {
          elem.scrollTop = elem.scrollHeight;
        }
      }
    } catch (error) {
      console.error("Error fetching/streaming data:", error);
    }
  };

  return (
    <div className="App">
      {/* box */}
      <div className="flex flex-col w-full h-screen bg-gray-100">
        <div
          id="output"
          className="flex flex-col items-start text-start justify-start w-11/12 h-5/6 m-10 px-5 pb-10 pt-5 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
          dangerouslySetInnerHTML={{
            __html:
              "<strong>" +
              inputCopy +
              "</strong><br/>" +
              output.trim().replaceAll("\n", "<br/>"),
          }}
        ></div>
      </div>
      <div className="fixed bottom-0 left-0 flex items-center justify-center w-full h-20 bg-gray-100">
        <div className="relative flex w-9/12">
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              console.log(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setOutput("loading...");
                fetchData(input);
                setInputCopy(input);
                setInput("");
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
