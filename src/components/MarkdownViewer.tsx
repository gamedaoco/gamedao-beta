import MarkdownIt from 'markdown-it';
import { useThemeState } from 'src/context/ThemeState'
import './MarkdownEditor.css';

const mdParser = new MarkdownIt({
    html: true,
});

export const MarkdownViewer = function(props) {
    const { darkmodeEnabled } = useThemeState()
    const markdown = mdParser.render(props.markdown || '')
    const classes = darkmodeEnabled ? 'editor_dark_html' : 'editor_light_html'
    return <div className={`gamedao custom-html-style ${classes}`} dangerouslySetInnerHTML={{__html:markdown}} />;
}