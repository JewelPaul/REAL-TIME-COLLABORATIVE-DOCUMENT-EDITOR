import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
  FiAlignRight, FiAlignJustify, FiList, FiLink, FiImage,
  FiType, FiMinus
} from 'react-icons/fi';

const ToolbarContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e8eaed;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 6px;
    justify-content: center;
  }
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 2px;
  padding: 0 5px;
  border-right: 1px solid #e8eaed;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #e8eaed;
    padding-bottom: 5px;
    width: 100%;
    justify-content: center;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ToolButton = styled.button`
  background: none;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  color: #5f6368;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e8eaed;
  }

  &.active {
    background-color: #e8eaed;
    color: #1a73e8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 4px;
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 6px;
  border: 1px solid #e8eaed;
  border-radius: 4px;
  background-color: white;
  color: #5f6368;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1a73e8;
  }

  @media (max-width: 768px) {
    padding: 4px;
    font-size: 12px;
    max-width: 100px;
  }
`;

const ColorPicker = styled.input`
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 1px solid #e8eaed;
    border-radius: 4px;
  }
`;

const Toolbar = ({ quill }) => {
  const toolbarRef = useRef(null);

  useEffect(() => {
    if (!quill) return;

    // Create toolbar
    if (toolbarRef.current) {
      quill.addModule('toolbar', {
        container: toolbarRef.current
      });
    }
  }, [quill]);

  const handleFormatText = (format) => {
    if (!quill) return;

    const formatValue = quill.getFormat()[format];
    quill.format(format, !formatValue);
  };

  const handleAlign = (alignment) => {
    if (!quill) return;

    quill.format('align', alignment);
  };

  const handleList = (listType) => {
    if (!quill) return;

    const formatValue = quill.getFormat().list;
    quill.format('list', formatValue === listType ? false : listType);
  };

  const handleFontSize = (e) => {
    if (!quill) return;

    quill.format('size', e.target.value);
  };

  const handleFontFamily = (e) => {
    if (!quill) return;

    quill.format('font', e.target.value);
  };

  const handleColor = (e) => {
    if (!quill) return;

    quill.format('color', e.target.value);
  };

  const handleBackgroundColor = (e) => {
    if (!quill) return;

    quill.format('background', e.target.value);
  };

  const handleLink = () => {
    if (!quill) return;

    const selection = quill.getSelection();
    if (selection) {
      const currentFormat = quill.getFormat();
      if (currentFormat.link) {
        quill.format('link', false);
      } else {
        const url = prompt('Enter URL:');
        if (url) {
          quill.format('link', url);
        }
      }
    }
  };

  const handleImage = () => {
    if (!quill) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleHeader = (e) => {
    if (!quill) return;

    const value = e.target.value;
    quill.format('header', value === 'normal' ? false : parseInt(value));
  };

  return (
    <ToolbarContainer ref={toolbarRef}>
      <ToolGroup>
        <Select onChange={handleFontFamily}>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </Select>
      </ToolGroup>

      <ToolGroup>
        <Select onChange={handleFontSize}>
          <option value="small">Small</option>
          <option value="normal" selected>Normal</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </Select>
      </ToolGroup>

      <ToolGroup>
        <Select onChange={handleHeader}>
          <option value="normal">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </Select>
      </ToolGroup>

      <ToolGroup>
        <ToolButton onClick={() => handleFormatText('bold')} title="Bold">
          <FiBold size={18} />
        </ToolButton>
        <ToolButton onClick={() => handleFormatText('italic')} title="Italic">
          <FiItalic size={18} />
        </ToolButton>
        <ToolButton onClick={() => handleFormatText('underline')} title="Underline">
          <FiUnderline size={18} />
        </ToolButton>
        <ToolButton onClick={() => handleFormatText('strike')} title="Strikethrough">
          <FiMinus size={18} />
        </ToolButton>
      </ToolGroup>

      <ToolGroup>
        <ColorPicker
          type="color"
          onChange={handleColor}
          title="Text Color"
          defaultValue="#000000"
        />
        <ColorPicker
          type="color"
          onChange={handleBackgroundColor}
          title="Background Color"
          defaultValue="#ffffff"
        />
      </ToolGroup>

      <ToolGroup>
        <ToolButton onClick={() => handleAlign('left')} title="Align Left">
          <FiAlignLeft size={18} />
        </ToolButton>
        <ToolButton onClick={() => handleAlign('center')} title="Align Center">
          <FiAlignCenter size={18} />
        </ToolButton>
        <ToolButton onClick={() => handleAlign('right')} title="Align Right">
          <FiAlignRight size={18} />
        </ToolButton>
        <ToolButton onClick={() => handleAlign('justify')} title="Justify">
          <FiAlignJustify size={18} />
        </ToolButton>
      </ToolGroup>

      <ToolGroup>
        <ToolButton onClick={() => handleList('bullet')} title="Bullet List">
          <FiList size={18} />
        </ToolButton>
        <ToolButton onClick={() => handleList('ordered')} title="Numbered List">
          <FiType size={18} />
        </ToolButton>
      </ToolGroup>

      <ToolGroup>
        <ToolButton onClick={handleLink} title="Insert Link">
          <FiLink size={18} />
        </ToolButton>
        <ToolButton onClick={handleImage} title="Insert Image">
          <FiImage size={18} />
        </ToolButton>
      </ToolGroup>
    </ToolbarContainer>
  );
};

export default Toolbar;
