import React from "react";
import { FaSpellCheck, FaSyncAlt, FaPencilAlt, FaCheck } from "react-icons/fa";
import { SiGrammarly } from "react-icons/si";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";

const Editor = () => {
  const { getAccessToken } = usePrivy();
  const [text, setText] = React.useState("");
  const [selectSentence, setSelectSentence] = React.useState("");
  const [rephraseSentences, setRephraseSentences] = React.useState([]);
  const [correctedSentences, setCorrectedSentences] = React.useState([]);
  const [spellCheckedText, setSpellCheckedText] = React.useState("");
  const [grammarCheckedText, setGrammarCheckedText] = React.useState("");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const addCorrectedSentence = (sentence) => {
    setCorrectedSentences([...correctedSentences, sentence]);
  };
  // select over the word and handle input textbox otherwise error
  const handleSentenceSelection = () => {
    const selection = window.getSelection().toString();
    if (selection) setSelectSentence(selection);
  };

  const handleRephraseSentence = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/analyze",
        {
          sentence: selectSentence,
        },
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );

      setRephraseSentences(response.data);
    } catch (error) {
      console.error("Error rephrasing sentence:", error);
    }
  };

  const handleSpellCheck = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/spellCheck",
        { text },
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      setSpellCheckedText(response.data);
    } catch (error) {
      console.error("Error checking spelling:", error);
    }
  };

  const handleGrammarCheck = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/grammarCheck",
        { text },
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      console.log(response.data);
      setGrammarCheckedText(response.data);
    } catch (error) {
      console.error("Error checking Grammar:", error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              AI Writing Assistant
            </h2>
            <p className="mb-4 text-gray-600">
              Enhance your writing with our advanced AI tools.
            </p>
            <textarea
              value={text}
              onChange={handleTextChange}
              onMouseUp={handleSentenceSelection}
              placeholder="Type your text here..."
              rows={10}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end mt-4 space-x-4">
              <Button icon={<FaSpellCheck />} onClick={handleSpellCheck}>
                Spell Check
              </Button>
              <Button icon={<SiGrammarly />} onClick={handleGrammarCheck}>
                Grammar Check
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultSection
              title="Spell Checked Text"
              text={spellCheckedText}
              onAccept={() => addCorrectedSentence(spellCheckedText)}
              icon={<FaSpellCheck className="text-green-500" />}
            />
            <ResultSection
              title="Grammar Checked Text"
              text={grammarCheckedText}
              onAccept={() => addCorrectedSentence(grammarCheckedText)}
              icon={<SiGrammarly className="text-blue-500" />}
            />
          </div>

          {selectSentence && (
            <div className="bg-white shadow-lg rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaPencilAlt className="mr-2 text-purple-500" />
                Selected Sentence:
              </h3>
              <p className="mb-4">{selectSentence}</p>
              <Button onClick={handleRephraseSentence} icon={<FaSyncAlt />}>
                Rephrase
              </Button>
            </div>
          )}

          {rephraseSentences.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaSyncAlt className="mr-2 text-indigo-500" />
                Rephrased Sentences:
              </h3>
              {rephraseSentences.map((sentence, index) => (
                <div
                  key={index}
                  className="mb-4 pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <p className="mb-2">{sentence}</p>
                  <Button
                    onClick={() => addCorrectedSentence(sentence)}
                    icon={<FaCheck />}
                  >
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaCheck className="mr-2 text-green-500" />
              Corrected Sentences
            </h3>
            <p className="mb-4 text-gray-600">
              Your approved corrections will appear here.
            </p>
            {correctedSentences.length > 0 ? (
              correctedSentences.map((sentence, index) => (
                <div
                  key={index}
                  className="mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                >
                  <p>{sentence}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No corrected sentences yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const Button = ({ onClick, children, icon }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

const ResultSection = ({ title, text, onAccept, icon }) =>
  text && (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <p className="mb-4">{text}</p>
      <Button onClick={onAccept} icon={<FaCheck />}>
        Accept
      </Button>
    </div>
  );

export default Editor;
