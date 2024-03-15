import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faRobot } from "@fortawesome/free-solid-svg-icons";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import "./Textform.css";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = process.env.REACT_APP_MODEL_NAME;
const API_KEY = process.env.REACT_APP_API_KEY;

export default function Textform(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);

  const correctText = async () => {
    setLoading(true);
    const textToCorrect = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.7,
      topK: 4,
      topP: 0.95,
      maxOutputTokens: 512,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `check misspelling and grammar errors in this text and give answer in response as it is with corrected text and nothing else - ${textToCorrect}`,
              },
            ],
          },
        ],
        generationConfig,
        safetySettings,
      });

      const response = result.response;

      if (
        response &&
        response.candidates &&
        Array.isArray(response.candidates)
      ) {
        const correctedText = response.candidates[0].content.parts[0].text;

        // Convert the corrected text to ContentState
        const blocksFromHtml = htmlToDraft(correctedText).contentBlocks;
        const contentBlocks = [];
        blocksFromHtml.forEach((block) => {
          contentBlocks.push(block);
        });

        const contentState = ContentState.createFromBlockArray(contentBlocks);
        const correctedEditorState =
          EditorState.createWithContent(contentState);
        setEditorState(correctedEditorState);
      } else {
        console.log(
          "Unexpected response format. Check API response structure."
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false); // Set loading state to false when API call is finished
    }
  };

  const handlePaste = (event) => {
    if (event.clipboardData) {
      const pastedText = event.clipboardData.getData("text");
      const newContent = ContentState.createFromText(pastedText);
      const newEditorState = EditorState.push(editorState, newContent, "paste");
      setEditorState(newEditorState);
      props.showAlert("Text pasted!", "success");
    }
  };

  const handleUpClick = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText(); // Get plain text of the entire content
    const newText = plainText.toUpperCase();
    const newContentState = ContentState.createFromText(newText);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-block-data"
    );
    setEditorState(newEditorState);
    props.showAlert("Converted to Uppercase!", "success");
  };

  const handleLoClick = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText(); // Get plain text of the entire content
    const newText = plainText.toLowerCase();
    const newContentState = ContentState.createFromText(newText);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-block-data"
    );
    setEditorState(newEditorState);
    props.showAlert("Converted to Lowercase!", "success");
  };

  const handleReverse = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText(); // Get plain text of the entire content
    const reversedText = plainText.split("").reverse().join("");
    const newContentState = ContentState.createFromText(reversedText);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-block-data"
    );
    setEditorState(newEditorState);
    props.showAlert("Text Reversed!", "success");
  };

  const handleClearClick = () => {
    const newEditorState = EditorState.createEmpty();
    setEditorState(newEditorState);
    props.showAlert("Text Cleared!", "success");
  };

  const handleCopy = () => {
    const textToCopy = editorState.getCurrentContent().getPlainText(); // Get plain text directly
    navigator.clipboard.writeText(textToCopy);
    props.showAlert("Copied to Clipboard!", "success");
  };

  const handleExtraSpaces = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText(); // Get plain text of the entire content
    const newText = plainText.replace(/\s+/g, " "); // Replace multiple spaces with a single space
    const newContentState = ContentState.createFromText(newText);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-block-data"
    );
    setEditorState(newEditorState);
    props.showAlert("Extra Spaces Removed!", "success");
  };

  const handleDownload = () => {
    const textToDownload = editorState.getCurrentContent().getPlainText();
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "textfile.txt";
    link.click();
    props.showAlert("File Downloaded!", "success");
  };

  return (
    <>
      <div
        className="container"
        style={{ color: props.mode === "dark" ? "white" : "#042743" }}
      >
        <h1>{props.heading}</h1>
        <div className="mb-3 editor">
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
            onPaste={handlePaste}
            readOnly={false}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "list",
                "textAlign",
                "history",
              ],
              inline: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "monospace",
                ],
              },
              blockType: {
                inDropdown: true,
                options: [
                  "Normal",
                  "H1",
                  "H2",
                  "H3",
                  "H4",
                  "H5",
                  "H6",
                  "Blockquote",
                ],
                className: undefined,
                component: undefined,
                dropdownClassName: "dropperClassName",
              },
              fontSize: {
                options: [10, 12, 14, 16, 18, 24, 30, 36],
                className: undefined,
                component: undefined,
                dropdownClassName: "dropperClassName",
              },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </div>
        <button
          className="btn btn-primary mx-1 my-1"
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
          onClick={handleUpClick}
        >
          Convert to Uppercase
        </button>
        <button
          className="btn btn-primary mx-1 my-1"
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
          onClick={handleLoClick}
        >
          Convert to Lowercase
        </button>
        <button
          className="btn btn-primary mx-1 my-1"
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
          onClick={handleClearClick}
        >
          Clear Text
        </button>
        <button
          className="btn btn-primary mx-1 my-1"
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
          onClick={handleReverse}
        >
          Reverse
        </button>
        <button
          className="btn btn-primary mx-1 my-1"
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
          onClick={handleCopy}
        >
          Copy
        </button>
        <button
          className="btn btn-primary mx-1"
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
          onClick={handleExtraSpaces}
        >
          Remove Spaces
        </button>
        <button
          className="btn btn-primary mx-1 my-1"
          onClick={handleDownload}
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
        >
          <FontAwesomeIcon icon={faDownload} /> Download
        </button>
        <button
          className="btn btn-primary mx-1 my-1"
          onClick={correctText}
          style={{
            backgroundColor: props.mode === "dark" ? "white" : "#042743",
            color: props.mode === "dark" ? "#042743" : "white",
          }}
        >
          <FontAwesomeIcon icon={faRobot} /> Correct Text
        </button>
        {loading && <div className="spinner"></div>}
      </div>
      <div
        className="container my-3"
        style={{ color: props.mode === "dark" ? "white" : "#042743" }}
      >
        <h2>Your text summary</h2>
        <p>
          {
            editorState
              .getCurrentContent()
              .getPlainText()
              .split(/\s+/)
              .filter((element) => element.length !== 0).length
          }{" "}
          words and {editorState.getCurrentContent().getPlainText().length}{" "}
          characters
        </p>
        <p>
          {0.008 *
            editorState
              .getCurrentContent()
              .getPlainText()
              .split(" ")
              .filter((element) => element.length !== 0).length}{" "}
          Minutes read
        </p>
        <h2>Preview</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          }}
        ></div>
      </div>
    </>
  );
}
