import React from 'react';
import * as ReactDOM from 'react-dom';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { useThemeState } from 'src/context/ThemeState'

import { pinJSONToIPFS, pinFileToIPFS, gateway } from 'src/apps/lib/ipfs'


// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import './MarkdownEditor.css';


import config from 'src/config'

const dev = config.dev

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

const mdParser = new MarkdownIt({
  html: true,
});

async function onImageUpload(file) {
  if (!file) return
  if (dev) console.log('upload image')
  
  try {
    const cid = await pinFileToIPFS(file)
    if (dev) console.log('file cid', `${gateway}${cid}`)
    return `${gateway}${cid}`
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
}


export const MarkdownEditor = ({onChange, value}) => {
  const { darkmodeEnabled } = useThemeState()
  return (
    <MdEditor 
      value={value}
      style={{ height: '500px', zIndex: 10000 }} 
      id={darkmodeEnabled ? 'editor_dark' : 'editor_light'}
      htmlClass={darkmodeEnabled ? 'editor_dark_html custom-html-style' : 'editor_light_html custom-html-style'}
      markdownClass={darkmodeEnabled ? 'editor_dark_markdown' : 'editor_light_markdown'}
      onImageUpload={onImageUpload}
      onChange={onChange}
      renderHTML={text => mdParser.render(text)}
    />
  );
};

// https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/docs/configure.md