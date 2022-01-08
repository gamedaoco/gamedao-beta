import React, { useMemo } from 'react';
import * as ReactDOM from 'react-dom';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { html5IPFSMedia } from './markdownItIPFSMediaPlugin'
import { useThemeState } from 'src/context/ThemeState'

// TODO: check if needed, move to theme folder
// import '../../mkEditor.css';

import { pinJSONToIPFS, pinFileToIPFS, gateway } from 'src/lib/ipfs'


// TODO: move css to theme folder
// import style manually
// import 'react-markdown-editor-lite/lib/index.css';
// import './MarkdownEditor.css';


import config from 'src/config'

const dev = config.dev

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

const mdParser = new MarkdownIt({
  //html: true,
});

mdParser.use(html5IPFSMedia);


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
  return useMemo( () => {
    return <MdEditor
        value={value}
		style={{ height: '500px', '.full': {zIndex: 10000} }}
        id={darkmodeEnabled ? 'editor_dark' : 'editor_light'}
        htmlClass={darkmodeEnabled ? 'editor_dark_html custom-html-style' : 'editor_light_html custom-html-style'}
        markdownClass={darkmodeEnabled ? 'editor_dark_markdown' : 'editor_light_markdown'}
        onImageUpload={onImageUpload}
        onChange={onChange}
        renderHTML={text => mdParser.render(text)}
      />
  }, [value]);
};

// https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/docs/configure.md
