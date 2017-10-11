var editor = CodeMirror.fromTextArea(
    document.getElementById("editor-latino"), {
        lineNumbers: true,
        matchBrackets: true,
        indentUnit: 6,
        tabSize: 6,
        mode: "latino",
        theme: "cobalt",
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        }
    }
);
