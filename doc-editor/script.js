// DOM Elements
const uploadBtn = document.getElementById('upload-btn');
const createBtn = document.getElementById('create-btn');
const downloadBtn = document.getElementById('download-btn');
const fileInput = document.getElementById('file-input');
const imageInput = document.getElementById('image-input');
const editor = document.getElementById('editor');
const pdfViewer = document.getElementById('pdf-viewer');
const canvas = document.getElementById('pdf-canvas');
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const strikethroughBtn = document.getElementById('strikethrough-btn');
const fontFamilySelect = document.getElementById('font-family');
const fontSizeSelect = document.getElementById('font-size');
const fontColorInput = document.getElementById('font-color');
const bgColorInput = document.getElementById('bg-color');
const alignLeftBtn = document.getElementById('align-left');
const alignCenterBtn = document.getElementById('align-center');
const alignRightBtn = document.getElementById('align-right');
const alignJustifyBtn = document.getElementById('align-justify');
const bulletListBtn = document.getElementById('bullet-list');
const numberListBtn = document.getElementById('number-list');
const indentIncreaseBtn = document.getElementById('indent-increase');
const indentDecreaseBtn = document.getElementById('indent-decrease');
const headingSelect = document.getElementById('heading');
const insertImageBtn = document.getElementById('insert-image');
const insertLinkBtn = document.getElementById('insert-link');
const insertTableBtn = document.getElementById('insert-table');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const penBtn = document.getElementById('pen-btn');
const highlighterBtn = document.getElementById('highlighter-btn');
const drawColorInput = document.getElementById('draw-color');

// PDF and Canvas Setup
const ctx = canvas.getContext('2d');
let pdfDoc = null;
let isDrawing = false;
let tool = 'pen';
let history = [];
let historyIndex = -1;

// Fix Drawing Coordinates
function getCanvasCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

// Save History for Undo/Redo
function saveHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(editor.innerHTML);
  historyIndex++;
}

// Upload File
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type === 'application/pdf') {
    editor.hidden = true;
    pdfViewer.hidden = false;
    canvas.hidden = false;
    const arrayBuffer = await file.arrayBuffer();
    pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdfDoc.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    pdfViewer.style.width = `${viewport.width}px`;
    pdfViewer.style.height = `${viewport.height}px`;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    // Extract Text
    const textContent = await page.getTextContent();
    pdfViewer.innerHTML = '';
    textContent.items.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item.str;
      div.style.position = 'absolute';
      div.style.left = `${item.transform[4]}px`;
      div.style.top = `${item.transform[5]}px`;
      div.style.fontSize = `${item.height}px`;
      div.style.transform = `scale(${scale})`;
      div.style.transformOrigin = 'top left';
      pdfViewer.appendChild(div);
    });

    // Render PDF on Canvas for Drawing
    page.render({
      canvasContext: ctx,
      viewport,
    });
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    pdfViewer.hidden = true;
    canvas.hidden = true;
    editor.hidden = false;
    const reader = new FileReader();
    reader.onload = () => (editor.innerHTML = reader.result);
    reader.readAsText(file);
  }
});

// Create New Document
createBtn.addEventListener('click', () => {
  pdfViewer.hidden = true;
  canvas.hidden = true;
  editor.hidden = false;
  editor.innerHTML = '<p>Start typing here...</p>';
  editor.focus();
  saveHistory();
});

// Text Editing Features
boldBtn.addEventListener('click', () => { document.execCommand('bold'); saveHistory(); });
italicBtn.addEventListener('click', () => { document.execCommand('italic'); saveHistory(); });
underlineBtn.addEventListener('click', () => { document.execCommand('underline'); saveHistory(); });
strikethroughBtn.addEventListener('click', () => { document.execCommand('strikeThrough'); saveHistory(); });
fontFamilySelect.addEventListener('change', () => { document.execCommand('fontName', false, fontFamilySelect.value); saveHistory(); });
fontSizeSelect.addEventListener('change', () => {
  document.execCommand('fontSize', false, '7');
  const fontElements = editor.querySelectorAll('font');
  fontElements.forEach((el) => {
    el.style.fontSize = fontSizeSelect.value + 'px';
    el.removeAttribute('size');
  });
  saveHistory();
});
fontColorInput.addEventListener('input', () => { document.execCommand('foreColor', false, fontColorInput.value); saveHistory(); });
bgColorInput.addEventListener('input', () => { document.execCommand('backColor', false, bgColorInput.value); saveHistory(); });
alignLeftBtn.addEventListener('click', () => { document.execCommand('justifyLeft'); saveHistory(); });
alignCenterBtn.addEventListener('click', () => { document.execCommand('justifyCenter'); saveHistory(); });
alignRightBtn.addEventListener('click', () => { document.execCommand('justifyRight'); saveHistory(); });
alignJustifyBtn.addEventListener('click', () => { document.execCommand('justifyFull'); saveHistory(); });
bulletListBtn.addEventListener('click', () => { document.execCommand('insertUnorderedList'); saveHistory(); });
numberListBtn.addEventListener('click', () => { document.execCommand('insertOrderedList'); saveHistory(); });
indentIncreaseBtn.addEventListener('click', () => { document.execCommand('indent'); saveHistory(); });
indentDecreaseBtn.addEventListener('click', () => { document.execCommand('outdent'); saveHistory(); });
headingSelect.addEventListener('change', () => {
  document.execCommand('formatBlock', false, headingSelect.value);
  saveHistory();
});
insertImageBtn.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.execCommand('insertImage', false, reader.result);
      saveHistory();
    };
    reader.readAsDataURL(file);
  }
});
insertLinkBtn.addEventListener('click', () => {
  const url = prompt('Enter URL:');
  if (url) {
    document.execCommand('createLink', false, url);
    saveHistory();
  }
});
insertTableBtn.addEventListener('click', () => {
  const table = '<table border="1"><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>';
  document.execCommand('insertHTML', false, table);
  saveHistory();
});
undoBtn.addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex--;
    editor.innerHTML = history[historyIndex];
  }
});
redoBtn.addEventListener('click', () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    editor.innerHTML = history[historyIndex];
  }
});

// PDF Editing (Pen & Highlighter)
penBtn.addEventListener('click', () => (tool = 'pen'));
highlighterBtn.addEventListener('click', () => (tool = 'highlighter'));

canvas.addEventListener('mousedown', (e) => {
  if (canvas.hidden) return;
  isDrawing = true;
  const { x, y } = getCanvasCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || canvas.hidden) return;
  const { x, y } = getCanvasCoordinates(e);
  ctx.lineTo(x, y);
  ctx.strokeStyle = drawColorInput.value;
  ctx.globalAlpha = tool === 'highlighter' ? 0.3 : 1;
  ctx.lineWidth = tool === 'pen' ? 2 : 10;
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseleave', () => (isDrawing = false));

// Download as PDF
downloadBtn.addEventListener('click', () => {
  if (!canvas.hidden) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);
    const pdf = new jsPDF();
    const imgData = tempCanvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('edited.pdf');
  } else {
    html2pdf().from(editor).set({
      margin: 1,
      filename: 'document.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
  }
});